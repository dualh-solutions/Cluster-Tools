"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

/**
 * UUID Generator — uses crypto.randomUUID() (available in all modern browsers)
 * with a fallback that uses crypto.getRandomValues() only. Math.random() is NOT used.
 */
function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback: RFC 4122 version 4 UUID using crypto.getRandomValues()
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant bits
  const hex = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function UuidGeneratorTool() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [uppercase, setUppercase] = useState(false);

  const generate = () => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      results.push(generateUUID());
    }
    setUuids(results);
    setCopied(false);
  };

  const displayUuids = uppercase ? uuids.map(u => u.toUpperCase()) : uuids;

  const handleCopy = () => {
    if (!displayUuids.length) return;
    navigator.clipboard.writeText(displayUuids.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySingle = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
  };

  const isValid = (uuid: string) => UUID_REGEX.test(uuid);

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate version 4 UUIDs (randomly generated) instantly in your browser using the Web Crypto API."
    >
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div>
            <label htmlFor="uuid-count" className="block text-sm font-medium text-ink mb-1">How many UUIDs?</label>
            <input id="uuid-count" type="number" min={1} max={100} value={count}
              onChange={e => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-32 bg-surface border border-border rounded-[var(--radius-md)] px-3 py-2 text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            <p className="text-xs text-ink-muted mt-1">Max 100 per generation</p>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink cursor-pointer pb-0.5">
            <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary" />
            Uppercase
          </label>
          <button onClick={generate}
            className="bg-primary hover:bg-primary-ink text-surface px-6 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            Generate
          </button>
        </div>

        {displayUuids.length > 0 && (
          <div className="animate-in fade-in">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-ink">
                {displayUuids.length} UUID{displayUuids.length > 1 ? "s" : ""} (v4)
              </h3>
              <button onClick={handleCopy}
                className="text-sm font-medium text-primary hover:text-primary-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                {copied ? "Copied all!" : "Copy all"}
              </button>
            </div>
            <div className="bg-canvas border border-border rounded-[var(--radius-md)] divide-y divide-border/50 overflow-hidden">
              {displayUuids.map((uuid, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 group hover:bg-surface/50">
                  <span className="font-mono text-sm text-ink break-all">{uuid}</span>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    {!isValid(uuids[i]) && (
                      <span className="text-xs text-danger font-medium">invalid format</span>
                    )}
                    <button onClick={() => handleCopySingle(uuid)}
                      className="text-xs text-ink-muted hover:text-primary opacity-0 group-hover:opacity-100 transition-all focus-visible:outline-none focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-primary rounded">
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-muted">
              ℹ️ Uses <code className="font-mono">crypto.randomUUID()</code> or <code className="font-mono">crypto.getRandomValues()</code> fallback. All UUIDs are version 4 (random). No external service or network request.
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
