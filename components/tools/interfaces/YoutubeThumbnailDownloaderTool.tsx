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
    </ToolLayout>
  );
}
