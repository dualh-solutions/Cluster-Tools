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
  let formats: string[] = [];
  if (React.isValidElement(fileInputNode) && fileInputNode.props.accept) {
    const acceptStr = fileInputNode.props.accept as string;
    const exts = acceptStr
      .split(",")
      .filter((a) => a.trim().startsWith("."))
      .map((a) => a.trim().replace(".", "")); // keep lowercase for matching, will capitalize in render
    formats = Array.from(new Set(exts));
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Upload Area */}
      <div
        className={`w-full bg-[#F8FAFC] dark:bg-transparent border border-dashed rounded-[20px] p-10 flex flex-col items-center justify-center min-h-[260px] transition-all duration-200 ease-out cursor-pointer outline-none ${
          isDragActive
            ? "border-primary bg-[#EFF6FF] dark:bg-primary/10"
            : "border-primary hover:bg-[#F1F5F9] dark:hover:bg-white/5"
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
        <div className="mb-4 w-16 h-16 rounded-full bg-[#EFF6FF] dark:bg-primary/10 flex items-center justify-center text-primary">
          <UploadCloud size={32} strokeWidth={2} />
        </div>
        <p className="text-[18px] font-bold text-ink mb-1">{acceptText}</p>
        <p className="text-[14px] text-ink-muted">
          or{" "}
          <span className="text-primary font-semibold underline decoration-1 underline-offset-2">
            click to browse
          </span>
        </p>
        {fileInputNode}
      </div>

      {/* Formats */}
      {formats.length > 0 && (
        <div className="mt-6 flex flex-col items-center">
          <p className="text-[12px] text-ink-muted mb-3">Supported formats</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {formats.map((format) => {
              const f = format.toUpperCase();
              let style = "bg-[#F3F4F6] dark:bg-white/10 text-ink";
              if (f === "JPG" || f === "JPEG") style = "bg-[#FEF3C7] dark:bg-[#FEF3C7]/20 text-ink";
              else if (f === "PNG") style = "bg-[#DCFCE7] dark:bg-[#DCFCE7]/20 text-ink";
              else if (f === "WEBP") style = "bg-[#E0E7FF] dark:bg-[#E0E7FF]/20 text-ink";
              else if (f === "PDF") style = "bg-[#FEE2E2] dark:bg-[#FEE2E2]/20 text-ink";

              // Capitalize first letter, rest lowercase for WebP etc? Image shows JPG, PNG, WebP
              const displayText = f === "WEBP" ? "WebP" : f;

              return (
                <span
                  key={format}
                  className={`px-5 py-1.5 rounded-full text-[13px] font-bold ${style}`}
                >
                  {displayText}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
