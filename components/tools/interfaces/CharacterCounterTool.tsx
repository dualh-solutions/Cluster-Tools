"use client";

import React, { useState, useMemo } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

export default function CharacterCounterTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    let characters = 0;
    let charactersNoSpaces = 0;
    let strategy = "Unicode Code Points";
    
    if (text.length > 0) {
      try {
        // Use Intl.Segmenter for true grapheme cluster counting if available
        if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
          const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
          const segments = Array.from(segmenter.segment(text));
          characters = segments.length;
          charactersNoSpaces = segments.filter(s => !/\s/.test(s.segment)).length;
          strategy = "Grapheme Clusters (Visual Characters)";
        } else {
          // Fallback to Unicode code points
          const points = [...text];
          characters = points.length;
          charactersNoSpaces = points.filter(p => !/\s/.test(p)).length;
        }
      } catch {
        const points = [...text];
        characters = points.length;
        charactersNoSpaces = points.filter(p => !/\s/.test(p)).length;
      }
    }

    const codeUnits = text.length;
    const lines = text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;

    return { characters, charactersNoSpaces, codeUnits, lines, strategy };
  }, [text]);

  const handleClear = () => {
    setText("");
  };

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <ToolLayout
      title="Character Counter"
      description="Count characters accurately, including emojis and Unicode grapheme clusters."
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="text-input" className="text-sm font-medium text-ink">
              Type or paste your text
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
            placeholder="Start typing or paste your text here..."
            className="w-full h-[400px] bg-surface border border-border rounded-[var(--radius-md)] p-4 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
          ></textarea>
          
          {text.length > 0 && (
            <div className="mt-2 text-xs text-ink-muted">
              <strong>Counting Strategy:</strong> {stats.strategy}
            </div>
          )}
        </div>
        
        <div className="bg-surface border border-border rounded-[var(--radius-md)] p-6 h-fit">
          <h3 className="font-display text-lg font-medium text-ink mb-6">Character Statistics</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-canvas rounded-[var(--radius-sm)] p-4 border border-border text-center">
              <div className="text-3xl font-display font-medium text-primary mb-1">{stats.characters}</div>
              <div className="text-xs text-ink-muted uppercase tracking-wider font-medium">Characters</div>
            </div>
            <div className="bg-canvas rounded-[var(--radius-sm)] p-4 border border-border text-center">
              <div className="text-3xl font-display font-medium text-primary mb-1">{stats.charactersNoSpaces}</div>
              <div className="text-xs text-ink-muted uppercase tracking-wider font-medium">Without Spaces</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-ink-muted" title="Basic UTF-16 code units (traditional length)">Code Units</span>
              <span className="text-sm font-medium text-ink font-mono">{stats.codeUnits}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-ink-muted">Lines</span>
              <span className="text-sm font-medium text-ink font-mono">{stats.lines}</span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
