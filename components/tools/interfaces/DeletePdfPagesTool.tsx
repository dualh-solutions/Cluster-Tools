"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Dropzone } from "@/components/tools/shared/Dropzone";
import { useFileQueue } from "@/lib/hooks/useFileQueue";
import { ResultCard } from "@/components/tools/ResultCard";
import { downloadResult } from "@/lib/utils/download";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

function parsePageRanges(ranges: string, maxPages: number): number[] {
  const pages = new Set<number>();
  const parts = ranges.split(',');
  for (const part of parts) {
    const range = part.trim();
    if (!range) continue;
    if (range.includes('-')) {
      const [start, end] = range.split('-');
      const s = parseInt(start, 10);
      const e = parseInt(end, 10);
      if (!isNaN(s) && !isNaN(e)) {
        for (let i = s; i <= e; i++) {
          if (i > 0 && i <= maxPages) pages.add(i - 1);
        }
      }
    } else {
      const p = parseInt(range, 10);
      if (!isNaN(p) && p > 0 && p <= maxPages) pages.add(p - 1);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export default function DeletePdfPagesTool() {
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

  const [pageRanges, setPageRanges] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0 || !pageRanges.trim()) return;
    
    setIsProcessing(true);
    setIsComplete(false);
    
    files.forEach(f => updateFile(f.id, { status: "processing", progress: 0 }));

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.status === "error") continue;
      
      try {
        updateFile(f.id, { progress: 30 });
        
        const buffer = await f.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer);
        const totalPages = pdfDoc.getPageCount();
        
        const pagesToDelete = new Set(parsePageRanges(pageRanges, totalPages));
        const pagesToKeep = [];
        
        for (let p = 0; p < totalPages; p++) {
          if (!pagesToDelete.has(p)) {
            pagesToKeep.push(p);
          }
        }
        
        if (pagesToKeep.length === 0) {
          updateFile(f.id, { status: "error", errorMessage: "You cannot delete all pages." });
          continue;
        }

        updateFile(f.id, { progress: 50 });

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, pagesToKeep);
        copiedPages.forEach(p => newPdf.addPage(p));
        
        updateFile(f.id, { progress: 90 });
        
        const pdfBytes = await newPdf.save();
        const pdfBlob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
        
        updateFile(f.id, { 
          status: "done", 
          progress: 100, 
          resultBlob: pdfBlob,
          finalSize: pdfBlob.size
        });
        
      } catch (err: unknown) {
        console.error(err);
        updateFile(f.id, { status: "error", errorMessage: "Failed to delete PDF pages." });
      }
    }

    setIsProcessing(false);
    setIsComplete(true);
  };

  const handleDownloadAll = async () => {
    const doneFiles = files.filter(f => f.status === "done" && f.resultBlob);
    
    if (doneFiles.length === 1) {
      const baseName = doneFiles[0].file.name.replace(/\.[^/.]+$/, "");
      downloadResult(doneFiles[0].resultBlob!, `${baseName}_deleted.pdf`);
      return;
    }

    if (doneFiles.length > 1) {
      const zip = new JSZip();
      doneFiles.forEach(f => {
        const baseName = f.file.name.replace(/\.[^/.]+$/, "");
        zip.file(`${baseName}_deleted.pdf`, f.resultBlob!);
      });
      const content = await zip.generateAsync({ type: "blob" });
      downloadResult(content, `edited_pdfs.zip`);
    }
  };

  const handleReset = () => {
    clearQueue();
    setIsProcessing(false);
    setIsComplete(false);
  };

  return (
    <ToolLayout
      title="Delete PDF Pages Online"
      description="Remove unwanted pages from your PDF documents entirely in your browser."
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

          {!isComplete && (
            <div className="bg-canvas rounded-[var(--radius-md)] p-6 mb-8 border border-border">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Pages to Delete</label>
                <input 
                  type="text" 
                  value={pageRanges}
                  onChange={(e) => setPageRanges(e.target.value)}
                  placeholder="e.g. 1, 3, 5-7"
                  disabled={isProcessing}
                  className="w-full bg-surface border border-border rounded-[var(--radius-sm)] px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <p className="text-xs text-ink-muted mt-2">Enter page numbers and/or ranges separated by commas to remove them from the PDF.</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 border-t border-border pt-6">
            {!isComplete ? (
              <button
                onClick={handleConvert}
                disabled={isProcessing || !pageRanges.trim() || files.some(f => f.status === "error")}
                className="bg-primary hover:bg-primary-ink text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {isProcessing ? "Deleting..." : "Delete Pages"}
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
