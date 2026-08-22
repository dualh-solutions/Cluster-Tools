# Universal Social Media Video Downloader Implementation

I need you to build a highly robust, production-ready "Universal Social Media Video Downloader" tool for my Next.js App Router project. This tool will support downloading from **YouTube, Instagram, TikTok, Twitter/X, Facebook, Reddit, Pinterest, and 1000+ other sites**.

Because platforms (especially YouTube) split high-quality video and audio into separate streams, we cannot just scrape a simple URL. We also MUST NOT download the file to the server's disk (which causes timeouts) and we MUST NOT use `fetch().then(res => res.blob())` on the frontend (which crashes the browser's RAM on mobile).

Instead, we will build a "Streaming Remux" architecture: FFmpeg will read the streams directly from the platform's CDN and pipe them straight into the browser's native download manager in real-time.

Please execute the following steps exactly as written.

## Step 1: Install Dependencies
Run this command in the terminal to install the `yt-dlp` wrapper (which actually supports almost all social media sites, not just YouTube) and the pre-compiled ffmpeg binary:
```bash
npm install youtube-dl-exec ffmpeg-static lucide-react
```

## Step 2: Update next.config.ts
Open `next.config.ts` (or `.js`) and add these packages to `serverExternalPackages` so the Vercel/Next build process doesn't break the binaries:
```typescript
const nextConfig = {
  serverExternalPackages: ['youtube-dl-exec', 'ffmpeg-static'],
};
export default nextConfig;
```

## Step 3: Create the Metadata Route
Create `app/api/download/route.ts`. This route ONLY fetches metadata (title, thumbnail, quality) quickly, and returns a download link pointing to our merge route. Paste this exact code:

```typescript
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
```

## Step 4: Create the Streaming Merge Route
Create `app/api/merge-download/route.ts`. This route fetches fresh stream URLs, spawns ffmpeg, and pipes the output directly to the browser. Paste this exact code:

```typescript
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
```

## Step 5: Create the Frontend Component
Create a UI component for the downloader. **CRITICAL: The download button MUST use a native `<a>` tag click, NOT a fetch API call.** This allows the browser's download manager to handle the stream directly. Paste this exact code into `components/VideoDownloader.tsx`:

```tsx
"use client";

import React, { useState } from "react";
import { Download, Loader2, Link as LinkIcon, AlertCircle, CheckCircle2, Film } from "lucide-react";

export function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<"idle" | "fetching-info" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<{ title: string; thumbnail?: string; quality?: string; downloadUrl: string; filename: string } | null>(null);
  const [clicked, setClicked] = useState(false);

  const handleGetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setStage("fetching-info"); setError(null); setInfo(null); setClicked(false);
    
    try {
      const res = await fetch("/api/download", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to process video.");
      
      setInfo({ ...data, filename: data.filename || "video.mp4" });
      setStage("ready");
    } catch (err: any) {
      setError(err.message); setStage("error");
    }
  };

  const handleSave = () => {
    if (!info) return;
    const a = document.createElement("a");
    a.href = info.downloadUrl;
    a.download = info.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setClicked(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleGetLink} className="space-y-4">
        <div className="relative">
          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="url" required placeholder="Paste YouTube, TikTok, Instagram, Twitter, or Reddit link..."
            className="w-full pl-12 py-4 text-lg rounded-xl border focus:ring-2 focus:ring-blue-500"
            value={url} onChange={(e) => { setUrl(e.target.value); setStage("idle"); }}
          />
        </div>
        <button type="submit" disabled={stage === "fetching-info"} className="w-full py-4 text-lg rounded-xl bg-blue-600 text-white font-semibold flex justify-center items-center">
          {stage === "fetching-info" ? <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Getting Info...</> : "Get Download Link"}
        </button>
      </form>

      {stage === "error" && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      )}

      {stage === "ready" && info && (
        <div className="border rounded-xl overflow-hidden">
          {info.thumbnail && <img src={info.thumbnail} alt="thumbnail" className="w-full aspect-video object-cover" />}
          <div className="p-5 space-y-4">
            <h3 className="font-semibold text-lg">{info.title}</h3>
            {!clicked ? (
              <button onClick={handleSave} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold flex justify-center items-center">
                <Download className="mr-2 h-5 w-5" /> Save MP4 to Device
              </button>
            ) : (
              <div className="text-center text-green-600 font-medium">
                <CheckCircle2 className="mx-auto h-8 w-8 mb-2" />
                Download started! Check your browser's download bar.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

## Final Step
Please review the code, generate the files, and confirm when complete. Do not change the streaming logic or the `<a>` tag download method, as they are specifically designed to prevent server and browser timeouts.
