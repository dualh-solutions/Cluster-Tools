"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

/**
 * Unicode-aware title case.
 *
 * Strategy:
 *   1. Use Intl.Segmenter({ granularity: 'word' }) for Unicode-correct word
 *      boundaries (handles accented Latin, Arabic, Urdu, CJK, mixed scripts).
 *   2. For each word-like segment: toLocaleLowerCase() the whole token, then
 *      toLocaleUpperCase() its leading Unicode letter via \p{L}.
 *   3. Non-word segments (spaces, punctuation, line breaks) pass through verbatim.
 *   4. Arabic / CJK: toLocaleLowerCase / toLocaleUpperCase are no-ops for those
 *      scripts, so they pass through unchanged — correct behaviour.
 *   5. Fallback (no Intl.Segmenter): split on whitespace runs, apply the same
 *      per-token transform.
 *
 * This is deterministic word-based capitalization, NOT linguistic title casing
 * (articles / prepositions like "of", "the" are NOT excluded).
 */
function toTitleCase(text: string): string {
  if (!text) return text;

  const capitalizeToken = (token: string): string => {
    const lowered = token.toLocaleLowerCase();
    // Uppercase the first Unicode letter in the token (no-op for case-neutral scripts)
    return lowered.replace(/^(\p{L})/u, (m) => m.toLocaleUpperCase());
  };

  try {
    if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
      const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });
      return Array.from(segmenter.segment(text))
        .map((seg) => (seg.isWordLike ? capitalizeToken(seg.segment) : seg.segment))
        .join("");
    }
  } catch {
    // fall through to whitespace-split fallback
  }

  // Fallback: split on whitespace runs, preserving the delimiters
  return text
    .split(/(\s+)/)
    .map((token) => (/^\s+$/.test(token) ? token : capitalizeToken(token)))
    .join("");
}

/**
 * Unicode-aware sentence case.
 *
 * Strategy:
 *   1. Lowercase the full string via toLocaleLowerCase().
 *   2. Uppercase the first Unicode letter (\p{L}) at:
 *      - the very start of the string (optionally after leading whitespace), and
 *      - immediately after [.!?] followed by one or more whitespace characters.
 *   3. Uses a lookbehind assertion (?<=[.!?]\s) — supported in all modern
 *      browser JS engines (V8, SpiderMonkey, JavaScriptCore).
 *   4. Arabic / CJK pass through unchanged (casing is a no-op for those scripts).
 *   5. Abbreviation intelligence is NOT implemented (known limitation).
 */
function toSentenceCase(text: string): string {
  if (!text) return text;
  const lower = text.toLocaleLowerCase();
  return lower.replace(
    /(?:^|\s)(\p{L})|(?<=[.!?]\s)(\p{L})/gu,
    (match, startLetter: string | undefined, afterPunctLetter: string | undefined) => {
      if (startLetter !== undefined) {
        // Preserve leading whitespace in the match, capitalize the letter
        return match.replace(startLetter, startLetter.toLocaleUpperCase());
      }
      // afterPunctLetter: lookbehind consumed the punct+space, so match IS just the letter
      return (afterPunctLetter as string).toLocaleUpperCase();
    }
  );
}

export default function CaseConverterTool() {
  const [text, setText] = useState("");

  const handleUpper = () => setText(text.toLocaleUpperCase());
  const handleLower = () => setText(text.toLocaleLowerCase());
  const handleTitle = () => setText(toTitleCase(text));
  const handleSentence = () => setText(toSentenceCase(text));
  const handleClear = () => setText("");
  const handleCopy = () => {
    if (text) navigator.clipboard.writeText(text);
  };

  return (
    <ToolLayout
      title="Case Converter"
      description="Convert text between UPPERCASE, lowercase, Title Case, and Sentence case."
    >
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-wrap gap-3 p-4 bg-canvas border border-border rounded-[var(--radius-md)]">
          <button
            onClick={handleUpper}
            disabled={!text}
            className="bg-surface hover:bg-surface-hover text-ink border border-border px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            UPPERCASE
          </button>
          <button
            onClick={handleLower}
            disabled={!text}
            className="bg-surface hover:bg-surface-hover text-ink border border-border px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            lowercase
          </button>
          <button
            onClick={handleTitle}
            disabled={!text}
            className="bg-surface hover:bg-surface-hover text-ink border border-border px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Title Case
          </button>
          <button
            onClick={handleSentence}
            disabled={!text}
            className="bg-surface hover:bg-surface-hover text-ink border border-border px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sentence case
          </button>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="text-input" className="text-sm font-medium text-ink">
              Your Text
            </label>
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                disabled={!text}
                className="text-sm font-medium text-primary hover:text-primary-ink disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                Copy
              </button>
              <button
                onClick={handleClear}
                disabled={!text}
                className="text-sm font-medium text-danger hover:text-danger/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger rounded"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-[400px] bg-surface border border-border rounded-[var(--radius-md)] p-4 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
          ></textarea>
          <p className="mt-2 text-xs text-ink-muted">
            Title Case uses word-based capitalization. Arabic, CJK, and other case-neutral scripts are preserved unchanged. Sentence Case capitalizes after <code className="font-mono">.</code> <code className="font-mono">!</code> <code className="font-mono">?</code>.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
