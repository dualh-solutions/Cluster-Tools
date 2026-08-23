"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { getToolBySlug } from "@/lib/tools/registry";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Download, Loader2, Link as LinkIcon, AlertCircle, CheckCircle2, Check, Shield, Zap, Lock } from "lucide-react";

export default function SocialMediaDownloaderTool() {
  const params = useParams();
  const slug = params?.slug as string;
  const tool = slug ? getToolBySlug(slug) : null;
  
  const defaultTitle = "Universal Social Media Downloader";
  const defaultDesc = "Download videos from YouTube, Instagram, TikTok, Twitter, and more instantly.";
  
  const title = tool?.name || defaultTitle;
  const description = tool?.description || defaultDesc;
  const placeholder = tool ? `Paste your ${tool.name.replace(' Video Downloader', '').replace(' Downloader', '')} URL here...` : "Paste your video URL here...";
  const helperText = tool ? `Supports downloading from ${tool.name.replace(' Video Downloader', '').replace(' Downloader', '')}.` : "Supports YouTube, Instagram, TikTok, Twitter, Facebook and more.";

  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<"idle" | "fetching-info" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<{ title: string; thumbnail?: string; quality?: string; downloadUrl?: string; formats?: any[]; safeTitle?: string; filename: string } | null>(null);
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
      
      setInfo({ ...data, filename: data.filename || "video.mp4" });
      if (data.formats && data.formats.length > 0) {
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

    if (info.formats && info.formats.length > 0) {
      const selectedFormatObj = info.formats.find(f => f.quality === selectedFormat);
      if (selectedFormatObj && selectedFormatObj.status_url) {
        setIsPolling(true);
        setPollMessage("Processing video on server... (Please wait)");
        try {
          let attempts = 0;
          let finalDownloadUrl = "";
          
          while (attempts < 600) {
            const res = await fetch(`/api/poll?status_url=${encodeURIComponent(selectedFormatObj.status_url)}`);
            if (res.ok) {
              const data = await res.json();
              if (data.status === "done" && data.url) {
                finalDownloadUrl = data.url;
                break;
              } else if (data.status === "error") {
                throw new Error("Server failed to process the video.");
              } else if (data.status === "processing" && data.percent !== undefined) {
                setPollMessage(`Processing: ${data.percent}%`);
              } else if (data.status === "processing") {
                setPollMessage("Processing video... please wait.");
              }
            }
            await new Promise(r => setTimeout(r, 2000));
            attempts++;
            
            // Fallbacks in case API doesn't send percent
            if (attempts > 15 && !pollMessage.includes('%')) setPollMessage("Still processing... larger files take longer.");
            if (attempts > 45 && !pollMessage.includes('%')) setPollMessage("Almost there! Extracting media...");
          }
          
          setIsPolling(false);
          
          if (!finalDownloadUrl) throw new Error("Timed out waiting for video.");
          
          const a = document.createElement("a");
          a.href = finalDownloadUrl;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setClicked(true);
        } catch (err: any) {
          setIsPolling(false);
          setError(err.message || "Failed to download video.");
          setStage("error");
        }
        return;
      }
    }

    const isAudio = selectedFormat === 'mp3';
    let finalUrl = info.downloadUrl;
    
    if (info.formats) {
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
      title={title}
      description={description}
      hideSafetyBox
      hideHowItWorks
      noChildrenBox
    >
      <div className="w-full flex flex-col gap-6">
        {/* Box 1: Form */}
        <div className="w-full bg-surface rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-border p-6 sm:p-8 flex flex-col">
          <form onSubmit={handleGetLink} className="flex flex-col md:flex-row w-full gap-3">
            <div className="relative flex-1 w-full">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-muted" />
              <input
                type="url" required placeholder={placeholder}
                className="w-full h-[52px] pl-12 pr-4 text-[15px] rounded-xl border border-border bg-transparent text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                value={url} onChange={(e) => { setUrl(e.target.value); setStage("idle"); }}
              />
            </div>
            <button 
              type="submit" 
              disabled={stage === "fetching-info"} 
              className="h-[52px] w-full md:w-auto shrink-0 whitespace-nowrap px-8 text-[15px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold flex justify-center items-center disabled:opacity-50 transition-colors"
            >
              {stage === "fetching-info" ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Getting Info...</>
              ) : "Get Download Link"}
            </button>
          </form>
          <p className="mt-4 text-[13px] text-ink-muted">{helperText}</p>

          {stage === "error" && (
            <div className="mt-6 p-4 bg-danger/10 border border-danger/20 text-danger rounded-[var(--radius-md)] flex items-center gap-3">
              <AlertCircle className="h-5 w-5" /> {error}
            </div>
          )}

          {stage === "ready" && info && (
            <div className="mt-6 border border-border rounded-[var(--radius-md)] overflow-hidden bg-surface">
              {info.thumbnail && (
                <div className="w-full relative aspect-video bg-surface-variant/20 border-b border-border">
                  <img src={info.thumbnail} alt="thumbnail" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="p-5 space-y-4">
                <h3 className="font-medium text-lg text-ink">{info.title}</h3>
                {!clicked ? (
                  <div className="space-y-3">
                    {info.formats && info.formats.length > 0 && (
                      <div className="w-full">
                        <label className="block text-[13px] font-medium text-ink-muted mb-1.5">Select Quality:</label>
                        <select 
                          value={selectedFormat}
                          onChange={(e) => setSelectedFormat(e.target.value)}
                          className="w-full p-3 rounded-xl border border-border bg-transparent text-ink text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                          {info.formats.map((f: any, idx: number) => (
                            <option key={idx} value={f.quality}>
                              {f.quality === 'mp3' ? 'MP3 Audio' : f.quality} {f.size ? `(${f.size})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button onClick={handleSave} disabled={isPolling} className="w-full py-3.5 bg-[#2563EB] text-white rounded-xl font-medium flex justify-center items-center hover:bg-[#1D4ED8] transition-colors disabled:opacity-75">
                      {isPolling ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {pollMessage}</>
                      ) : (
                        <><Download className="mr-2 h-5 w-5" /> Save {selectedFormat === 'mp3' ? 'MP3' : 'MP4'} to Device</>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center w-full mt-2">
                    <p className="text-[14px] font-medium text-ink mb-3">Download started!</p>
                    <div className="w-full h-1.5 bg-success/20 rounded-full overflow-hidden relative">
                       <div className="h-full w-1/3 bg-success rounded-full absolute top-0 left-0 animate-progress-slide"></div>
                    </div>
                    <p className="text-[12px] text-ink-muted mt-3 font-normal">Please wait, check your browser's download bar when ready.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Box 2: Custom Safety Box */}
        <div className="w-full bg-surface rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-border p-6 sm:p-8 flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-white shrink-0">
              <Check className="w-6 h-6" strokeWidth={3} />
            </div>
            <div className="flex flex-col text-left">
              <h4 className="text-[16px] font-bold text-ink mb-0.5">Your files are safe with us</h4>
              <p className="text-[14px] text-ink-muted leading-relaxed">
                100% private. Files are processed in your browser and never uploaded to any server.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-border bg-transparent flex items-center justify-center text-ink-muted">
                <Shield className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <h5 className="font-semibold text-ink text-[13px]">100% Private</h5>
                <p className="text-[12px] text-ink-muted mt-0.5">Your data is never stored</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-border bg-transparent flex items-center justify-center text-ink-muted">
                <Zap className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <h5 className="font-semibold text-ink text-[13px]">Fast Download</h5>
                <p className="text-[12px] text-ink-muted mt-0.5">High speed processing</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-border bg-transparent flex items-center justify-center text-ink-muted">
                <Lock className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <h5 className="font-semibold text-ink text-[13px]">Secure & Safe</h5>
                <p className="text-[12px] text-ink-muted mt-0.5">Encrypted connection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
