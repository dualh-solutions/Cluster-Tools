"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

const TITLE_MAX = 60;
const DESC_MAX = 160;

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + "…";
}

export default function SeoSnippetPreviewTool() {
  const [title, setTitle] = useState("My Awesome Page — Example Site");
  const [url, setUrl] = useState("https://example.com/my-awesome-page");
  const [description, setDescription] = useState("This is a concise description of the page content that gives users a clear idea of what to expect when they click through.");

  const displayTitle = truncate(title, TITLE_MAX);
  const displayDesc = truncate(description, DESC_MAX);

  // Simplify URL display: strip protocol, show breadcrumb-like path
  const displayUrl = (() => {
    try {
      const u = new URL(url.startsWith("http") ? url : "https://" + url);
      const parts = [u.hostname, ...u.pathname.split("/").filter(Boolean)];
      return parts.join(" › ");
    } catch {
      return url || "example.com";
    }
  })();

  const inputClass = "w-full bg-surface border border-border rounded-[var(--radius-md)] px-3 py-2 text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
  const labelClass = "block text-sm font-medium text-ink mb-1";

  return (
    <ToolLayout
      title="SEO Snippet Preview"
      description="Preview how your page might appear in Google search results. Adjust title, URL, and description."
    >
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="snippet-title" className={labelClass}>Page Title</label>
            <input id="snippet-title" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="My Page Title" className={inputClass} />
            <p className={`text-xs mt-1 ${title.length > TITLE_MAX ? "text-danger" : "text-ink-muted"}`}>
              {title.length}/{TITLE_MAX} — {title.length > TITLE_MAX ? "Too long — will be truncated" : "Good length"}
            </p>
          </div>
          <div>
            <label htmlFor="snippet-url" className={labelClass}>URL</label>
            <input id="snippet-url" value={url} onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com/page" className={inputClass} />
          </div>
          <div>
            <label htmlFor="snippet-desc" className={labelClass}>Meta Description</label>
            <textarea id="snippet-desc" value={description} onChange={e => setDescription(e.target.value)}
              placeholder="A concise description of your page..." rows={3}
              className={inputClass + " resize-y"} />
            <p className={`text-xs mt-1 ${description.length > DESC_MAX ? "text-danger" : "text-ink-muted"}`}>
              {description.length}/{DESC_MAX} — {description.length > DESC_MAX ? "Too long — will be truncated" : "Good length"}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink mb-3">Search Result Preview</h3>
          <div className="bg-surface border border-gray-200 rounded-[var(--radius-md)] p-5 font-sans max-w-[600px]">
            <div className="text-xs text-[#202124] mb-1 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-gray-200 inline-block" aria-hidden="true"></span>
              <span className="text-[#4d5156] truncate">{displayUrl || "example.com"}</span>
            </div>
            <div className="text-[#1a0dab] text-lg font-medium leading-snug hover:underline cursor-pointer line-clamp-2 mb-1">
              {displayTitle || "Page Title"}
            </div>
            <div className="text-sm text-[#4d5156] leading-snug line-clamp-2">
              {displayDesc || "Page description will appear here."}
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-muted">
            ℹ️ This is an approximation only. Google may choose a different title or description based on the actual page content and search query context. Font rendering and exact pixel widths differ from Google&apos;s actual UI.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
