"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Download, Loader2, Link as LinkIcon, AlertCircle, CheckCircle2, Music } from "lucide-react";

export default function YoutubeToMp3Tool() {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<"idle" | "fetching-info" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<{ title: string; thumbnail?: string; safeTitle?: string; filename?: string; formats?: any[] } | null>(null);
  const [clicked, setClicked] = useState(false);
  const [mp3Format, setMp3Format] = useState<any>(null);

  const handleGetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setStage("fetching-info"); setError(null); setInfo(null); setClicked(false); setMp3Format(null);
    
    try {
      const res = await fetch("/api/download", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to process video.");
      
      const mp3 = data.formats?.find((f: any) => f.quality === 'mp3');
      if (!mp3) throw new Error("MP3 audio not available for this video.");

      setMp3Format(mp3);
      setInfo({ ...data });
      setStage("ready");
    } catch (err: any) {
      setError(err.message); setStage("error");
    }
  };

  const [isPolling, setIsPolling] = useState(false);
  const [pollMessage, setPollMessage] = useState("");

  const handleSave = async () => {
    if (!info) return;
    
    if (mp3Format && mp3Format.status_url) {
      setIsPolling(true);
      setPollMessage("Extracting MP3 audio... (Please wait)");
      try {
        let attempts = 0;
        let finalDownloadUrl = "";
        
        while (attempts < 600) {
          const res = await fetch(`/api/poll?status_url=${encodeURIComponent(mp3Format.status_url)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === "done" && data.url) {
              finalDownloadUrl = data.url;
              break;
            } else if (data.status === "error") {
              throw new Error("Server failed to extract audio.");
            } else if (data.status === "processing" && data.percent !== undefined) {
              setPollMessage(`Extracting: ${data.percent}%`);
            } else if (data.status === "processing") {
              setPollMessage("Extracting audio... please wait.");
            }
          }
          await new Promise(r => setTimeout(r, 2000));
          attempts++;
          
          if (attempts > 15 && !pollMessage.includes('%')) setPollMessage("Still extracting... longer videos take more time.");
          if (attempts > 45 && !pollMessage.includes('%')) setPollMessage("Almost there! Finalizing MP3...");
        }
        
        setIsPolling(false);
        
        if (!finalDownloadUrl) throw new Error("Timed out waiting for MP3 extraction.");
        
        const a = document.createElement("a");
        a.href = finalDownloadUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setClicked(true);
      } catch (err: any) {
        setIsPolling(false);
        setError(err.message || "Failed to download MP3.");
        setStage("error");
      }
      return;
    }

    // Fallback if status_url is missing
    const finalUrl = `/api/merge-download?url=${encodeURIComponent(url)}&title=${encodeURIComponent(info.safeTitle || 'video')}&quality=mp3`;
    const filename = info.filename || `${info.safeTitle || 'audio'}.mp3`;

    const a = document.createElement("a");
    a.href = finalUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setClicked(true);
  };

  return (
    <ToolLayout
      title="YouTube to MP3 Converter"
      description="Extract high-quality MP3 audio from YouTube videos instantly."
    >
      <div className="w-full space-y-6">
        <form onSubmit={handleGetLink} className="space-y-4 w-full">
          <div className="relative w-full">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="url" required placeholder="Paste YouTube video link here..."
              className="w-full pl-12 py-4 text-lg rounded-xl border focus:ring-2 focus:ring-green-500"
              value={url} onChange={(e) => { setUrl(e.target.value); setStage("idle"); }}
            />
          </div>
          <button type="submit" disabled={stage === "fetching-info"} className="w-full py-4 text-lg rounded-xl bg-green-600 text-white font-semibold flex justify-center items-center hover:bg-green-700 transition-colors">
            {stage === "fetching-info" ? <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Extracting Audio...</> : "Convert to MP3"}
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
                <button onClick={handleSave} disabled={isPolling} className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex justify-center items-center transition-colors disabled:opacity-75">
                  {isPolling ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {pollMessage}</>
                  ) : (
                    <><Music className="mr-2 h-5 w-5" /> Download MP3 {mp3Format?.size ? `(${mp3Format.size})` : ''}</>
                  )}
                </button>
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
