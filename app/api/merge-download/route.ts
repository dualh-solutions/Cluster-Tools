import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import youtubedl from 'youtube-dl-exec';
import ffmpegPath from 'ffmpeg-static';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;
  const sourceUrl = sp.get('url') || '';
  const title = sp.get('title') || 'video';

  if (!sourceUrl) return new Response('Missing url', { status: 400 });

  const ffmpeg = ffmpegPath as string;
  const safeTitle = title.replace(/[^\w\s\-]/g, '').trim().replace(/\s+/g, '_').slice(0, 100) || 'video';
  const filename = `${safeTitle}.mp4`;

  try {
    const meta = await youtubedl(sourceUrl, { dumpJson: true, noWarnings: true, noCheckCertificate: true } as any) as any;
    const formats: any[] = meta.formats || [];

    const videoFmt = formats
      .filter(f => f.vcodec !== 'none' && f.acodec === 'none' && f.url && f.protocol === 'https' && f.ext === 'mp4')
      .sort((a, b) => (b.height ?? 0) - (a.height ?? 0))
      .find(f => (f.height ?? 9999) <= 720 && (f.vcodec || '').startsWith('avc'))
      ?? formats.filter(f => f.vcodec !== 'none' && f.acodec === 'none' && f.url && f.protocol === 'https')
        .sort((a, b) => (b.height ?? 0) - (a.height ?? 0)).find(f => (f.height ?? 9999) <= 720);

    const audioFmt = formats.find(f => f.format_id === '140' && f.url) 
      ?? formats.filter(f => f.acodec !== 'none' && f.vcodec === 'none' && f.url && f.ext === 'm4a')[0]
      ?? formats.filter(f => f.acodec !== 'none' && f.vcodec === 'none' && f.url && f.protocol === 'https')[0];

    // For sites like TikTok/Instagram that sometimes return a single combined stream instead of split
    const combinedFmt = formats.find(f => f.acodec !== 'none' && f.vcodec !== 'none' && f.url && f.protocol === 'https');
    
    const targetVideoUrl = videoFmt?.url || combinedFmt?.url;
    if (!targetVideoUrl) return new Response('No downloadable stream found.', { status: 400 });

    const args: string[] = [
      '-loglevel', 'warning',
      '-user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      '-i', targetVideoUrl,
    ];

    if (audioFmt && !combinedFmt) {
      args.push('-user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '-i', audioFmt.url);
      args.push('-c:v', 'copy', '-c:a', 'copy'); // Copy streams directly to save CPU
    } else {
      args.push('-c:v', 'copy', '-c:a', 'copy');
    }

    // frag_keyframe is critical so we can stream mp4 without waiting for the end of the file
    args.push('-movflags', 'frag_keyframe+empty_moov+faststart', '-f', 'mp4', 'pipe:1');

    const headers = new Headers({
      'Content-Type': 'video/mp4',
      'Content-Disposition': `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });

    const stream = new ReadableStream({
      start(controller) {
        const proc = spawn(ffmpeg, args, { stdio: ['ignore', 'pipe', 'pipe'] });
        proc.stdout.on('data', (chunk: Buffer) => controller.enqueue(chunk));
        proc.stdout.on('end', () => { try { controller.close(); } catch {} });
        proc.on('error', (err) => { try { controller.error(err); } catch {} });
      },
    });

    return new Response(stream, { status: 200, headers });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
