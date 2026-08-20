"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

export default function JsonValidatorTool() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleValidate = () => {
    if (!input.trim()) {
      setStatus('idle');
      setError(null);
      return;
    }
    
    try {
      JSON.parse(input);
      setStatus('valid');
      setError(null);
    } catch (err: unknown) {
      setStatus('invalid');
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid JSON syntax");
      }
    }
  };

  const handleClear = () => {
    setInput("");
    setStatus('idle');
    setError(null);
  };

  return (
    <ToolLayout
      title="JSON Validator"
      description="Instantly validate JSON data to find syntax errors. 100% private in-browser validation."
    >
      <div className="w-full flex flex-col gap-6">
        
        {/* Controls */}
        <div className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 flex justify-between items-center">
          <button
            onClick={handleValidate}
            className="bg-primary hover:bg-primary-ink text-surface px-6 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Validate JSON
          </button>
          
          <button
            onClick={handleClear}
            className="text-sm font-medium text-danger hover:text-danger/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger rounded"
          >
            Clear All
          </button>
        </div>

        {status === 'valid' && (
          <div className="bg-success/10 border border-success/20 rounded-[var(--radius-md)] p-4 text-success-ink text-sm font-medium animate-in fade-in">
            ✅ Valid JSON
          </div>
        )}

        {status === 'invalid' && error && (
          <div className="bg-danger/10 border border-danger/20 rounded-[var(--radius-md)] p-4 text-danger-ink text-sm font-medium animate-in fade-in">
            ❌ Invalid JSON: {error}
          </div>
        )}

        <div className="flex flex-col h-full">
          <label htmlFor="json-input" className="text-sm font-medium text-ink mb-2">
            Input JSON
          </label>
          <textarea
            id="json-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setStatus('idle');
            }}
            placeholder="Paste your JSON here to validate..."
            className={`w-full h-[500px] bg-surface border rounded-[var(--radius-md)] p-4 text-ink font-mono text-sm focus:outline-none focus:ring-1 resize-y ${
              status === 'invalid' ? 'border-danger focus:border-danger focus:ring-danger' : 
              status === 'valid' ? 'border-success focus:border-success focus:ring-success' : 
              'border-border focus:border-primary focus:ring-primary'
            }`}
            spellCheck={false}
          ></textarea>
        </div>
      </div>
    </ToolLayout>
  );
}
