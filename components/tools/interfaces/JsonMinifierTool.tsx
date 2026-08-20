"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

export default function JsonMinifierTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleMinify = () => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    
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
      title="JSON Minifier"
      description="Compress JSON data by removing unnecessary whitespace and formatting. 100% private in-browser minification."
    >
      <div className="w-full flex flex-col gap-6">
        
        {/* Controls */}
        <div className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 flex justify-between items-center">
          <button
            onClick={handleMinify}
            className="bg-primary hover:bg-primary-ink text-surface px-6 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Minify JSON
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
            Error: {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="json-input" className="text-sm font-medium text-ink">
                Original JSON
              </label>
            </div>
            <textarea
              id="json-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste formatted JSON here..."
              className="w-full h-[500px] bg-surface border border-border rounded-[var(--radius-md)] p-4 text-ink font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
              spellCheck={false}
            ></textarea>
          </div>
          
          {/* Output Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="json-output" className="text-sm font-medium text-ink">
                Minified Output
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
              placeholder="Minified JSON will appear here..."
              className="w-full h-[500px] bg-surface border border-border rounded-[var(--radius-md)] p-4 text-ink font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y opacity-90 cursor-text"
              spellCheck={false}
            ></textarea>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
