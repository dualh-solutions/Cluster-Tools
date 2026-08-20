"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

// A simple deterministic line-by-line LCS algorithm for diffing
function computeDiff(oldLines: string[], newLines: string[]) {
  const n = oldLines.length;
  const m = newLines.length;
  
  // Protect against massive inputs causing browser hang
  if (n * m > 25000000) {
    throw new Error("Text too large for deterministic line diffing. Please limit to ~5,000 lines.");
  }

  // LCS Matrix
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: { type: 'added' | 'removed' | 'unchanged', text: string }[] = [];
  let i = n;
  let j = m;

  while (i > 0 && j > 0) {
    if (oldLines[i - 1] === newLines[j - 1]) {
      result.unshift({ type: 'unchanged', text: oldLines[i - 1] });
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      result.unshift({ type: 'removed', text: oldLines[i - 1] });
      i--;
    } else {
      result.unshift({ type: 'added', text: newLines[j - 1] });
      j--;
    }
  }

  while (i > 0) {
    result.unshift({ type: 'removed', text: oldLines[i - 1] });
    i--;
  }

  while (j > 0) {
    result.unshift({ type: 'added', text: newLines[j - 1] });
    j--;
  }

  return result;
}

export default function TextDiffCheckerTool() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diff, setDiff] = useState<{ type: 'added' | 'removed' | 'unchanged', text: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = () => {
    setError(null);
    if (!original && !modified) {
      setDiff(null);
      return;
    }

    try {
      // Split by newline gracefully
      const oldLines = original ? original.split(/\r?\n/) : [];
      const newLines = modified ? modified.split(/\r?\n/) : [];
      
      const diffResult = computeDiff(oldLines, newLines);
      setDiff(diffResult);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred computing the diff.");
      }
    }
  };

  const handleClear = () => {
    setOriginal("");
    setModified("");
    setDiff(null);
    setError(null);
  };

  return (
    <ToolLayout
      title="Text Diff Checker"
      description="Compare two texts side-by-side to find additions, removals, and changes."
    >
      <div className="w-full flex flex-col gap-6">
        
        {/* Controls */}
        <div className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 flex justify-between items-center">
          <button
            onClick={handleCompare}
            className="bg-primary hover:bg-primary-ink text-surface px-6 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Compare Text
          </button>
          
          <button
            onClick={handleClear}
            className="text-sm font-medium text-danger hover:text-danger/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger rounded"
          >
            Clear All
          </button>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 rounded-[var(--radius-md)] p-4 text-danger text-sm font-medium animate-in fade-in">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col h-full">
            <label htmlFor="original-text" className="text-sm font-medium text-ink mb-2">
              Original Text
            </label>
            <textarea
              id="original-text"
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="Paste original text here..."
              className="w-full h-[300px] bg-surface border border-border rounded-[var(--radius-md)] p-4 text-ink text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
              spellCheck={false}
            ></textarea>
          </div>
          
          <div className="flex flex-col h-full">
            <label htmlFor="modified-text" className="text-sm font-medium text-ink mb-2">
              Modified Text
            </label>
            <textarea
              id="modified-text"
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              placeholder="Paste modified text here..."
              className="w-full h-[300px] bg-surface border border-border rounded-[var(--radius-md)] p-4 text-ink text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
              spellCheck={false}
            ></textarea>
          </div>
        </div>

        {diff && (
          <div className="mt-8">
            <h3 className="font-display text-lg font-medium text-ink mb-4">Comparison Result</h3>
            <div className="bg-surface border border-border rounded-[var(--radius-md)] overflow-hidden">
              <div className="flex gap-4 p-3 bg-canvas border-b border-border text-xs font-medium text-ink-muted">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-success/20 border border-success rounded-sm inline-block"></span> Added</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-danger/20 border border-danger rounded-sm inline-block"></span> Removed</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-transparent border border-border rounded-sm inline-block"></span> Unchanged</span>
              </div>
              <div className="p-4 font-mono text-sm max-h-[500px] overflow-y-auto whitespace-pre-wrap break-all">
                {diff.map((line, index) => {
                  let bgColor = "bg-transparent text-ink";
                  let prefix = "  ";
                  if (line.type === 'added') {
                    bgColor = "bg-success/10 text-success-ink";
                    prefix = "+ ";
                  } else if (line.type === 'removed') {
                    bgColor = "bg-danger/10 text-danger-ink line-through opacity-80";
                    prefix = "- ";
                  }
                  
                  return (
                    <div key={index} className={`px-2 py-0.5 rounded-sm ${bgColor}`}>
                      <span className="opacity-50 select-none mr-2">{prefix}</span>
                      {line.text === "" ? <span className="opacity-0">empty</span> : line.text}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
