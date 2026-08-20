"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

interface DensityResult {
  totalWords: number;
  occurrences: number;
  density: string;
  positions: number[];
}

function computeDensity(text: string, keyword: string, caseSensitive: boolean): DensityResult | null {
  if (!text.trim() || !keyword.trim()) return null;

  const normalizeText = (s: string) => caseSensitive ? s : s.toLowerCase();
  const normalizedText = normalizeText(text);
  const normalizedKeyword = normalizeText(keyword.trim());

  // Count total words (split by whitespace)
  const totalWords = text.trim().split(/\s+/).length;

  // Count occurrences (non-overlapping substring search — keyword may be a phrase)
  let occurrences = 0;
  const positions: number[] = [];
  let idx = 0;
  while (true) {
    const found = normalizedText.indexOf(normalizedKeyword, idx);
    if (found === -1) break;
    occurrences++;
    positions.push(found);
    idx = found + normalizedKeyword.length;
  }

  // Density: occurrences / total words * 100 (keyword/phrase treated as one token unit)
  const keywordWords = keyword.trim().split(/\s+/).length;
  const density = totalWords > 0 ? ((occurrences * keywordWords) / totalWords * 100).toFixed(2) : "0.00";

  return { totalWords, occurrences, density, positions };
}

export default function KeywordDensityCheckerTool() {
  const [text, setText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [result, setResult] = useState<DensityResult | null>(null);

  const handleCheck = () => {
    setResult(computeDensity(text, keyword, caseSensitive));
    setHasRun(true);
  };

  const handleClear = () => {
    setText("");
    setKeyword("");
    setResult(null);
    setHasRun(false);
  };

  const canRun = text.trim().length > 0 && keyword.trim().length > 0;

  return (
    <ToolLayout
      title="Keyword Density Checker"
      description="Analyze how often a keyword or phrase appears in your text and calculate its density percentage."
    >
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="kd-text" className="block text-sm font-medium text-ink mb-1">Text Content</label>
            <textarea id="kd-text" value={text} onChange={e => setText(e.target.value)}
              placeholder="Paste your article or page content here..."
              rows={8}
              className="w-full bg-surface border border-border rounded-[var(--radius-md)] p-4 text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="flex-1">
              <label htmlFor="kd-keyword" className="block text-sm font-medium text-ink mb-1">Keyword or Phrase</label>
              <input id="kd-keyword" value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder='e.g. "content marketing"'
                className="w-full bg-surface border border-border rounded-[var(--radius-md)] px-3 py-2 text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink whitespace-nowrap pb-0.5">
              <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary" />
              Case sensitive
            </label>
            <button onClick={handleCheck} disabled={!canRun}
              className="bg-primary hover:bg-primary-ink text-surface px-6 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
              Check Density
            </button>
            <button onClick={handleClear}
              className="text-sm font-medium text-danger hover:text-danger/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger rounded whitespace-nowrap">
              Clear
            </button>
          </div>
        </div>

        {hasRun && (
          <div className="animate-in fade-in">
            {!result || !text.trim() || !keyword.trim() ? (
              <div className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 text-sm text-ink-muted">
                Enter both text and a keyword to analyze density.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 text-center">
                    <div className="text-3xl font-display font-medium text-primary mb-1">{result.totalWords}</div>
                    <div className="text-xs text-ink-muted uppercase tracking-wider font-medium">Total Words</div>
                  </div>
                  <div className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 text-center">
                    <div className="text-3xl font-display font-medium text-primary mb-1">{result.occurrences}</div>
                    <div className="text-xs text-ink-muted uppercase tracking-wider font-medium">Occurrences</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1 bg-canvas border border-border rounded-[var(--radius-md)] p-4 text-center">
                    <div className="text-3xl font-display font-medium text-primary mb-1">{result.density}%</div>
                    <div className="text-xs text-ink-muted uppercase tracking-wider font-medium">Keyword Density</div>
                  </div>
                </div>

                {result.occurrences === 0 && (
                  <div className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 text-sm text-ink-muted">
                    Keyword &ldquo;{keyword}&rdquo; not found in the text{caseSensitive ? " (case-sensitive mode)" : ""}.
                  </div>
                )}

                <p className="text-xs text-ink-muted mt-2">
                  ℹ️ Density = (occurrences × keyword word count) ÷ total words × 100. Counting is case-{caseSensitive ? "sensitive" : "insensitive"} and phrase-based. There is no universally &ldquo;ideal&rdquo; keyword density — focus on natural, readable writing.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
