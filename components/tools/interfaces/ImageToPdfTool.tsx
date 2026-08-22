"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Dropzone } from "@/components/tools/shared/Dropzone";
import { useFileQueue } from "@/lib/hooks/useFileQueue";
import { ResultCard } from "@/components/tools/ResultCard";
import { downloadResult } from "@/lib/utils/download";

export default function ImageToPdfTool() {
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
    clearQueue,
    moveFile
  } = useFileQueue({
    accept: [".jpg", ".jpeg", ".png", ".webp", "image/jpeg", "image/png", "image/webp"],
    maxSizeMB: 25,
  });

  const [pageSize, setPageSize] = useState<"A4" | "Letter" | "Fit">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdf, setResultPdf] = useState<Blob | null>(null);

  const workerRef = useRef<Worker | null>(null);

  const handleGeneratePdf = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setResultPdf(null);
    
    files.forEach(f => updateFile(f.id, { status: "processing", progress: 0 }));

    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('@/lib/workers/pdf.worker.ts', import.meta.url));
    }

    const worker = workerRef.current;
    
    const buffers = await Promise.all(
      files.map(async (f) => {
        const buffer = await f.file.arrayBuffer();
        return { buffer, type: f.file.type || "image/jpeg" };
      })
    );

    worker.onmessage = (e) => {
      const { type, result, progress, message } = e.data;
      if (type === "progress") {
        files.forEach(f => updateFile(f.id, { progress }));
      } else if (type === "done") {
        files.forEach(f => updateFile(f.id, { status: "done", progress: 100 }));
        setResultPdf(result);
        setIsProcessing(false);
      } else if (type === "error") {
        files.forEach(f => updateFile(f.id, { status: "error", errorMessage: message }));
        setIsProcessing(false);
      }
    };

    worker.postMessage({ files: buffers, pageSize, orientation }, buffers.map(b => b.buffer));
  };

  const handleReset = () => {
    clearQueue();
    setResultPdf(null);
    setIsProcessing(false);
  };

  return (
    <ToolLayout
      title="Images to PDF Converter"
      description="Combine multiple images into a single PDF document entirely in your browser."
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
            {files.map((file, index) => (
              <ResultCard 
                key={file.id} 
                file={file} 
                onRemove={() => !resultPdf && removeFile(file.id)} 
                onMoveUp={!isProcessing && !resultPdf && index > 0 ? () => moveFile(index, index - 1) : undefined}
                onMoveDown={!isProcessing && !resultPdf && index < files.length - 1 ? () => moveFile(index, index + 1) : undefined}
              />
            ))}
          </div>
          
          {!resultPdf && (
            <div className="bg-canvas rounded-[var(--radius-md)] p-6 mb-8 flex flex-col md:flex-row gap-6 border border-border">
              <div className="flex-1">
                <label className="block text-sm font-medium text-ink mb-2">Page Size</label>
                <select 
                  className="w-full bg-surface border border-border rounded-[var(--radius-sm)] px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as "A4" | "Letter" | "Fit")}
                  disabled={isProcessing}
                >
                  <option value="A4">A4</option>
                  <option value="Letter">US Letter</option>
                  <option value="Fit">Fit to Image</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-ink mb-2">Orientation</label>
                <select 
                  className="w-full bg-surface border border-border rounded-[var(--radius-sm)] px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as "portrait" | "landscape")}
                  disabled={pageSize === "Fit" || isProcessing}
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 border-t border-border pt-6">
            {!resultPdf ? (
              <button
                onClick={handleGeneratePdf}
                disabled={isProcessing || files.some(f => f.status === "error")}
                className="bg-primary hover:bg-primary-ink text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? "Processing..." : "Generate PDF"}
              </button>
            ) : (
              <button
                onClick={() => downloadResult(resultPdf, "cluster-tools_document.pdf")}
                className="bg-success text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors hover:bg-success/90 flex items-center gap-2"
              >
                Download PDF
              </button>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
