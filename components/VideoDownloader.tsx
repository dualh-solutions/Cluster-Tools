"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Download, Loader2, Link as LinkIcon, AlertCircle, CheckCircle2, Film } from "lucide-react";

export function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<"idle" | "fetching-info" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<{ title: string; thumbnail?: string; quality?: string; downloadUrl?: string; formats?: any[]; safeTitle?: string; filename?: string } | null>(null);
  const [clicked, setClicked] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>("1080p");

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
      
      setInfo({ ...data });
      if (data.formats && data.formats.length > 0) {
        // Find best default format (1080p or 720p)
        const has1080p = data.formats.some((f: any) => f.quality === '1080p');
        const has720p = data.formats.some((f: any) => f.quality === '720p');
        setSelectedFormat(has1080p ? '1080p' : (has720p ? '720p' : data.formats[0].quality));
      }
      setStage("ready");
    } catch (err: any) {
      setError(err.message); setStage("error");
    }
  };

  const [isPolling, setIsPolling] = useState(false);
  const [pollMessage, setPollMessage] = useState("");

  const handleSave = async () => {
    if (!info) return;
    
    // Check if we have formats (YouTube API)
    if (info.formats && info.formats.length > 0) {
      const selectedFormatObj = info.formats.find(f => f.quality === selectedFormat);
      if (selectedFormatObj && selectedFormatObj.status_url) {
        setIsPolling(true);
        setPollMessage("Processing video on server... (Please wait)");
        try {
          let attempts = 0;
          let finalDownloadUrl = "";
          
          while (attempts < 60) {
            const res = await fetch(`/api/poll?status_url=${encodeURIComponent(selectedFormatObj.status_url)}`);
            if (res.ok) {
              const data = await res.json();
              if (data.status === "done" && data.url) {
                finalDownloadUrl = data.url;
                break;
              } else if (data.status === "error") {
                throw new Error("Server failed to process the video.");
              }
            }
            await new Promise(r => setTimeout(r, 2000));
            attempts++;
            if (attempts > 5) setPollMessage("Still processing... larger files take longer.");
            if (attempts > 20) setPollMessage("Almost there! Extracting media...");
          }
          
          setIsPolling(false);
          
          if (!finalDownloadUrl) throw new Error("Timed out waiting for video.");
          
          const a = document.createElement("a");
          a.href = finalDownloadUrl;
          // The API download URL usually forces a download, so we just click it
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setClicked(true);
        } catch (err: any) {
          setIsPolling(false);
          setError(err.message || "Failed to download video.");
          setStage("error");
        }
        return; // Exit early since we handled it
      }
    }

    // Fallback for TikTok or others that just provide a direct downloadUrl
    const isAudio = selectedFormat === 'mp3';
    let finalUrl = info.downloadUrl;
    
    if (info.formats) {
        // Fallback to proxy route if status_url wasn't found (should be rare)
        finalUrl = `/api/merge-download?url=${encodeURIComponent(url)}&title=${encodeURIComponent(info.safeTitle || 'video')}&quality=${selectedFormat}`;
    }

    const filename = info.filename || `${info.safeTitle || 'video'}.${isAudio ? 'mp3' : 'mp4'}`;

    const a = document.createElement("a");
    a.href = finalUrl as string;
    a.download = filename;
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
              type="url" required placeholder="Paste video link here..."
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
                <div className="space-y-3">
                  {info.formats && info.formats.length > 0 && (
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Quality:</label>
                      <select 
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-blue-500"
                      >
                        {info.formats.map((f: any, idx: number) => (
                          <option key={idx} value={f.quality}>
                            {f.quality === 'mp3' ? 'MP3 Audio' : f.quality} {f.size ? `(${f.size})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button onClick={handleSave} disabled={isPolling} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex justify-center items-center transition-colors disabled:opacity-75">
                    {isPolling ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {pollMessage}</>
                    ) : (
                      <><Download className="mr-2 h-5 w-5" /> Save {selectedFormat === 'mp3' ? 'MP3' : 'MP4'} to Device</>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center text-green-600 font-medium w-full p-4 border border-green-100 bg-green-50 rounded-xl">
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
