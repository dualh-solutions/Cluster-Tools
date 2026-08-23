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
      const args = [
        '--dump-json',
        '--no-warnings',
        '--no-check-certificate',
        '--prefer-free-formats',
        '--force-ipv4',
        sourceUrl
      ];

      if (process.env.COOKIES || process.env.YOUTUBE_COOKIES) {
        const cookiePath = require('path').join('/tmp', 'cookies.txt');
        require('fs').writeFileSync(cookiePath, process.env.COOKIES || process.env.YOUTUBE_COOKIES || '');
        args.push('--cookies', cookiePath);
      }

      const execAsync = require('util').promisify(require('child_process').execFile);
      const binPath = require('youtube-dl-exec').create(require('youtube-dl-exec').constants.YOUTUBE_DL_DIR).catch(()=>'yt-dlp');
      
      try {
        const { stdout } = await execAsync(await binPath, args);
        const info = JSON.parse(stdout);
        const isGoodProtocol = (f: any) => f.url && (f.protocol === 'https' || f.protocol === 'http' || (f.protocol || '').includes('m3u8'));
        
        const formats: any[] = info.formats || [];
        const videoFmt = formats
          .filter(f => f.vcodec !== 'none' && f.acodec === 'none' && isGoodProtocol(f))
          .sort((a, b) => (b.height ?? 0) - (a.height ?? 0))
          .find(f => (f.height ?? 9999) <= 720);
        
        const audioFmt = formats
          .filter(f => f.acodec !== 'none' && f.vcodec === 'none' && isGoodProtocol(f))
          .sort((a, b) => (b.abr ?? 0) - (a.abr ?? 0))[0];
        
        const combinedFmt = formats
          .filter(f => f.vcodec !== 'none' && f.acodec !== 'none' && isGoodProtocol(f))
          .sort((a, b) => (b.height ?? 0) - (a.height ?? 0))
          .find(f => (f.height ?? 9999) <= 720);

        if (videoFmt && audioFmt) {
           targetVideoUrl = videoFmt.url;
           // audioUrl = audioFmt.url; // We don't merge audio in this fallback for simplicity to avoid ffmpeg timeout, rely on combined
        }
        
        if (combinedFmt) {
           targetVideoUrl = combinedFmt.url;
        } else if (!targetVideoUrl && formats.length > 0) {
           targetVideoUrl = formats[0].url;
        }
      } catch (e: any) {
         console.error("youtube-dl-exec merge-download error:", e);
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
