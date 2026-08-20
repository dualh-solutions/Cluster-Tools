"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Dropzone } from "@/components/tools/shared/Dropzone";
import { useFileQueue } from "@/lib/hooks/useFileQueue";
import { ResultCard } from "@/components/tools/ResultCard";
import { downloadResult } from "@/lib/utils/download";
import JSZip from "jszip";

export default function HeicToJpgTool() {
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
    accept: [".heic", ".heif", "image/heic", "image/heif"],
    maxSizeMB: 50,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setIsComplete(false);
    
    files.forEach(f => updateFile(f.id, { status: "processing", progress: 0 }));

    try {
      const heic2any = (await import("heic2any")).default;

      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (f.status === "error") continue;
        
        try {
          updateFile(f.id, { progress: 30 });
          const resultBlob = await heic2any({
            blob: f.file,
            toType: "image/jpeg",
            quality: 0.9,
          });

          // heic2any can return Blob | Blob[]
          const finalBlob = Array.isArray(resultBlob) ? resultBlob[0] : resultBlob;

          updateFile(f.id, { 
            status: "done", 
            progress: 100, 
            resultBlob: finalBlob,
            finalSize: finalBlob.size
          });
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Failed to convert HEIC";
          updateFile(f.id, { status: "error", errorMessage });
        }
      }
    } catch {
      files.forEach(f => {
        if (f.status === "processing") {
          updateFile(f.id, { status: "error", errorMessage: "Failed to load HEIC decoder." });
        }
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
      title="Convert HEIC to JPG Online"
      description="Convert iPhone HEIC photos to standard JPG format entirely in your browser."
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
              accept=".heic,.heif,image/heic,image/heif"
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
                showSavingsCounter={false} 
              />
            ))}
          </div>

          <div className="flex justify-end gap-4 border-t border-border pt-6">
            {!isComplete ? (
              <button
                onClick={handleConvert}
                disabled={isProcessing || files.some(f => f.status === "error")}
                className="bg-primary hover:bg-primary-ink text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {isProcessing ? "Converting..." : "Convert to JPG"}
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
