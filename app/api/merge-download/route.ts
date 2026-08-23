import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;
  const sourceUrl = sp.get('url') || '';
  const title = sp.get('title') || 'video';

  if (!sourceUrl) return new Response('Missing url', { status: 400 });

  const safeTitle = title.replace(/[^\w\s\-]/g, '').trim().replace(/\s+/g, '_').slice(0, 100) || 'video';
  const filename = `${safeTitle}.mp4`;

  try {
    let targetVideoUrl: string | undefined = undefined;

    if (sp.get('finalUrl')) {
      targetVideoUrl = sp.get('finalUrl') as string;
    } else if (sourceUrl.includes('tiktok.com') || sp.get('isTikTok') === 'true') {
      const tikwmRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(sourceUrl)}`);
      const tikwmData = await tikwmRes.json();
      if (tikwmData.code === 0 && tikwmData.data && tikwmData.data.play) {
        targetVideoUrl = tikwmData.data.play;
      }
    }

    if (!targetVideoUrl) {
      return new Response('Failed to get playable video URL from source.', { status: 500 });
    }

    // Now pipe the video stream
    const videoRes = await fetch(targetVideoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    });

    if (!videoRes.ok) {
      return new Response(`Failed to fetch video. Status: ${videoRes.status}`, { status: 500 });
    }

    const headers = new Headers();
    headers.set('Content-Type', 'video/mp4');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    if (videoRes.headers.has('content-length')) {
      headers.set('Content-Length', videoRes.headers.get('content-length') as string);
    }

    return new Response(videoRes.body as any, {
      status: 200,
      headers
    });

  } catch (err: any) {
    console.error('Error in merge-download:', err);
    return new Response(err.message, { status: 500 });
  }
}
