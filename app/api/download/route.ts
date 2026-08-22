import { NextResponse } from 'next/server';
import youtubedl from 'youtube-dl-exec';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

    const meta = await youtubedl(url, {
      dumpJson: true,
      noWarnings: true,
      noCheckCertificate: true,
    } as any) as any;

    if (!meta) return NextResponse.json({ error: 'Failed to fetch video info.' }, { status: 400 });

    const formats: any[] = meta.formats || [];
    const videoFmt = formats
      .filter(f => f.vcodec !== 'none' && f.acodec === 'none' && f.protocol === 'https')
      .sort((a, b) => (b.height ?? 0) - (a.height ?? 0))
      .find(f => (f.height ?? 9999) <= 720);

    const quality = videoFmt?.height ? `${videoFmt.height}p` : 'Best';
    const safeTitle = (meta.title || 'video').replace(/[^\w\s\-]/g, '').trim().replace(/\s+/g, '_').slice(0, 100);

    // Pass the original URL to the merge endpoint so it fetches fresh CDN links at download time
    const downloadUrl = `/api/merge-download?url=${encodeURIComponent(url)}&title=${encodeURIComponent(safeTitle)}`;

    return NextResponse.json({
      status: 'success',
      title: meta.title || 'Video',
      thumbnail: meta.thumbnail,
      duration: meta.duration,
      quality,
      downloadUrl,
      filename: `${safeTitle}.mp4`,
    });

  } catch (error: any) {
    let msg = 'Failed to process video. Make sure the URL is public.';
    if (error.stderr) {
      const line = (error.stderr as string).split('\n').find((l: string) => l.includes('ERROR:'));
      if (line) msg = line.replace('ERROR:', '').trim();
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
