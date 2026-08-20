"use client";

import React from "react";
import { UploadCloud } from "lucide-react";

export interface DropzoneProps {
  isDragActive?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onBrowseClick?: () => void;
  fileInputNode?: React.ReactNode;
  acceptText?: string;
}

export function Dropzone({
  isDragActive,
  onDragOver,
  onDragLeave,
  onDrop,
  onBrowseClick,
  fileInputNode,
  acceptText = "Drop a file here",
}: DropzoneProps) {
  return (
    <div
      className={`w-full bg-surface-container-lowest border-2 border-dashed rounded-2xl p-3xl flex flex-col items-center justify-center min-h-[320px] transition-all duration-200 ease-out cursor-pointer group shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:outline-none ${
        isDragActive
          ? "border-primary bg-primary-container/10 scale-[1.02]"
          : "border-outline-variant hover:border-primary hover:bg-surface-container-low"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onBrowseClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onBrowseClick?.();
        }
      }}
    >
      <div
        className={`mb-lg p-md rounded-full transition-all duration-200 ease-out ${
          isDragActive
            ? "-translate-y-2 text-on-primary bg-primary scale-110 shadow-md"
            : "text-primary bg-primary-container/20 group-hover:-translate-y-1 group-hover:bg-primary-container/40"
        }`}
      >
        <UploadCloud className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
      </div>
      <p className="text-h3 font-h3 font-bold text-on-surface mb-xs">{acceptText}</p>
      <p className="text-body-md font-body-md text-on-surface-variant">
        or{" "}
        <span className="text-primary font-bold hover:text-primary-fixed-variant transition-colors underline underline-offset-4 decoration-primary/30 decoration-2 group-hover:decoration-primary/80">
          click to browse
        </span>
      </p>
      {fileInputNode}
    </div>
  );
}
