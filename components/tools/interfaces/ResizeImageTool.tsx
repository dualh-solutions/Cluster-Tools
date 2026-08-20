"use client";

import React, { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Dropzone } from "@/components/tools/shared/Dropzone";
import { useFileQueue } from "@/lib/hooks/useFileQueue";
import { ResultCard } from "@/components/tools/ResultCard";
import { downloadResult } from "@/lib/utils/download";
import JSZip from "jszip";

type ResizeMode = "fit" | "percentage" | "exact";

export default function ResizeImageTool() {
  const {
    files,
    isDragActive,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    openFileDialog,
    fileInputRef,
    handleFileInput,
    updateFile,
    removeFile,
    clearQueue
  } = useFileQueue({
    accept: [".jpg", ".jpeg", ".png", ".webp", "image/jpeg", "image/png", "image/webp"],
    maxSizeMB: 25,
  });

  const [mode, setMode] = useState<ResizeMode>("fit");
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [percentage, setPercentage] = useState(50);
  const [aspectRatioLock, setAspectRatioLock] = useState(true);
  const [originalAspectRatio, setOriginalAspectRatio] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Calculate aspect ratio of the first file to drive the inputs
  useEffect(() => {
    if (files.length > 0 && originalAspectRatio === null) {
      const img = new Image();
      img.onload = () => {
        setOriginalAspectRatio(img.width / img.height);
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = URL.createObjectURL(files[0].file);
    } else if (files.length === 0 && originalAspectRatio !== null) {
      setTimeout(() => setOriginalAspectRatio(null), 0);
    }
  }, [files, originalAspectRatio]);

  const handleWidthChange = (val: string) => {
    const num = Number(val);
    if (val === "") {
      setWidth(0);
      return;
    }
    setWidth(num);
    if (aspectRatioLock && originalAspectRatio && num > 0) {
      setHeight(Math.round(num / originalAspectRatio));
    }
  };

  const handleHeightChange = (val: string) => {
    const num = Number(val);
    if (val === "") {
      setHeight(0);
      return;
    }
    setHeight(num);
    if (aspectRatioLock && originalAspectRatio && num > 0) {
      setWidth(Math.round(num * originalAspectRatio));
    }
  };

  const workerRef = useRef<Worker | null>(null);

  const handleResize = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setIsComplete(false);
    
    files.forEach(f => updateFile(f.id, { status: "processing", progress: 0 }));

    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('@/lib/workers/resize.worker.ts', import.meta.url));
    }

    const worker = workerRef.current;
    
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.status === "error") continue;
      
      const buffer = await f.file.arrayBuffer();

      await new Promise<void>((resolve) => {
        worker.onmessage = (e) => {
          const { type, result, message } = e.data;
          if (type === "done") {
            updateFile(f.id, { 
              status: "done", 
              progress: 100, 
              resultBlob: result,
              finalSize: result.size
            });
            resolve();
          } else if (type === "error") {
            updateFile(f.id, { status: "error", errorMessage: message });
            resolve();
          }
        };

        let workerWidth = width;
        const workerHeight = height;
        
        if (mode === "percentage") {
          workerWidth = percentage;
        }

        // Pass aspect ratio lock flag to worker if we need to preserve it for individual files
        worker.postMessage({ 
          buffer, 
          type: f.file.type || "image/jpeg",
          mode,
          width: workerWidth,
          height: workerHeight,
          aspectRatioLock
        }, [buffer]);
      });
    }

    setIsProcessing(false);
    setIsComplete(true);
  };

  const handleDownloadAll = async () => {
    const doneFiles = files.filter(f => f.status === "done" && f.resultBlob);

    if (doneFiles.length === 1) {
      const baseName = doneFiles[0].file.name.replace(/\.[^/.]+$/, "");
      const ext = doneFiles[0].file.name.split('.').pop();
      downloadResult(doneFiles[0].resultBlob!, `${baseName}_resized.${ext}`);
      return;
    }

    if (doneFiles.length > 1) {
      const zip = new JSZip();
      doneFiles.forEach(f => {
        const baseName = f.file.name.replace(/\.[^/.]+$/, "");
        const ext = f.file.name.split('.').pop();
        zip.file(`${baseName}_resized.${ext}`, f.resultBlob!);
      });
      const content = await zip.generateAsync({ type: "blob" });
      downloadResult(content, `resized_images.zip`);
    }
  };

  const handleReset = () => {
    clearQueue();
    setIsProcessing(false);
    setIsComplete(false);
    setOriginalAspectRatio(null);
  };

  return (
    <ToolLayout
      title="Resize Image Online"
      description="Scale image dimensions or fit them to specific constraints instantly."
    >
      {files.length === 0 && (
        <Dropzone
          isDragActive={isDragActive}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onBrowseClick={openFileDialog}
          fileInputNode={
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            />
          }
        />
      )}
      {files.length > 0 && (
        <div className="w-full bg-surface border border-border rounded-[var(--radius-lg)] p-6 md:p-8 mt-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-medium text-ink">Files</h2>
            <button 
              onClick={handleReset}
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Clear all
            </button>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {files.map((file) => (
              <ResultCard 
                key={file.id} 
                file={file} 
                onRemove={() => !isComplete && removeFile(file.id)} 
                showSavingsCounter={true}
              />
            ))}
          </div>
          
          {/* Options Panel */}
          {!isComplete && (
            <div className="bg-canvas rounded-[var(--radius-md)] p-6 mb-8 border border-border">
              <div className="flex flex-wrap gap-6 mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer focus-within:ring-2 focus-within:ring-primary rounded p-1">
                  <input 
                    type="radio" 
                    name="mode" 
                    checked={mode === "fit"} 
                    onChange={() => setMode("fit")} 
                    disabled={isProcessing}
                    className="text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  Fit to Max
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer focus-within:ring-2 focus-within:ring-primary rounded p-1">
                  <input 
                    type="radio" 
                    name="mode" 
                    checked={mode === "percentage"} 
                    onChange={() => setMode("percentage")} 
                    disabled={isProcessing}
                    className="text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  Percentage
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer focus-within:ring-2 focus-within:ring-primary rounded p-1">
                  <input 
                    type="radio" 
                    name="mode" 
                    checked={mode === "exact"} 
                    onChange={() => setMode("exact")} 
                    disabled={isProcessing}
                    className="text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  Exact Size
                </label>
              </div>

              {mode === "percentage" ? (
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-ink">Scale Percentage</label>
                    <span className="font-mono text-sm text-ink-muted">{percentage}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="200" 
                    value={percentage} 
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    disabled={isProcessing}
                    className="w-full accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">Width (px)</label>
                      <input 
                        type="number" 
                        value={width || ""}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        disabled={isProcessing}
                        className="w-24 bg-surface border border-border rounded-[var(--radius-sm)] px-3 py-2 text-sm focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary font-mono"
                        min="1"
                      />
                    </div>
                    <div className="text-ink-muted mt-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><line x1="12" y1="5" x2="12" y2="19"></line></svg>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">Height (px)</label>
                      <input 
                        type="number" 
                        value={height || ""}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        disabled={isProcessing}
                        className="w-24 bg-surface border border-border rounded-[var(--radius-sm)] px-3 py-2 text-sm focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary font-mono"
                        min="1"
                      />
                    </div>
                  </div>
                  {mode === "exact" && (
                    <label className="flex items-center gap-2 text-sm text-ink cursor-pointer mt-2 w-fit">
                      <input 
                        type="checkbox" 
                        checked={aspectRatioLock} 
                        onChange={(e) => setAspectRatioLock(e.target.checked)} 
                        disabled={isProcessing}
                        className="text-primary rounded border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      />
                      Lock Aspect Ratio
                    </label>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Area */}
          <div className="flex justify-end gap-4 border-t border-border pt-6">
            {!isComplete ? (
              <button
                onClick={handleResize}
                disabled={isProcessing || files.some(f => f.status === "error")}
                className="bg-primary hover:bg-primary-ink text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {isProcessing ? "Processing..." : "Resize Images"}
              </button>
            ) : (
              <button
                onClick={handleDownloadAll}
                className="bg-success text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors hover:bg-success/90 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2"
              >
                Download All{files.length > 1 ? " as .zip" : ""}
              </button>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
