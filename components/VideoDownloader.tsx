"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Download, Loader2, Link as LinkIcon, AlertCircle, CheckCircle2, Film } from "lucide-react";

export function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<"idle" | "fetching-info" | "processing" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<{ title: string; thumbnail?: string; quality?: string; downloadUrl: string; statusUrl?: string; filename: string } | null>(null);
  const [clicked, setClicked] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === "processing" && info?.statusUrl) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(info.statusUrl as string);
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'processing') {
              setProgress(data.percent || 0);
            } else if (data.status === 'done' && data.url) {
              setInfo((prev: any) => ({ ...prev, downloadUrl: data.url }));
              setStage("ready");
            } else if (data.status === 'error') {
              setError("Processing failed on the server.");
              setStage("error");
            }
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [stage, info?.statusUrl]);

  const handleGetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setStage("fetching-info"); setError(null); setInfo(null); setClicked(false); setProgress(0);
    
    try {
      const res = await fetch("/api/download", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to process video.");
      
      setInfo({ ...data, filename: data.filename || "video.mp4" });
      
      if (data.statusUrl) {
        setStage("processing");
      } else {
        setStage("ready");
      }
    } catch (err: any) {
      setError(err.message); setStage("error");
    }
  };

  const handleSave = () => {
    if (!info) return;
    
    // For RapidAPI YouTube direct URLs, bypass our Vercel proxy to prevent 60s timeouts on large videos
    const isDirectUrl = info.downloadUrl.includes('speedlycdn.online') || info.downloadUrl.includes('googlevideo');
    
    if (isDirectUrl) {
      window.open(info.downloadUrl, '_blank');
    } else {
      const a = document.createElement("a");
      a.href = info.downloadUrl;
      a.download = info.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
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
          <button type="submit" disabled={stage === "fetching-info" || stage === "processing"} className="w-full py-4 text-lg rounded-xl bg-blue-600 text-white font-semibold flex justify-center items-center disabled:opacity-70 transition-opacity">
            {stage === "fetching-info" ? <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Getting Info...</> : "Get Download Link"}
          </button>
        </form>

        {stage === "error" && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-3 w-full">
            <AlertCircle className="h-5 w-5" /> {error}
          </div>
        )}

        {stage === "processing" && info && (
          <div className="border rounded-xl overflow-hidden w-full p-6 text-center space-y-4 bg-blue-50/50">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
            <div>
              <h3 className="font-semibold text-lg text-blue-900">Processing Video... {progress}%</h3>
              <p className="text-sm text-blue-700/80 mt-1">This may take a minute for longer videos. Please don't close this page.</p>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {stage === "ready" && info && (
          <div className="border rounded-xl overflow-hidden w-full">
            {info.thumbnail && <img src={info.thumbnail} alt="thumbnail" className="w-full aspect-video object-cover" />}
            <div className="p-5 space-y-4">
              <h3 className="font-semibold text-lg">{info.title}</h3>
              {!clicked ? (
                <button onClick={handleSave} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold flex justify-center items-center hover:bg-blue-700 transition-colors">
                  <Download className="mr-2 h-5 w-5" /> Save MP4 to Device
                </button>
              ) : (
                <div className="text-center w-full bg-green-50 p-4 rounded-xl border border-green-100">
                  <CheckCircle2 className="mx-auto h-8 w-8 mb-2 text-green-600" />
                  <p className="text-green-700 font-medium">Download started!</p>
                  {info.downloadUrl.includes('speedlycdn.online') || info.downloadUrl.includes('googlevideo') ? (
                    <p className="text-sm text-green-600/80 mt-2">If the video opened in a new tab instead of downloading automatically, simply press <strong>Ctrl+S</strong> (or right-click and click "Save Video As...") to save it to your device.</p>
                  ) : (
                    <p className="text-sm text-green-600/80 mt-2">Check your browser's download bar.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
