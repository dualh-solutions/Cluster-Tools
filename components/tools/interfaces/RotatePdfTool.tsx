"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Dropzone } from "@/components/tools/shared/Dropzone";
import { useFileQueue } from "@/lib/hooks/useFileQueue";
import { ResultCard } from "@/components/tools/ResultCard";
import { downloadResult } from "@/lib/utils/download";
import { PDFDocument, degrees } from "pdf-lib";
import JSZip from "jszip";

export default function RotatePdfTool() {
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

  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;
    
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
        
        updateFile(f.id, { progress: 50 });

        const pages = pdfDoc.getPages();
        pages.forEach((page) => {
          // get existing rotation
          const currentRotation = page.getRotation().angle;
          // add the new rotation
          page.setRotation(degrees(currentRotation + rotationAngle));
        });

        updateFile(f.id, { progress: 90 });
        
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
        
        updateFile(f.id, { 
          status: "done", 
          progress: 100, 
          resultBlob: blob,
          finalSize: blob.size
        });
        
      } catch (err: unknown) {
        console.error(err);
        updateFile(f.id, { status: "error", errorMessage: "Failed to rotate PDF. It might be corrupted or encrypted." });
      }
    }

    setIsProcessing(false);
    setIsComplete(true);
  };

  const handleDownloadAll = async () => {
    const doneFiles = files.filter(f => f.status === "done" && f.resultBlob);
    
    if (doneFiles.length === 1) {
      const baseName = doneFiles[0].file.name.replace(/\.[^/.]+$/, "");
      downloadResult(doneFiles[0].resultBlob!, `${baseName}_rotated.pdf`);
      return;
    }

    if (doneFiles.length > 1) {
      const zip = new JSZip();
      doneFiles.forEach(f => {
        const baseName = f.file.name.replace(/\.[^/.]+$/, "");
        zip.file(`${baseName}_rotated.pdf`, f.resultBlob!);
      });
      const content = await zip.generateAsync({ type: "blob" });
      downloadResult(content, `rotated_pdfs.zip`);
    }
  };

  const handleReset = () => {
    clearQueue();
    setIsProcessing(false);
    setIsComplete(false);
  };

  return (
    <ToolLayout
      title="Rotate PDF Pages Online"
      description="Rotate entire PDF documents instantly in your browser. Fast, secure, and private."
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

          {/* Options Panel */}
          {!isComplete && (
            <div className="bg-canvas rounded-[var(--radius-md)] p-6 mb-8 border border-border">
              <label className="block text-sm font-medium text-ink mb-4">Rotation Angle (Applies to all pages)</label>
              <div className="flex items-center gap-4">
                {[90, 180, 270].map((angle) => (
                  <button
                    key={angle}
                    onClick={() => setRotationAngle(angle)}
                    disabled={isProcessing}
                    className={`px-4 py-2 rounded-[var(--radius-sm)] border text-sm font-medium transition-colors ${
                      rotationAngle === angle 
                        ? "bg-primary text-surface border-primary" 
                        : "bg-surface text-ink border-border hover:border-ink-muted"
                    }`}
                  >
                    {angle}° Right
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 border-t border-border pt-6">
            {!isComplete ? (
              <button
                onClick={handleConvert}
                disabled={isProcessing || files.some(f => f.status === "error")}
                className="bg-primary hover:bg-primary-ink text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {isProcessing ? "Rotating..." : "Rotate PDF"}
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
