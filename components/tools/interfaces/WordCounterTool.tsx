"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

export default function WordCounterTool() {
  const [text, setText] = useState("");

  // Derive stats directly instead of using useEffect + setState
  // Unicode-aware character counts: use Intl.Segmenter (grapheme clusters) if available,
  // otherwise fall back to spread-operator Unicode code point counting.
  let characters = 0;
  let charactersNoSpaces = 0;
  if (text.length > 0) {
    try {
      if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
        const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
        const segs = Array.from(seg.segment(text));
        characters = segs.length;
        charactersNoSpaces = segs.filter((s) => !/\s/.test(s.segment)).length;
      } else {
        const pts = [...text];
        characters = pts.length;
        charactersNoSpaces = pts.filter((p) => !/\s/.test(p)).length;
      }
    } catch {
      const pts = [...text];
      characters = pts.length;
      charactersNoSpaces = pts.filter((p) => !/\s/.test(p)).length;
    }
  }
  
  // Words: split by whitespace but filter out empty strings
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  
  // Sentences: match ending punctuation
  const sentenceMatch = text.match(/[^.!?]+[.!?]+/g);
  // Add 1 for the last sentence if it doesn't have punctuation, provided text has words
  const sentencesCount = sentenceMatch ? sentenceMatch.length + (/[^.!?]+$/.test(text) ? 1 : 0) : (words > 0 ? 1 : 0);
  const sentences = text.trim() === "" ? 0 : sentencesCount;
  
  // Paragraphs: split by double newlines
  const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter(p => p.trim() !== "").length;
  
  // Reading time (assume 200 words per minute)
  const readingTimeMinutes = words / 200;

  const stats = {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTimeMinutes
  };

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
      title="Word Counter"
      description="Count words, characters, sentences, and paragraphs in real-time. Private text analysis."
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
        </div>
        
        <div className="bg-surface border border-border rounded-[var(--radius-md)] p-6 h-fit">
          <h3 className="font-display text-lg font-medium text-ink mb-6">Text Statistics</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-canvas rounded-[var(--radius-sm)] p-4 border border-border text-center">
              <div className="text-3xl font-display font-medium text-primary mb-1">{stats.words}</div>
              <div className="text-xs text-ink-muted uppercase tracking-wider font-medium">Words</div>
            </div>
            <div className="bg-canvas rounded-[var(--radius-sm)] p-4 border border-border text-center">
              <div className="text-3xl font-display font-medium text-primary mb-1">{stats.characters}</div>
              <div className="text-xs text-ink-muted uppercase tracking-wider font-medium">Characters</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-ink-muted">Characters (no spaces)</span>
              <span className="text-sm font-medium text-ink font-mono">{stats.charactersNoSpaces}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-ink-muted">Sentences</span>
              <span className="text-sm font-medium text-ink font-mono">{stats.sentences}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-ink-muted">Paragraphs</span>
              <span className="text-sm font-medium text-ink font-mono">{stats.paragraphs}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-ink-muted">Reading Time</span>
              <span className="text-sm font-medium text-ink">
                {stats.readingTimeMinutes < 1 ? "< 1 min" : `~${Math.ceil(stats.readingTimeMinutes)} min`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
