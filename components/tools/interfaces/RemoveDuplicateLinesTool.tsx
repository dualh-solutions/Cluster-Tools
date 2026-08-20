"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

export default function RemoveDuplicateLinesTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(false);
  const [stats, setStats] = useState<{ removed: number; total: number } | null>(null);

  const handleProcess = () => {
    if (!input) {
      setOutput("");
      setStats(null);
      return;
    }

    const lines = input.split(/\r?\n/);
    const seen = new Set<string>();
    const uniqueLines: string[] = [];
    let removedCount = 0;

    for (const originalLine of lines) {
      let processLine = originalLine;
      
      if (trimWhitespace) {
        processLine = processLine.trim();
      }
      
      if (!caseSensitive) {
        processLine = processLine.toLowerCase();
      }

      if (!seen.has(processLine)) {
        seen.add(processLine);
        // We preserve the *original* line content, not the processed one
        uniqueLines.push(trimWhitespace ? originalLine.trim() : originalLine);
      } else {
        removedCount++;
      }
    }

    setOutput(uniqueLines.join('\n'));
    setStats({ removed: removedCount, total: lines.length });
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setStats(null);
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <ToolLayout
      title="Remove Duplicate Lines"
      description="Clean your lists by safely removing duplicate lines while preserving their original order."
    >
      <div className="w-full flex flex-col gap-6">
        
        {/* Controls */}
        <div className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              Case Sensitive
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={trimWhitespace}
                onChange={(e) => setTrimWhitespace(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              Ignore Leading/Trailing Whitespace
            </label>
            <button
              onClick={handleProcess}
              className="bg-primary hover:bg-primary-ink text-surface px-4 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Remove Duplicates
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="text-sm font-medium text-danger hover:text-danger/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger rounded"
            >
              Clear All
            </button>
          </div>
        </div>

        {stats && (
          <div className="bg-success/10 border border-success/20 rounded-[var(--radius-md)] p-4 text-success-ink text-sm font-medium animate-in fade-in">
            Removed {stats.removed} duplicate lines from a total of {stats.total} lines.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="original-input" className="text-sm font-medium text-ink">
                Original Text
              </label>
            </div>
            <textarea
              id="original-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your list here..."
              className="w-full h-[400px] bg-surface border border-border rounded-[var(--radius-md)] p-4 text-ink text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
            ></textarea>
          </div>
          
          {/* Output Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="cleaned-output" className="text-sm font-medium text-ink">
                Cleaned Output
              </label>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="text-sm font-medium text-primary hover:text-primary-ink disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                Copy Output
              </button>
            </div>
            <textarea
              id="cleaned-output"
              value={output}
              readOnly
              placeholder="Output will appear here..."
              className="w-full h-[400px] bg-surface border border-border rounded-[var(--radius-md)] p-4 text-ink text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y opacity-90 cursor-text"
            ></textarea>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
