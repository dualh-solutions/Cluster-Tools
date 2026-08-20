"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Dropzone } from "@/components/tools/shared/Dropzone";
import { useFileQueue } from "@/lib/hooks/useFileQueue";
import { ResultCard } from "@/components/tools/ResultCard";
import { downloadResult } from "@/lib/utils/download";
import JSZip from "jszip";
// PDF.js is dynamically imported in handleConvert to avoid SSR errors with DOMMatrix.

export default function PdfToJpgPage() {
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

  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setIsComplete(false);

    // Dynamically import pdfjs-dist on the client side only
    const pdfjsLib = await import("pdfjs-dist");
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.status === "error") continue;
      
      updateFile(f.id, { status: "processing", progress: 10 });
      
      try {
        const buffer = await f.file.arrayBuffer();
        
        // Load PDF document
        const pdfDoc = await pdfjsLib.getDocument({ data: buffer }).promise;
        const totalPages = pdfDoc.numPages;
        
        const zip = new JSZip();
        
        // Render each page
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          // Scale determines output resolution. 2.0 = 2x original size (better quality)
          const viewport = page.getViewport({ scale: 2.0 });
          
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Could not create canvas context");
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
          };
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await page.render(renderContext as any).promise;
          
          // Convert canvas to JPG blob
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((b) => {
              if (b) resolve(b);
              else reject(new Error("Canvas toBlob failed"));
            }, "image/jpeg", 0.9);
          });
          
          const progress = 10 + Math.floor((pageNum / totalPages) * 80);
          updateFile(f.id, { progress });
          
          // Pad page numbers with zeros (e.g., page_01.jpg)
          const padLength = totalPages.toString().length;
          const paddedNum = pageNum.toString().padStart(padLength, '0');
          
          if (totalPages === 1) {
            // For single page, just save the blob directly as result
            updateFile(f.id, { 
              status: "done", 
              progress: 100, 
              resultBlob: blob,
              finalSize: blob.size
            });
          } else {
            // For multiple pages, add to zip
            zip.file(`page_${paddedNum}.jpg`, blob);
          }
        }
        
        if (totalPages > 1) {
          updateFile(f.id, { progress: 95 });
          const zipBlob = await zip.generateAsync({ type: "blob" });
          updateFile(f.id, { 
            status: "done", 
            progress: 100, 
            resultBlob: zipBlob,
            finalSize: zipBlob.size
          });
        }
        
      } catch (err: unknown) {
        console.error("PDF parsing error:", err);
        updateFile(f.id, { status: "error", errorMessage: "Failed to read PDF. It may be encrypted or corrupted." });
      }
    }

    setIsProcessing(false);
    setIsComplete(true);
  };

  const handleDownloadAll = async () => {
    const doneFiles = files.filter(f => f.status === "done" && f.resultBlob);

    if (doneFiles.length === 1) {
      const baseName = doneFiles[0].file.name.replace(/\.[^/.]+$/, "");
      const isZip = doneFiles[0].resultBlob!.type.includes("zip") || doneFiles[0].resultBlob!.type === "application/zip";
      const ext = isZip ? "zip" : "jpg";
      downloadResult(doneFiles[0].resultBlob!, `${baseName}_images.${ext}`);
      return;
    }

    if (doneFiles.length > 1) {
      const zip = new JSZip();
      doneFiles.forEach(f => {
        const baseName = f.file.name.replace(/\.[^/.]+$/, "");
        const isZip = f.resultBlob!.type.includes("zip") || f.resultBlob!.type === "application/zip";
        const ext = isZip ? "zip" : "jpg";
        zip.file(`${baseName}_images.${ext}`, f.resultBlob!);
      });
      const content = await zip.generateAsync({ type: "blob" });
      downloadResult(content, `pdf_images.zip`);
    }
  };

  const handleReset = () => {
    clearQueue();
    setIsProcessing(false);
    setIsComplete(false);
  };

  return (
    <ToolLayout
      title="PDF to JPG Converter"
      description="Extract pages from PDF documents into JPG images entirely in your browser."
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
          
          <div className="flex justify-end gap-4 border-t border-border pt-6">
            {!isComplete ? (
              <button
                onClick={handleConvert}
                disabled={isProcessing || files.some(f => f.status === "error")}
                className="bg-primary hover:bg-primary-ink text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {isProcessing ? "Extracting Pages..." : "Convert to JPG"}
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
