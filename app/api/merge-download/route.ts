import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;
  const sourceUrl = sp.get('url') || '';
  const title = sp.get('title') || 'video';

  if (!sourceUrl) return new Response('Missing url', { status: 400 });

  const safeTitle = title.replace(/[^\w\s\-]/g, '').trim().replace(/\s+/g, '_').slice(0, 100) || 'video';
  const filename = `${safeTitle}.mp4`;

  try {
    let targetVideoUrl: string | undefined = undefined;

    if (sourceUrl.includes('tiktok.com') || sp.get('isTikTok') === 'true') {
      const tikwmRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(sourceUrl)}`);
      const tikwmData = await tikwmRes.json();
      if (tikwmData.code === 0 && tikwmData.data && tikwmData.data.play) {
        targetVideoUrl = tikwmData.data.play;
      }
    }

    if (!targetVideoUrl && (sourceUrl.includes('youtube.com') || sourceUrl.includes('youtu.be'))) {
      const extractVideoId = (u: string) => {
        const match = u.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^&]{11})/);
        return match ? match[1] : null;
      };
      
      const videoId = extractVideoId(sourceUrl);
      if (videoId) {
        try {
          const rapidApiRes = await fetch(`https://youtube-video-download7.p.rapidapi.com/wp-json/rapid-api/v1/download`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '1a7c315d9cmsh54106b1f0d38f22p1037d2jsn6b85d26c5ef8',
              'X-RapidAPI-Host': 'youtube-video-download7.p.rapidapi.com'
            },
            body: JSON.stringify({ url: sourceUrl })
          });
          
          if (rapidApiRes.ok) {
            const meta = await rapidApiRes.json();
            
            let statusUrl = null;
            if (meta && meta.videos && meta.videos.length > 0) {
              const bestVideo = meta.videos.find((v: any) => v.quality === '1080p') || 
                                meta.videos.find((v: any) => v.quality === '720p') || 
                                meta.videos[0];
              statusUrl = bestVideo.status_url;
            }

            if (statusUrl) {
              let attempts = 0;
              while (attempts < 60) {
                const statusRes = await fetch(statusUrl);
                if (statusRes.ok) {
                  const statusData = await statusRes.json();
                  if (statusData.status === 'done' && statusData.url) {
                    targetVideoUrl = statusData.url;
                    break;
                  }
                  if (statusData.status === 'error') {
                    console.error("API returned processing error");
                    break;
                  }
                }
                await new Promise(r => setTimeout(r, 1500));
                attempts++;
              }
            }
          } else {
             console.error("RapidAPI Error:", await rapidApiRes.text());
          }
        } catch (e: any) {
          console.error("RapidAPI Request Error:", e.message);
        }
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
