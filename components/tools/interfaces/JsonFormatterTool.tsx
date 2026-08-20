"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState<number>(2);

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid JSON syntax";
      setError(message);
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid JSON syntax";
      setError(message);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format, beautify, and validate JSON data instantly in your browser."
    >
      <div className="w-full flex flex-col gap-6">
        
        {/* Controls */}
        <div className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-ink flex items-center gap-2">
              Indentation:
              <select 
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="bg-surface border border-border rounded-[var(--radius-sm)] px-2 py-1 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </label>
            <button
              onClick={handleFormat}
              className="bg-primary hover:bg-primary-ink text-surface px-4 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Format
            </button>
            <button
              onClick={handleMinify}
              className="bg-surface hover:bg-surface-hover text-ink border border-border px-4 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Minify
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="text-sm font-medium text-danger hover:text-danger/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger rounded"
            >
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 rounded-[var(--radius-md)] p-4 text-danger text-sm font-medium animate-in fade-in">
            Error: {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="json-input" className="text-sm font-medium text-ink">
                Input JSON
              </label>
            </div>
            <textarea
              id="json-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
              className="w-full h-[500px] bg-surface border border-border rounded-[var(--radius-md)] p-4 text-ink font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
              spellCheck={false}
            ></textarea>
          </div>
          
          {/* Output Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="json-output" className="text-sm font-medium text-ink">
                Output
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
              id="json-output"
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="w-full h-[500px] bg-surface border border-border rounded-[var(--radius-md)] p-4 text-ink font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y opacity-90 cursor-text"
              spellCheck={false}
            ></textarea>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
