import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import youtubedl from 'youtube-dl-exec';
import ytdl from '@distube/ytdl-core';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';

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
    let targetVideoUrl: string | undefined = undefined;
    let audioUrl: string | undefined = undefined;

    if (sourceUrl.includes('tiktok.com') || sp.get('isTikTok') === 'true') {
      const tikwmRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(sourceUrl)}`);
      const tikwmData = await tikwmRes.json();
      if (tikwmData.code === 0 && tikwmData.data && tikwmData.data.play) {
        targetVideoUrl = tikwmData.data.play;
      }
    }

    if (!targetVideoUrl) {
      if (sp.get('fallback') === 'true') {
        const info = await ytdl.getInfo(sourceUrl);
        const formats = info.formats;
        
        // Find best video without audio
        const videoFmt = formats.filter(f => f.hasVideo && !f.hasAudio)
                                .sort((a, b) => (b.height || 0) - (a.height || 0))
                                .find(f => (f.height || 9999) <= 720);
                                
        // Find best audio
        const audioFmt = formats.filter(f => f.hasAudio && !f.hasVideo)
                                .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))[0];

        // Or combined if separate fails
        const combinedFmt = formats.filter(f => f.hasVideo && f.hasAudio)
                                   .sort((a, b) => (b.height || 0) - (a.height || 0))
                                   .find(f => (f.height || 9999) <= 720);

        if (videoFmt && audioFmt) {
          targetVideoUrl = videoFmt.url;
          audioUrl = audioFmt.url;
        } else if (combinedFmt) {
          targetVideoUrl = combinedFmt.url;
        }
      } else {
        const options: any = { 
          dumpJson: true, 
          noWarnings: true, 
          noCheckCertificate: true,
          noCacheDir: true,
          preferFreeFormats: true,
          forceIpv4: true,
          extractorArgs: 'youtube:player_client=android', // Bypasses PO token block but limits to 360p
        };

        if (process.env.YOUTUBE_COOKIES) {
          const cookiePath = path.join('/tmp', 'youtube-cookies.txt');
          fs.writeFileSync(cookiePath, process.env.YOUTUBE_COOKIES);
          options.cookies = cookiePath;
        }

        const meta = await youtubedl(sourceUrl, options) as any;
        const formats: any[] = meta.formats || [];

        const isGoodProtocol = (f: any) => f.url && (f.protocol === 'https' || f.protocol === 'http' || (f.protocol || '').includes('m3u8'));

        const combinedFmt = formats
          .filter(f => f.vcodec !== 'none' && f.acodec !== 'none' && isGoodProtocol(f) && f.ext === 'mp4')
          .sort((a, b) => (b.height ?? 0) - (a.height ?? 0))
          .find(f => (f.height ?? 9999) <= 720)
          ?? formats.find(f => f.vcodec !== 'none' && f.acodec !== 'none' && isGoodProtocol(f));

        const videoFmt = formats
          .filter(f => f.vcodec !== 'none' && f.acodec === 'none' && isGoodProtocol(f) && f.ext === 'mp4')
          .sort((a, b) => (b.height ?? 0) - (a.height ?? 0))
          .find(f => (f.height ?? 9999) <= 720 && (f.vcodec || '').startsWith('avc'))
          ?? formats.filter(f => f.vcodec !== 'none' && f.acodec === 'none' && isGoodProtocol(f))
            .sort((a, b) => (b.height ?? 0) - (a.height ?? 0)).find(f => (f.height ?? 9999) <= 720)
          ?? formats.find(f => f.vcodec !== 'none' && isGoodProtocol(f));

        const audioFmt = formats.find(f => f.format_id === '140' && f.url) 
          ?? formats.filter(f => f.acodec !== 'none' && f.vcodec === 'none' && isGoodProtocol(f) && f.ext === 'm4a')[0]
          ?? formats.filter(f => f.acodec !== 'none' && f.vcodec === 'none' && isGoodProtocol(f))[0];

        if (combinedFmt) {
          targetVideoUrl = combinedFmt.url;
          audioUrl = undefined;
        } else if (videoFmt && audioFmt) {
          targetVideoUrl = videoFmt.url;
          audioUrl = audioFmt.url;
        } else if (videoFmt) {
          targetVideoUrl = videoFmt.url;
          audioUrl = undefined;
        }
      }
    }

    if (!targetVideoUrl) return new Response('No downloadable stream found.', { status: 400 });

    const args: string[] = [
      '-loglevel', 'warning',
      '-user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      '-i', targetVideoUrl,
    ];

    if (audioUrl) {
      args.push('-user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '-i', audioUrl);
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
        proc.stdout.on('data', (chunk: Buffer) => {
          try { controller.enqueue(chunk); } catch {}
        });
        proc.stdout.on('end', () => { try { controller.close(); } catch {} });
        proc.on('error', (err) => { try { controller.error(err); } catch {} });
      },
    });

    return new Response(stream, { status: 200, headers });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
