"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Dropzone } from "@/components/tools/shared/Dropzone";
import { useFileQueue } from "@/lib/hooks/useFileQueue";
import { ResultCard } from "@/components/tools/ResultCard";
import { PDFDocument } from "pdf-lib";

interface PdfMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  pageCount?: number;
}

export default function PdfMetadataViewerTool() {
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

  const [metadataMap, setMetadataMap] = useState<Record<string, PdfMetadata>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    const newMetadata = { ...metadataMap };
    
    files.forEach(f => {
      if (!newMetadata[f.id] && f.status !== "error") {
        updateFile(f.id, { status: "processing", progress: 0 });
      }
    });

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.status === "error" || newMetadata[f.id] !== undefined) continue;
      
      try {
        updateFile(f.id, { progress: 50 });
        const buffer = await f.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true, updateMetadata: false });
        
        newMetadata[f.id] = {
          title: pdfDoc.getTitle(),
          author: pdfDoc.getAuthor(),
          subject: pdfDoc.getSubject(),
          keywords: pdfDoc.getKeywords(),
          creator: pdfDoc.getCreator(),
          producer: pdfDoc.getProducer(),
          creationDate: pdfDoc.getCreationDate()?.toLocaleString(),
          modificationDate: pdfDoc.getModificationDate()?.toLocaleString(),
          pageCount: pdfDoc.getPageCount()
        };
        
        updateFile(f.id, { status: "done", progress: 100 });
      } catch (err: unknown) {
        console.error(err);
        updateFile(f.id, { status: "error", errorMessage: "Failed to read PDF metadata." });
      }
    }

    setMetadataMap(newMetadata);
    setIsProcessing(false);
  };

  const handleReset = () => {
    clearQueue();
    setMetadataMap({});
    setIsProcessing(false);
  };

  const handleRemove = (id: string) => {
    removeFile(id);
    setMetadataMap(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <ToolLayout
      title="View PDF Metadata Online"
      description="View properties and metadata hidden inside your PDF documents entirely in your browser."
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
                {metadataMap[file.id] && (
                  <div className="mt-2 bg-canvas border border-border rounded-[var(--radius-sm)] p-4">
                    <h3 className="text-sm font-medium text-ink mb-3">Document Properties</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                      {Object.entries(metadataMap[file.id]).map(([key, value]) => {
                        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        return (
                          <div key={key} className="flex flex-col border-b border-border/50 pb-2">
                            <span className="text-xs text-ink-muted">{formattedKey}</span>
                            <span className="text-sm text-ink truncate font-mono" title={value?.toString() || 'Not set'}>
                              {value?.toString() || <span className="text-ink-muted italic">Not set</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 border-t border-border pt-6">
            <button
              onClick={handleAnalyze}
              disabled={isProcessing || files.every(f => metadataMap[f.id] !== undefined || f.status === "error")}
              className="bg-primary hover:bg-primary-ink text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {isProcessing ? "Reading..." : "View Metadata"}
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
