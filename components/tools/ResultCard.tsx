import React from "react";
import { SavingsCounter } from "./SavingsCounter";
import { formatBytes } from "@/lib/utils/download";
import { QueueFile } from "@/lib/hooks/useFileQueue";
import { FileWarning, CheckCircle2, Loader2, XCircle, File as FileIcon, X, ArrowUp, ArrowDown } from "lucide-react";

export interface ResultCardProps {
  file: QueueFile;
  onRemove?: () => void;
  onRetry?: () => void;
  showSavingsCounter?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function ResultCard({ file, onRemove, onRetry, showSavingsCounter = false, onMoveUp, onMoveDown }: ResultCardProps) {
  return (
    <div className="w-full bg-surface border border-border rounded-[var(--radius-md)] p-4 flex items-center gap-4 relative group hover:border-primary/50 transition-colors">
      
      {/* Icon Area */}
      <div className="w-10 h-10 rounded-full bg-canvas flex items-center justify-center shrink-0">
        {file.status === "processing" && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
        {file.status === "done" && <CheckCircle2 className="w-5 h-5 text-success" />}
        {file.status === "error" && <XCircle className="w-5 h-5 text-accent" />}
        {file.status === "queued" && <FileIcon className="w-5 h-5 text-ink-muted" />}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-ink truncate" title={file.file.name}>
            {file.file.name}
          </p>
          {!showSavingsCounter && (
            <span className="text-xs font-mono text-ink-muted shrink-0 tabular-nums">
              {formatBytes(file.originalSize)}
            </span>
          )}
        </div>

        {file.status === "error" && (
          <div className="flex items-center gap-3">
            <p className="text-xs text-accent flex items-center gap-1">
              <FileWarning className="w-3 h-3" />
              {file.errorMessage}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-xs font-medium text-primary hover:text-primary-ink underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
              >
                Retry
              </button>
            )}
          </div>
        )}
        
        {file.status === "processing" && file.progress !== undefined && (
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-primary transition-all duration-200" 
              style={{ width: `${file.progress}%` }} 
            />
          </div>
        )}

        {file.status === "done" && showSavingsCounter && file.finalSize !== undefined && (
          <div className="mt-2">
            <SavingsCounter originalSize={file.originalSize} finalSize={file.finalSize} />
          </div>
        )}
      </div>

      {/* Actions */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-border text-ink-muted flex items-center justify-center hover:bg-accent hover:text-surface transition-colors opacity-0 group-hover:opacity-100 shadow-sm focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          title="Remove file"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Reorder Actions */}
      {(onMoveUp || onMoveDown) && (
        <div className="flex flex-col gap-1 shrink-0 ml-2">
          <button
            onClick={onMoveUp}
            disabled={!onMoveUp}
            className="w-6 h-6 rounded bg-canvas text-ink-muted flex items-center justify-center hover:bg-border transition-colors disabled:opacity-30 disabled:hover:bg-canvas disabled:cursor-not-allowed"
            title="Move up"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={!onMoveDown}
            className="w-6 h-6 rounded bg-canvas text-ink-muted flex items-center justify-center hover:bg-border transition-colors disabled:opacity-30 disabled:hover:bg-canvas disabled:cursor-not-allowed"
            title="Move down"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
