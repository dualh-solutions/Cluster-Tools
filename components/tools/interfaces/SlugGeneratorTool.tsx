"use client";

import React, { useState, useMemo } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

/**
 * Slug generation strategy:
 *  1. toLocaleLowerCase() — Unicode-aware lowercase.
 *  2. NFD normalize — decomposes accented chars so the accent can be stripped.
 *  3. Remove combining diacritics (\p{M}).
 *  4. Replace sequences of non-alphanumeric, non-ASCII chars with the separator.
 *  5. Collapse multiple consecutive separators.
 *  6. Trim leading/trailing separators.
 *
 * Non-Latin scripts (Arabic, Urdu, CJK) do NOT transliterate — they are dropped
 * because no transliteration library is included. This is documented in the UI.
 */
function generateSlug(text: string, separator: string): string {
  if (!text.trim()) return "";
  let slug = text.toLocaleLowerCase();
  // NFD decompose to separate base chars from diacritics
  slug = slug.normalize("NFD");
  // Strip combining diacritical marks (accents, etc.)
  slug = slug.replace(/\p{M}/gu, "");
  // Replace any character that's not a-z, 0-9 with the separator
  slug = slug.replace(/[^a-z0-9]+/g, separator);
  // Trim leading/trailing separators
  slug = slug.replace(new RegExp(`^${separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}+|${separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}+$`, "g"), "");
  return slug;
}

export default function SlugGeneratorTool() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => generateSlug(input, separator), [input, separator]);

  const handleCopy = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  const inputClass = "w-full bg-surface border border-border rounded-[var(--radius-md)] px-3 py-2 text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <ToolLayout
      title="Slug Generator"
      description="Convert text into clean, URL-friendly slugs for blog posts, page titles, and more."
    >
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="slug-input" className="block text-sm font-medium text-ink mb-1">Text to Convert</label>
            <input id="slug-input" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Hello, World! My Blog Post Title"
              className={inputClass} />
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-ink">Separator:</span>
            {["-", "_"].map(s => (
              <label key={s} className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                <input type="radio" name="separator" value={s} checked={separator === s}
                  onChange={() => setSeparator(s)}
                  className="text-primary focus:ring-primary" />
                <code className="font-mono text-xs bg-canvas border border-border px-1.5 py-0.5 rounded">{s === "-" ? "hyphen (-)" : "underscore (_)"}</code>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="slug-output" className="text-sm font-medium text-ink">Generated Slug</label>
            <button onClick={handleCopy} disabled={!slug}
              className="text-sm font-medium text-primary hover:text-primary-ink disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div id="slug-output"
            className="bg-canvas border border-border rounded-[var(--radius-md)] px-4 py-3 font-mono text-sm text-ink min-h-[44px] break-all">
            {slug || <span className="text-ink-muted italic">Slug will appear here...</span>}
          </div>
        </div>

        <div className="bg-canvas border border-border rounded-[var(--radius-md)] p-4">
          <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-2">Behavior Notes</p>
          <ul className="text-xs text-ink-muted space-y-1 list-disc list-inside">
            <li>Converts to lowercase and removes accents from Latin characters (e.g. <code className="font-mono">café → cafe</code>).</li>
            <li>Replaces spaces, punctuation, and special characters with the chosen separator.</li>
            <li>Non-Latin scripts (Arabic, Urdu, CJK) are dropped — transliteration is not implemented. Use a dedicated transliteration library for full Unicode support.</li>
            <li>Output is deterministic for the same input and separator.</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
