"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function MetaTagGeneratorTool() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [canonical, setCanonical] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [copied, setCopied] = useState(false);

  const generated = [
    title && `<title>${escapeHtml(title)}</title>`,
    description && `<meta name="description" content="${escapeHtml(description)}">`,
    canonical && `<link rel="canonical" href="${escapeHtml(canonical)}">`,
    robots && `<meta name="robots" content="${escapeHtml(robots)}">`,
    "",
    "<!-- Open Graph -->",
    title && `<meta property="og:title" content="${escapeHtml(ogTitle || title)}">`,
    description && `<meta property="og:description" content="${escapeHtml(ogDescription || description)}">`,
    ogImage && `<meta property="og:image" content="${escapeHtml(ogImage)}">`,
    canonical && `<meta property="og:url" content="${escapeHtml(canonical)}">`,
    `<meta property="og:type" content="website">`,
    "",
    "<!-- Twitter Card -->",
    `<meta name="twitter:card" content="${escapeHtml(twitterCard)}">`,
    (ogTitle || title) && `<meta name="twitter:title" content="${escapeHtml(ogTitle || title)}">`,
    (ogDescription || description) && `<meta name="twitter:description" content="${escapeHtml(ogDescription || description)}">`,
    ogImage && `<meta name="twitter:image" content="${escapeHtml(ogImage)}">`,
  ]
    .filter(Boolean)
    .join("\n");

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasOutput = title || description || canonical;

  const inputClass = "w-full bg-surface border border-border rounded-[var(--radius-md)] px-3 py-2 text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
  const labelClass = "block text-xs font-medium text-ink-muted mb-1";

  return (
    <ToolLayout
      title="Meta Tag Generator"
      description="Generate SEO meta tags, Open Graph, and Twitter Card markup for your web pages."
    >
      <div className="w-full flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="meta-title" className={labelClass}>Page Title</label>
            <input id="meta-title" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="My Page Title" className={inputClass} />
            <p className="text-xs text-ink-muted mt-1">{title.length}/60 chars recommended</p>
          </div>
          <div>
            <label htmlFor="meta-robots" className={labelClass}>Robots Directive</label>
            <select id="meta-robots" value={robots} onChange={e => setRobots(e.target.value)} className={inputClass}>
              <option value="index, follow">index, follow</option>
              <option value="noindex, follow">noindex, follow</option>
              <option value="index, nofollow">index, nofollow</option>
              <option value="noindex, nofollow">noindex, nofollow</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="meta-desc" className={labelClass}>Meta Description</label>
            <textarea id="meta-desc" value={description} onChange={e => setDescription(e.target.value)}
              placeholder="A concise description of your page (150–160 characters recommended)."
              rows={2} className={inputClass + " resize-y"} />
            <p className="text-xs text-ink-muted mt-1">{description.length}/160 chars recommended</p>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="meta-canonical" className={labelClass}>Canonical URL</label>
            <input id="meta-canonical" value={canonical} onChange={e => setCanonical(e.target.value)}
              placeholder="https://example.com/page" className={inputClass} />
          </div>

          <div className="md:col-span-2 border-t border-border pt-4">
            <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Open Graph / Twitter Overrides (optional)</p>
          </div>
          <div>
            <label htmlFor="og-title" className={labelClass}>OG Title (leave blank to use Page Title)</label>
            <input id="og-title" value={ogTitle} onChange={e => setOgTitle(e.target.value)}
              placeholder="Custom OG title" className={inputClass} />
          </div>
          <div>
            <label htmlFor="twitter-card" className={labelClass}>Twitter Card Type</label>
            <select id="twitter-card" value={twitterCard} onChange={e => setTwitterCard(e.target.value)} className={inputClass}>
              <option value="summary_large_image">summary_large_image</option>
              <option value="summary">summary</option>
              <option value="app">app</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="og-desc" className={labelClass}>OG Description (leave blank to use Meta Description)</label>
            <textarea id="og-desc" value={ogDescription} onChange={e => setOgDescription(e.target.value)}
              placeholder="Custom OG description" rows={2} className={inputClass + " resize-y"} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="og-image" className={labelClass}>OG / Twitter Image URL</label>
            <input id="og-image" value={ogImage} onChange={e => setOgImage(e.target.value)}
              placeholder="https://example.com/og-image.png" className={inputClass} />
          </div>
        </div>

        {hasOutput && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-ink">Generated HTML</h3>
              <button onClick={handleCopy}
                className="text-sm font-medium text-primary hover:text-primary-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 text-xs font-mono text-ink whitespace-pre-wrap break-all overflow-x-auto">
              {generated}
            </pre>
            <p className="mt-2 text-xs text-ink-muted">
              ℹ️ These tags inform search engines and social platforms about your page. They do not guarantee specific search rankings.
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
