"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Dropzone } from "@/components/tools/shared/Dropzone";
import { useFileQueue } from "@/lib/hooks/useFileQueue";
import { ResultCard } from "@/components/tools/ResultCard";
import { downloadResult } from "@/lib/utils/download";
import JSZip from "jszip";

export default function PngToJpgPage() {
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
    accept: [".png", "image/png"],
    maxSizeMB: 25,
  });

  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const workerRef = useRef<Worker | null>(null);

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setIsComplete(false);
    
    files.forEach(f => updateFile(f.id, { status: "processing", progress: 0 }));

    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('@/lib/workers/convert.worker.ts', import.meta.url));
    }

    const worker = workerRef.current;
    
    // Process files sequentially
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

        worker.postMessage({ 
          buffer, 
          type: "image/png",
          targetFormat: "image/jpeg",
          backgroundColor
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
      downloadResult(doneFiles[0].resultBlob!, `${baseName}.jpg`);
      return;
    }

    if (doneFiles.length > 1) {
      const zip = new JSZip();
      doneFiles.forEach(f => {
        const baseName = f.file.name.replace(/\.[^/.]+$/, "");
        zip.file(`${baseName}.jpg`, f.resultBlob!);
      });
      const content = await zip.generateAsync({ type: "blob" });
      downloadResult(content, `converted_images.zip`);
    }
  };

  const handleReset = () => {
    clearQueue();
    setIsProcessing(false);
    setIsComplete(false);
  };

  return (
    <ToolLayout
      title="Convert PNG to JPG Online"
      description="Convert PNG images to JPG instantly in your browser."
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
          accept=".png,image/png"
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
                showSavingsCounter={false} 
              />
            ))}
          </div>
          
          {/* Options Panel */}
          {!isComplete && (
            <div className="bg-canvas rounded-[var(--radius-md)] p-6 mb-8 border border-border">
              <label className="block text-sm font-medium text-ink mb-2">Background Color (Replaces Transparency)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  disabled={isProcessing}
                  className="w-10 h-10 p-1 bg-surface border border-border rounded-[var(--radius-sm)] cursor-pointer"
                />
                <span className="text-sm font-mono text-ink-muted">{backgroundColor.toUpperCase()}</span>
              </div>
            </div>
          )}

          {/* Action Area */}
          <div className="flex justify-end gap-4 border-t border-border pt-6">
            {!isComplete ? (
              <button
                onClick={handleConvert}
                disabled={isProcessing || files.some(f => f.status === "error")}
                className="bg-primary hover:bg-primary-ink text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? "Processing..." : "Convert to JPG"}
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
