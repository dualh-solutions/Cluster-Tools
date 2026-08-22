import { NextResponse } from 'next/server';
import youtubedl from 'youtube-dl-exec';
import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import path from 'path';

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

    const options: any = {
      dumpJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      noCacheDir: true,
      preferFreeFormats: true,
      forceIpv4: true,
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

    // Try ytdl-core fallback for YouTube if bot blocked
    if ((url.includes('youtube.com') || url.includes('youtu.be')) && (msg.includes('Sign in') || msg.includes('bot'))) {
      try {
        console.log("Attempting ytdl-core fallback...");
        const info = await ytdl.getInfo(url);
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
        // Fall through to original error if this also fails
      }
    }

    return NextResponse.json({ error: msg, fullError: error.toString(), stderr: error.stderr }, { status: 500 });
  }
}
