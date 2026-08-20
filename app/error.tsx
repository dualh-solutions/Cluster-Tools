"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
        <AlertTriangle size={32} />
      </div>
      <h1 className="text-display-sm font-display mb-4 text-ink">Something went wrong</h1>
      <p className="text-body-lg text-ink-muted mb-8 max-w-[500px]">
        A critical error occurred while loading this page. Our team has been notified.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => reset()}
          className="bg-primary text-white px-6 py-3 rounded-full font-label-md hover:bg-primary-ink transition-colors"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="bg-canvas text-ink border border-border px-6 py-3 rounded-full font-label-md hover:border-ink transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
