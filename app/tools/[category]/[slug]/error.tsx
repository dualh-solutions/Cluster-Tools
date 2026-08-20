"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ToolError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error("Tool Processing Error:", error);
  }, [error]);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[500px] p-6 text-center bg-canvas">
      <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-h2 font-display mb-3 text-ink">File Processing Error</h2>
      <p className="text-body-md text-ink-muted mb-8 max-w-[400px]">
        We encountered a problem while processing this file. The file might be corrupted or in an unsupported format.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-surface text-ink border border-border px-6 py-3 rounded-full font-label-md hover:border-ink transition-colors shadow-sm"
      >
        <RefreshCcw size={16} />
        Reset tool and try again
      </button>
    </div>
  );
}
