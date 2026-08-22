"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
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
    <ToolLayout
      title="YouTube Video Downloader"
      description="Download videos from YouTube, TikTok, Instagram, Twitter, and more directly in your browser."
    >
      <div className="w-full space-y-6">
        <form onSubmit={handleGetLink} className="space-y-4 w-full">
          <div className="relative w-full">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="url" required placeholder="Paste YouTube video link..."
              className="w-full pl-12 py-4 text-lg rounded-xl border focus:ring-2 focus:ring-blue-500"
              value={url} onChange={(e) => { setUrl(e.target.value); setStage("idle"); }}
            />
          </div>
          <button type="submit" disabled={stage === "fetching-info"} className="w-full py-4 text-lg rounded-xl bg-blue-600 text-white font-semibold flex justify-center items-center">
            {stage === "fetching-info" ? <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Getting Info...</> : "Get Download Link"}
          </button>
        </form>

        {stage === "error" && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-3 w-full">
            <AlertCircle className="h-5 w-5" /> {error}
          </div>
        )}

        {stage === "ready" && info && (
          <div className="border rounded-xl overflow-hidden w-full">
            {info.thumbnail && <img src={info.thumbnail} alt="thumbnail" className="w-full aspect-video object-cover" />}
            <div className="p-5 space-y-4">
              <h3 className="font-semibold text-lg">{info.title}</h3>
              {!clicked ? (
                <button onClick={handleSave} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold flex justify-center items-center">
                  <Download className="mr-2 h-5 w-5" /> Save MP4 to Device
                </button>
              ) : (
                <div className="text-center text-green-600 font-medium w-full">
                  <CheckCircle2 className="mx-auto h-8 w-8 mb-2" />
                  Download started! Check your browser's download bar.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
