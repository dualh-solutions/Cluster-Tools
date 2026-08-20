"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

export default function UrlEncoderDecoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);

  const handleProcess = () => {
    if (!input) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to ${mode}: ` + err.message);
      } else {
        setError(`Failed to ${mode} (malformed input)`);
      }
      setOutput("");
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
      title="URL Encoder & Decoder"
      description="Encode URLs safely or decode percent-encoded strings directly in your browser."
    >
      <div className="w-full flex flex-col gap-6">
        
        {/* Controls */}
        <div className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
              <input
                type="radio"
                name="url-mode"
                checked={mode === 'encode'}
                onChange={() => setMode('encode')}
                className="text-primary focus:ring-primary"
              />
              URL Encode
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
              <input
                type="radio"
                name="url-mode"
                checked={mode === 'decode'}
                onChange={() => setMode('decode')}
                className="text-primary focus:ring-primary"
              />
              URL Decode
            </label>
            <button
              onClick={handleProcess}
              className="bg-primary hover:bg-primary-ink text-surface px-6 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {mode === 'encode' ? 'Encode' : 'Decode'}
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

        {error && (
          <div className="bg-danger/10 border border-danger/20 rounded-[var(--radius-md)] p-4 text-danger text-sm font-medium animate-in fade-in">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="input-text" className="text-sm font-medium text-ink">
                {mode === 'encode' ? 'Unencoded Text' : 'URL Encoded Text'}
              </label>
            </div>
            <textarea
              id="input-text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? "Paste string to encode here..." : "Paste encoded string here..."}
              className="w-full h-[300px] bg-surface border border-border rounded-[var(--radius-md)] p-4 text-ink font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
              spellCheck={false}
            ></textarea>
          </div>
          
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="output-text" className="text-sm font-medium text-ink">
                {mode === 'encode' ? 'Encoded Output' : 'Decoded Output'}
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
              id="output-text"
              value={output}
              readOnly
              placeholder="Output will appear here..."
              className="w-full h-[300px] bg-surface border border-border rounded-[var(--radius-md)] p-4 text-ink font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y opacity-90 cursor-text"
              spellCheck={false}
            ></textarea>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
