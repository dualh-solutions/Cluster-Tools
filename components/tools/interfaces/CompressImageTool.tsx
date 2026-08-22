"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Dropzone } from "@/components/tools/shared/Dropzone";
import { useFileQueue } from "@/lib/hooks/useFileQueue";
import { ResultCard } from "@/components/tools/ResultCard";
import { downloadResult } from "@/lib/utils/download";
import JSZip from "jszip";

type Mode = "quality" | "targetSize";

export default function CompressImagePage() {
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

  const [mode, setMode] = useState<Mode>("quality");
  const [quality, setQuality] = useState(80);
  const [targetSizeKB, setTargetSizeKB] = useState(500);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const workerRef = useRef<Worker | null>(null);

  const handleCompress = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setIsComplete(false);
    
    files.forEach(f => updateFile(f.id, { status: "processing", progress: 0 }));

    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('@/lib/workers/compress.worker.ts', import.meta.url));
    }

    const worker = workerRef.current;
    
    // Process files sequentially to avoid overwhelming the worker/memory
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.status === "error") continue;
      
      const buffer = await f.file.arrayBuffer();
      const targetSizeBytes = mode === "targetSize" ? targetSizeKB * 1024 : undefined;

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

        worker.postMessage({ 
          buffer, 
          type: f.file.type || "image/jpeg",
          quality: mode === "quality" ? quality : undefined,
          targetSize: targetSizeBytes
        }, [buffer]);
      });
    }

    setIsProcessing(false);
    setIsComplete(true);
  };

  const handleDownloadAll = async () => {
    const doneFiles = files.filter(f => f.status === "done" && f.resultBlob);
    if (doneFiles.length === 1) {
      downloadResult(doneFiles[0].resultBlob!, `compressed_${doneFiles[0].file.name}`);
      return;
    }

    if (doneFiles.length > 1) {
      const zip = new JSZip();
      doneFiles.forEach(f => {
        zip.file(`compressed_${f.file.name}`, f.resultBlob!);
      });
      const content = await zip.generateAsync({ type: "blob" });
      downloadResult(content, "compressed_images.zip");
    }
  };

  const handleReset = () => {
    clearQueue();
    setIsProcessing(false);
    setIsComplete(false);
  };

  return (
    <ToolLayout
      title="Compress Image Online"
      description="Shrink JPG, PNG, and WebP images instantly in your browser."
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
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
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
              <div className="flex gap-6 mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer">
                  <input 
                    type="radio" 
                    name="mode" 
                    checked={mode === "quality"} 
                    onChange={() => setMode("quality")} 
                    disabled={isProcessing}
                    className="text-primary focus:ring-primary"
                  />
                  Quality Slider
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer">
                  <input 
                    type="radio" 
                    name="mode" 
                    checked={mode === "targetSize"} 
                    onChange={() => setMode("targetSize")} 
                    disabled={isProcessing}
                    className="text-primary focus:ring-primary"
                  />
                  Target Size
                </label>
              </div>

              {mode === "quality" ? (
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-ink">Image Quality</label>
                    <span className="font-mono text-sm text-ink-muted">{quality}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={quality} 
                    onChange={(e) => setQuality(Number(e.target.value))}
                    disabled={isProcessing}
                    className="w-full accent-primary"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Max File Size (KB)</label>
                  <input 
                    type="number" 
                    value={targetSizeKB}
                    onChange={(e) => setTargetSizeKB(Number(e.target.value))}
                    disabled={isProcessing}
                    className="w-full max-w-[200px] bg-surface border border-border rounded-[var(--radius-sm)] px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
                    min="10"
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Area */}
          <div className="flex justify-end gap-4 border-t border-border pt-6">
            {!isComplete ? (
              <button
                onClick={handleCompress}
                disabled={isProcessing || files.some(f => f.status === "error")}
                className="bg-primary hover:bg-primary-ink text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? "Processing..." : "Compress Images"}
              </button>
            ) : (
              <button
                onClick={handleDownloadAll}
                className="bg-success text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors hover:bg-success/90 flex items-center gap-2"
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
