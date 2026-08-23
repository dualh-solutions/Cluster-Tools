import { NextResponse } from 'next/server';
import youtubedl from 'youtube-dl-exec';
import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import path from 'path';

const YOUTUBE_API_KEY = "AIzaSyD8r1iyKTdMfcLIUyulfKdMCX7pUI10L7M";

export async function POST(request: Request) {
  let url = '';
  try {
    const body = await request.json();
    url = body.url;
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

    // TikWM Fallback for TikTok
    if (url.includes('tiktok.com')) {
      const tikwmRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
      const tikwmData = await tikwmRes.json();
      
      if (tikwmData.code === 0 && tikwmData.data) {
        const data = tikwmData.data;
        const safeTitle = (data.title || 'tiktok_video').replace(/[^\w\s\-]/g, '').trim().replace(/\s+/g, '_').slice(0, 100);
        
        return NextResponse.json({
          status: 'success',
          title: data.title || 'TikTok Video',
          thumbnail: data.cover,
          duration: data.duration,
          quality: 'HD',
          downloadUrl: `/api/merge-download?url=${encodeURIComponent(url)}&title=${encodeURIComponent(safeTitle)}&isTikTok=true`,
          filename: `${safeTitle}.mp4`,
        });
      }
    }

    // YouTube Data API Integration for fast metadata
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const extractVideoId = (u: string) => {
        const match = u.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^&]{11})/);
        return match ? match[1] : null;
      };
      const videoId = extractVideoId(url);
      if (videoId) {
        try {
          const ytApiRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`);
          const ytData = await ytApiRes.json();
          if (ytData.items && ytData.items.length > 0) {
            const item = ytData.items[0];
            const title = item.snippet.title;
            const safeTitle = (title || 'video').replace(/[^\w\s\-]/g, '').trim().replace(/\s+/g, '_').slice(0, 100);
            
            const parseIsoDuration = (duration: string) => {
              const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
              if (!match) return 0;
              const h = parseInt(match[1] || '0');
              const m = parseInt(match[2] || '0');
              const s = parseInt(match[3] || '0');
              return h * 3600 + m * 60 + s;
            };
            const duration = parseIsoDuration(item.contentDetails?.duration || '');
            const thumbnail = item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '';

            // Also initiate RapidAPI request right here to get the status_url
            let statusUrl = undefined;
            try {
              const rapidApiRes = await fetch(`https://youtube-video-download7.p.rapidapi.com/wp-json/rapid-api/v1/download`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '1a7c315d9cmsh54106b1f0d38f22p1037d2jsn6b85d26c5ef8',
                  'X-RapidAPI-Host': 'youtube-video-download7.p.rapidapi.com'
                },
                body: JSON.stringify({ url })
              });
              
              if (rapidApiRes.ok) {
                const meta = await rapidApiRes.json();
                if (meta && meta.videos && meta.videos.length > 0) {
                  const bestVideo = meta.videos.find((v: any) => v.quality === '1080p') || 
                                    meta.videos.find((v: any) => v.quality === '720p') || 
                                    meta.videos[0];
                  statusUrl = bestVideo.status_url;
                }
              }
            } catch (err) {
              console.error("RapidAPI Error in download route:", err);
            }

            return NextResponse.json({
              status: 'success',
              title: title,
              thumbnail: thumbnail,
              duration: duration,
              quality: 'HD',
              statusUrl: statusUrl,
              downloadUrl: `/api/merge-download?url=${encodeURIComponent(url)}&title=${encodeURIComponent(safeTitle)}`,
              filename: `${safeTitle}.mp4`,
            });
          }
        } catch (e: any) {
          console.error("YouTube Data API Error:", e.message);
          // Fallback to youtube-dl-exec if API fails
        }
      }
    }

    const options: any = {
      dumpJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      noCacheDir: true,
      preferFreeFormats: true,
      forceIpv4: true,
      extractorArgs: 'youtube:player_client=ios,tv,web_creator',
    };

    if (process.env.YOUTUBE_COOKIES) {
      const cookiePath = path.join('/tmp', 'youtube-cookies.txt');
      fs.writeFileSync(cookiePath, process.env.YOUTUBE_COOKIES);
      options.cookies = cookiePath;
    }

    const meta = await youtubedl(url, options) as any;

    if (!meta) return NextResponse.json({ error: 'Failed to fetch video info.' }, { status: 400 });

    const isGoodProtocol = (f: any) => f.url && (f.protocol === 'https' || f.protocol === 'http' || (f.protocol || '').includes('m3u8'));

    const formats: any[] = meta.formats || [];
    const videoFmt = formats
      .filter(f => f.vcodec !== 'none' && f.acodec === 'none' && isGoodProtocol(f))
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
    console.error("YouTube-DL Error:", error);
    let msg = 'Failed to process video. Make sure the URL is public.';
    if (error.stderr) {
      const line = (error.stderr as string).split('\n').find((l: string) => l.includes('ERROR:'));
      if (line) {
        msg = line.replace('ERROR:', '').trim();
      } else {
        msg = error.message || msg; // Fallback to message if no ERROR: string
      }
    } else if (error.message) {
      msg = error.message;
    }

    // Try ytdl-core fallback for YouTube if yt-dlp fails for ANY reason
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      try {
        console.log("Attempting ytdl-core fallback...");
        let agent;
        if (process.env.YOUTUBE_COOKIES) {
          const cookies = process.env.YOUTUBE_COOKIES.split('\n')
            .filter(l => l && !l.startsWith('#'))
            .map(line => {
              const parts = line.split('\t');
              if (parts.length >= 7) {
                return { domain: parts[0], path: parts[2], secure: parts[3] === 'TRUE', expirationDate: parseInt(parts[4], 10), name: parts[5], value: parts[6].replace('\r', '') };
              }
              return null;
            }).filter(Boolean);
          if (cookies.length > 0) {
             agent = ytdl.createAgent(cookies as any);
          }
        }
        const info = await ytdl.getInfo(url, { agent });
        const videoDetails = info.videoDetails;
        
        const safeTitle = (videoDetails.title || 'video').replace(/[^\w\s\-]/g, '').trim().replace(/\s+/g, '_').slice(0, 100);
        const downloadUrl = `/api/merge-download?url=${encodeURIComponent(url)}&title=${encodeURIComponent(safeTitle)}&fallback=true`;
        
        // Find a decent format for quality string
        const videoFmt = info.formats.find(f => f.hasVideo && !f.hasAudio && f.height && f.height <= 720);
        const quality = videoFmt?.height ? `${videoFmt.height}p` : 'HD';

        return NextResponse.json({
          status: 'success',
          title: videoDetails.title || 'YouTube Video',
          thumbnail: videoDetails.thumbnails?.[0]?.url || '',
          duration: parseInt(videoDetails.lengthSeconds || '0', 10),
          quality,
          downloadUrl,
          filename: `${safeTitle}.mp4`,
        });
      } catch (fallbackError: any) {
        console.error("ytdl-core fallback error:", fallbackError);
        // Return both errors for better debugging on Vercel
        return NextResponse.json({ 
          error: msg, 
          fallbackError: fallbackError.message,
          debug: "ytdl-core fallback also failed" 
        }, { status: 500 });
      }
    }

    return NextResponse.json({ error: msg, fullError: error.toString(), stderr: error.stderr }, { status: 500 });
  }
}