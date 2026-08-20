"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Dropzone } from "@/components/tools/shared/Dropzone";
import { useFileQueue } from "@/lib/hooks/useFileQueue";
import { ResultCard } from "@/components/tools/ResultCard";
import { downloadResult } from "@/lib/utils/download";
import { PDFDocument } from "pdf-lib";

export default function MergePdfTool() {
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
    accept: [".pdf", "application/pdf"],
    maxSizeMB: 100,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdf, setResultPdf] = useState<Blob | null>(null);

  const handleMerge = async () => {
    if (files.length < 2) return;
    
    setIsProcessing(true);
    setResultPdf(null);
    
    // Mark all as processing
    files.forEach(f => updateFile(f.id, { status: "processing", progress: 0 }));

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (f.status === "error") continue;
        
        try {
          const buffer = await f.file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
          
          copiedPages.forEach((page) => {
            mergedPdf.addPage(page);
          });
          
          updateFile(f.id, { progress: 100, status: "done" });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Failed to read PDF";
          updateFile(f.id, { status: "error", errorMessage: message });
        }
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      setResultPdf(blob);
      
    } catch (error) {
      // General error
      console.error("Merge error:", error);
    }

    setIsProcessing(false);
  };

  const handleReset = () => {
    clearQueue();
    setResultPdf(null);
    setIsProcessing(false);
  };

  return (
    <ToolLayout
      title="Merge PDF Files"
      description="Combine multiple PDFs into a single document entirely in your browser."
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
              accept=".pdf,application/pdf"
            />
          }
        />
      )}
      
      {files.length > 0 && (
        <div className="w-full bg-surface border border-border rounded-[var(--radius-lg)] p-6 md:p-8 mt-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-medium text-ink">Files to Merge</h2>
            <button 
              onClick={handleReset}
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Clear all
            </button>
          </div>

          <p className="text-sm text-ink-muted mb-4">
            Drag the up and down arrows to reorder files. They will be merged in the order shown below.
          </p>

          <div className="flex flex-col gap-3 mb-8">
            {files.map((file, index) => (
              <ResultCard 
                key={file.id} 
                file={file} 
                onRemove={() => !isProcessing && !resultPdf && removeFile(file.id)}
                onMoveUp={!isProcessing && !resultPdf && index > 0 ? () => moveFile(index, index - 1) : undefined}
                onMoveDown={!isProcessing && !resultPdf && index < files.length - 1 ? () => moveFile(index, index + 1) : undefined}
              />
            ))}
          </div>

          {files.length < 2 && !resultPdf && (
            <div className="bg-warning/10 border border-warning/20 rounded-[var(--radius-md)] p-4 text-warning-ink text-sm font-medium mb-8 flex items-center justify-between">
              Please add at least 2 files to merge.
              <button 
                onClick={openFileDialog}
                className="bg-warning text-surface px-4 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors"
              >
                Add More
              </button>
              <input
                type="file"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileInput}
                accept=".pdf,application/pdf"
              />
            </div>
          )}

          {/* Action Area */}
          <div className="flex justify-end gap-4 border-t border-border pt-6">
            {!resultPdf ? (
              <button
                onClick={handleMerge}
                disabled={isProcessing || files.length < 2 || files.some(f => f.status === "error")}
                className="bg-primary hover:bg-primary-ink text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {isProcessing ? "Merging..." : "Merge PDFs"}
              </button>
            ) : (
              <button
                onClick={() => downloadResult(resultPdf, "merged_document.pdf")}
                className="bg-success text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors hover:bg-success/90 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2"
              >
                Download Merged PDF
              </button>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
