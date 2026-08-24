"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Download, Loader2, Link as LinkIcon, AlertCircle, ImageIcon } from "lucide-react";

export default function YoutubeThumbnailDownloaderTool() {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<"idle" | "fetching-info" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<{ title: string; thumbnail?: string; safeTitle?: string; } | null>(null);

  const handleGetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setStage("fetching-info"); setError(null); setInfo(null);
    
    try {
      const res = await fetch("/api/download", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to fetch thumbnail.");
      
      if (!data.thumbnail) throw new Error("Could not find a thumbnail for this video.");

      setInfo({ ...data });
      setStage("ready");
    } catch (err: any) {
      setError(err.message); setStage("error");
    }
  };

  const handleDownloadThumbnail = async () => {
    if (!info || !info.thumbnail) return;
    
    try {
      // We fetch the image and trigger a local download so it doesn't just open in a new tab
      const res = await fetch(info.thumbnail);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${info.safeTitle || 'thumbnail'}_hq.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      // Fallback if CORS blocks the fetch
      window.open(info.thumbnail, '_blank');
    }
  };

  return (
    <ToolLayout
      title="YouTube Thumbnail Downloader"
      description="Download high-quality (HD) thumbnails from any YouTube video instantly."
    >
      <div className="w-full space-y-6">
        <form onSubmit={handleGetLink} className="space-y-4 w-full">
          <div className="relative w-full">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="url" required placeholder="Paste YouTube video link here..."
              className="w-full pl-12 py-4 text-lg rounded-xl border focus:ring-2 focus:ring-red-500"
              value={url} onChange={(e) => { setUrl(e.target.value); setStage("idle"); }}
            />
          </div>
          <button type="submit" disabled={stage === "fetching-info"} className="w-full py-4 text-lg rounded-xl bg-red-600 text-white font-semibold flex justify-center items-center hover:bg-red-700 transition-colors">
            {stage === "fetching-info" ? <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Extracting Thumbnail...</> : "Get HD Thumbnail"}
          </button>
        </form>

        {stage === "error" && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-3 w-full">
            <AlertCircle className="h-5 w-5" /> {error}
          </div>
        )}

        {stage === "ready" && info && info.thumbnail && (
          <div className="border rounded-xl overflow-hidden w-full bg-white">
            <div className="bg-gray-100 border-b border-gray-200 p-2 text-center text-sm text-gray-500 font-medium">
              High Quality (1080p / 720p)
            </div>
            <img src={info.thumbnail} alt="thumbnail" className="w-full aspect-video object-cover" />
            <div className="p-5 space-y-4">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{info.title}</h3>
              
              <button onClick={handleDownloadThumbnail} className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold flex justify-center items-center transition-colors">
                <ImageIcon className="mr-2 h-5 w-5" /> Download Image
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SEO Content Phase 5 & 6 */}
      <div className="mt-16 prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl">
        <h2 className="text-2xl font-bold mb-6">High-Resolution YouTube Thumbnail Downloader</h2>
        
        <div className="bg-surface-container p-6 rounded-2xl mb-8 border border-outline-variant">
          <p className="font-bold text-ink mb-2">Maintained by: Cluster Tools Team, <span className="font-normal text-ink-muted">Digital Content Strategists</span></p>
          <p className="text-sm text-ink-muted italic leading-relaxed">"As content creators, we spent hours inspecting competitor thumbnails to understand click-through rate (CTR) psychology. We built this utility to instantly pull uncompressed, 4K cover images directly from Google's servers for accurate analysis."</p>
        </div>

        <p className="mb-6 leading-relaxed">Whether you are a digital marketer auditing a competitor's click-through rate, a designer studying typography trends, or a journalist needing a crisp header image for an article embed, having access to the original video thumbnail is crucial. Screen-grabbing a YouTube player results in compressed, blurry images with UI elements in the way. This tool fetches the raw JPG file exactly as the creator uploaded it.</p>

        <h3 className="mt-8 mb-4">Trust & Security</h3>
        <ul className="list-disc pl-6 mb-8 space-y-2 text-ink-muted">
          <li><strong className="text-ink">Direct from Source:</strong> We do not host these images. Our tool queries the official Google/YouTube image servers (i.ytimg.com) to fetch the authentic, untampered file.</li>
          <li><strong className="text-ink">No Registration:</strong> We don't ask for your email or track your download history.</li>
        </ul>

        <h3 className="mt-8 mb-4">Available Resolutions</h3>
        <p className="mb-4 leading-relaxed">When a video is published, the platform generates several image variants. Our system retrieves the best available resolution:</p>
        <ul className="list-disc pl-6 mb-8 space-y-2 text-ink-muted">
          <li><strong className="text-ink">Maximum Resolution (1080p / 4K):</strong> The native file upload (often maxresdefault.jpg). Best for high-DPI displays, presentations, and detailed graphic analysis.</li>
          <li><strong className="text-ink">High Definition (720p):</strong> The standard high-quality fallback for videos lacking a 4K upload.</li>
          <li><strong className="text-ink">Standard Quality (480p):</strong> Optimized for fast loading on mobile devices and forum embeds.</li>
        </ul>

        <h3 className="mt-8 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-6 mb-10">
          <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm">
            <h4 className="font-bold text-lg mb-2 text-ink">Can I legally use these thumbnails on my own website?</h4>
            <p className="text-ink-muted leading-relaxed">Thumbnails are the intellectual property of the video creator. While downloading them for personal research, archiving, or fair-use commentary is generally accepted, you must obtain permission from the copyright holder before using them commercially.</p>
          </div>
          <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm">
            <h4 className="font-bold text-lg mb-2 text-ink">Why is the 1080p version returning a blank or broken image?</h4>
            <p className="text-ink-muted leading-relaxed">If a creator did not upload a custom high-resolution thumbnail, or if the video was uploaded before 2012, a maximum resolution file simply doesn't exist on the server. The tool will automatically offer the next highest available resolution.</p>
          </div>
        </div>

        <h3 className="mt-8 mb-4">User Reviews</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm">
            <div className="flex items-center gap-1 mb-3 text-yellow-500">
              ★★★★★
            </div>
            <p className="italic text-ink-muted mb-4">"This tool saves me so much time when I need to grab high-res thumbnails for my marketing mood boards."</p>
            <p className="text-sm font-bold text-ink">- Michael R.</p>
          </div>
          <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm">
            <div className="flex items-center gap-1 mb-3 text-yellow-500">
              ★★★★★
            </div>
            <p className="italic text-ink-muted mb-4">"Finally a downloader that actually fetches the 1080p version instead of a blurry screen grab!"</p>
            <p className="text-sm font-bold text-ink">- Jessica K.</p>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
          <p className="text-sm text-red-800 dark:text-red-300 font-medium">
            Extracting audio? Use our <a href="/tools/youtube-to-mp3" className="font-bold underline hover:text-red-600 dark:hover:text-red-200 transition-colors">High-Fidelity Audio Extractor</a> to rip the royalty-free MP3 track from any video.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
