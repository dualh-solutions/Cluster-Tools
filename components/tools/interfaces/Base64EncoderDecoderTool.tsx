"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

export default function Base64EncoderDecoderTool() {
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
        // UTF-8 safe encode
        const bytes = new TextEncoder().encode(input);
        let binString = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binString += String.fromCharCode(bytes[i]);
        }
        setOutput(btoa(binString));
      } else {
        // UTF-8 safe decode
        const binString = atob(input);
        const bytes = new Uint8Array(binString.length);
        for (let i = 0; i < binString.length; i++) {
          bytes[i] = binString.charCodeAt(i);
        }
        setOutput(new TextDecoder().decode(bytes));
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
      title="Base64 Encoder & Decoder"
      description="Encode text to Base64 or decode Base64 back to text with full Unicode support."
    >
      <div className="w-full flex flex-col gap-6">
        
        {/* Controls */}
        <div className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
              <input
                type="radio"
                name="b64-mode"
                checked={mode === 'encode'}
                onChange={() => setMode('encode')}
                className="text-primary focus:ring-primary"
              />
              Encode to Base64
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
              <input
                type="radio"
                name="b64-mode"
                checked={mode === 'decode'}
                onChange={() => setMode('decode')}
                className="text-primary focus:ring-primary"
              />
              Decode from Base64
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

        <div className="bg-primary/5 border border-primary/20 rounded-[var(--radius-sm)] p-3 text-sm text-ink-muted">
          <strong>Note:</strong> Base64 is an <em>encoding</em> format, not encryption. It does not secure or hide your data from anyone who has the string.
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
                {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
              </label>
            </div>
            <textarea
              id="input-text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? "Paste text here..." : "Paste Base64 here..."}
              className="w-full h-[300px] bg-surface border border-border rounded-[var(--radius-md)] p-4 text-ink font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
              spellCheck={false}
            ></textarea>
          </div>
          
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="output-text" className="text-sm font-medium text-ink">
                {mode === 'encode' ? 'Base64 Output' : 'Plain Text Output'}
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
