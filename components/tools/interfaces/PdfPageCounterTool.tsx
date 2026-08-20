"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Dropzone } from "@/components/tools/shared/Dropzone";
import { useFileQueue } from "@/lib/hooks/useFileQueue";
import { ResultCard } from "@/components/tools/ResultCard";
import { PDFDocument } from "pdf-lib";
import { FileText } from "lucide-react";

export default function PdfPageCounterTool() {
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
    accept: [".pdf", "application/pdf"],
    maxSizeMB: 50,
  });

  const [pageCounts, setPageCounts] = useState<Record<string, number>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    const newCounts = { ...pageCounts };
    
    files.forEach(f => {
      if (!newCounts[f.id] && f.status !== "error") {
        updateFile(f.id, { status: "processing", progress: 0 });
      }
    });

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.status === "error" || newCounts[f.id] !== undefined) continue;
      
      try {
        updateFile(f.id, { progress: 50 });
        const buffer = await f.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        newCounts[f.id] = pdfDoc.getPageCount();
        
        updateFile(f.id, { status: "done", progress: 100 });
      } catch (err: unknown) {
        console.error(err);
        updateFile(f.id, { status: "error", errorMessage: "Failed to read PDF." });
      }
    }

    setPageCounts(newCounts);
    setIsProcessing(false);
  };

  const handleReset = () => {
    clearQueue();
    setPageCounts({});
    setIsProcessing(false);
  };

  const handleRemove = (id: string) => {
    removeFile(id);
    setPageCounts(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const totalPages = Object.values(pageCounts).reduce((sum, count) => sum + count, 0);

  return (
    <ToolLayout
      title="Count PDF Pages Online"
      description="Quickly count the number of pages in multiple PDF documents entirely in your browser."
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
            <h2 className="font-display text-xl font-medium text-ink">Files</h2>
            <button 
              onClick={handleReset}
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Clear all
            </button>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            {files.map((file) => (
              <div key={file.id} className="relative">
                <ResultCard 
                  file={file} 
                  onRemove={() => !isProcessing && handleRemove(file.id)} 
                  showSavingsCounter={false} 
                />
                {pageCounts[file.id] !== undefined && (
                  <div className="mt-2 bg-canvas border border-border rounded-[var(--radius-sm)] px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-ink-muted flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Page Count
                    </span>
                    <span className="font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded text-sm">
                      {pageCounts[file.id]} {pageCounts[file.id] === 1 ? 'page' : 'pages'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {Object.keys(pageCounts).length > 0 && (
            <div className="bg-canvas rounded-[var(--radius-md)] p-6 mb-8 border border-border flex justify-between items-center">
              <span className="text-sm font-medium text-ink">Total Pages across all files:</span>
              <span className="text-2xl font-display font-medium text-primary">
                {totalPages}
              </span>
            </div>
          )}

          <div className="flex justify-end gap-4 border-t border-border pt-6">
            <button
              onClick={handleAnalyze}
              disabled={isProcessing || files.every(f => pageCounts[f.id] !== undefined || f.status === "error")}
              className="bg-primary hover:bg-primary-ink text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {isProcessing ? "Counting..." : "Count Pages"}
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
