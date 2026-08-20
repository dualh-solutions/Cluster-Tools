/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";
import { Dropzone } from "@/components/tools/shared/Dropzone";
import { useFileQueue } from "@/lib/hooks/useFileQueue";
import { downloadResult } from "@/lib/utils/download";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ResultCard } from "@/components/tools/ResultCard";

export default function ImageCropperTool() {
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
    clearQueue
  } = useFileQueue({
    accept: [".jpg", ".jpeg", ".png", ".webp", "image/jpeg", "image/png", "image/webp"],
    maxSizeMB: 25,
    maxFiles: 1, // Only 1 file at a time for cropping
  });

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const workerRef = useRef<Worker | null>(null);

  // Read the selected file to a data URL for the UI
  useEffect(() => {
    if (files.length > 0 && files[0].status === "queued" && !isComplete) {
      const file = files[0].file;
      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""));
      reader.readAsDataURL(file);
    } else if (files.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImgSrc("");
      setCrop(undefined);
      setCompletedCrop(null);
    }
  }, [files, isComplete]);

  const handleImageLoad = () => {
    setCrop({
      unit: '%',
      width: 90,
      height: 90,
      x: 5,
      y: 5
    });
  };

  const handleCropImage = async () => {
    if (files.length === 0 || !completedCrop || !completedCrop.width || !completedCrop.height) return;
    
    setIsProcessing(true);
    const targetFile = files[0];
    updateFile(targetFile.id, { status: "processing", progress: 0 });

    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('@/lib/workers/crop.worker.ts', import.meta.url));
    }

    const worker = workerRef.current;
    
    await new Promise<void>((resolve) => {
      worker.onmessage = (e) => {
        const { success, blob, error } = e.data;
        if (success) {
          updateFile(targetFile.id, { 
            status: "done", 
            progress: 100, 
            resultBlob: blob,
            finalSize: blob.size
          });
        } else {
          updateFile(targetFile.id, { status: "error", errorMessage: error });
        }
        resolve();
      };

      worker.postMessage({ 
        file: targetFile.file, 
        crop: completedCrop
      });
    });

    setIsProcessing(false);
    setIsComplete(true);
  };

  const handleDownload = () => {
    const doneFile = files.find(f => f.status === "done" && f.resultBlob);
    if (doneFile) {
      const baseName = doneFile.file.name.replace(/\.[^/.]+$/, "");
      const ext = doneFile.file.name.split('.').pop();
      downloadResult(doneFile.resultBlob!, `${baseName}_cropped.${ext}`);
    }
  };

  const handleReset = () => {
    clearQueue();
    setIsProcessing(false);
    setIsComplete(false);
  };

  return (
    <ToolLayout
      title="Crop Image Online"
      description="Crop photos perfectly without uploading them to a server."
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
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            />
          }
        />
      )}
      {files.length > 0 && !isComplete && (
        <div className="w-full max-w-[896px] bg-surface border border-border rounded-[var(--radius-lg)] p-6 md:p-8 mt-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-medium text-ink">Crop Editor</h2>
            <button 
              onClick={handleReset}
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Cancel
            </button>
          </div>
          
          <div className="bg-canvas rounded-[var(--radius-md)] p-6 mb-8 border border-border flex flex-col items-center">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                className="max-h-[500px]"
              >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={imgSrc}
                  onLoad={handleImageLoad}
                  className="max-h-[500px] w-auto object-contain"
                />
              </ReactCrop>
            )}
          </div>

          <div className="flex justify-between items-center border-t border-border pt-6">
             <div className="flex gap-4">
               <button 
                 onClick={() => setAspect(undefined)} 
                 className={`text-sm font-medium px-3 py-1.5 rounded ${!aspect ? 'bg-primary/10 text-primary' : 'text-ink-muted hover:text-ink'}`}
               >
                 Freeform
               </button>
               <button 
                 onClick={() => setAspect(1)} 
                 className={`text-sm font-medium px-3 py-1.5 rounded ${aspect === 1 ? 'bg-primary/10 text-primary' : 'text-ink-muted hover:text-ink'}`}
               >
                 1:1 (Square)
               </button>
               <button 
                 onClick={() => setAspect(16 / 9)} 
                 className={`text-sm font-medium px-3 py-1.5 rounded ${aspect === 16/9 ? 'bg-primary/10 text-primary' : 'text-ink-muted hover:text-ink'}`}
               >
                 16:9
               </button>
             </div>
             
             <button
               onClick={handleCropImage}
               disabled={isProcessing || !completedCrop?.width || !completedCrop?.height}
               className="bg-primary hover:bg-primary-ink text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             >
               {isProcessing ? "Cropping..." : "Crop Image"}
             </button>
          </div>
        </div>
      )}

      {isComplete && files.length > 0 && (
        <div className="w-full bg-surface border border-border rounded-[var(--radius-lg)] p-6 md:p-8 mt-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-medium text-ink">Result</h2>
            <button 
              onClick={handleReset}
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
            >
              Start Over
            </button>
          </div>

          <div className="mb-8">
             <ResultCard 
                file={files[0]} 
                onRemove={() => handleReset()} 
                showSavingsCounter={false}
              />
          </div>

          <div className="flex justify-end border-t border-border pt-6">
             <button
                onClick={handleDownload}
                className="bg-success text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors hover:bg-success/90 flex items-center gap-2"
              >
                Download Cropped Image
              </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
