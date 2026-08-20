"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

interface SitemapUrl {
  id: string;
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateSitemap(urls: SitemapUrl[]): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const url of urls) {
    if (!url.loc.trim()) continue;
    lines.push("  <url>");
    lines.push(`    <loc>${escapeXml(url.loc.trim())}</loc>`);
    if (url.lastmod) lines.push(`    <lastmod>${escapeXml(url.lastmod)}</lastmod>`);
    if (url.changefreq) lines.push(`    <changefreq>${escapeXml(url.changefreq)}</changefreq>`);
    if (url.priority) lines.push(`    <priority>${escapeXml(url.priority)}</priority>`);
    lines.push("  </url>");
  }
  lines.push("</urlset>");
  return lines.join("\n");
}

export default function XmlSitemapGeneratorTool() {
  const [urls, setUrls] = useState<SitemapUrl[]>([
    { id: "1", loc: "https://example.com/", lastmod: "", changefreq: "weekly", priority: "1.0" },
    { id: "2", loc: "https://example.com/about", lastmod: "", changefreq: "monthly", priority: "0.8" },
  ]);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrls(prev => prev.map(u => ({ ...u, lastmod: today })));
  }, []);

  const addUrl = () => {
    const today = new Date().toISOString().slice(0, 10);
    setUrls(prev => [...prev, { id: Date.now().toString(), loc: "", lastmod: today, changefreq: "monthly", priority: "0.5" }]);
  };

  const removeUrl = (id: string) => {
    if (urls.length <= 1) return;
    setUrls(prev => prev.filter(u => u.id !== id));
  };

  const updateUrl = (id: string, field: keyof SitemapUrl, value: string) => {
    setUrls(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  const output = generateSitemap(urls);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputClass = "w-full bg-surface border border-border rounded-[var(--radius-sm)] px-3 py-2 text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
  const labelClass = "block text-xs font-medium text-ink-muted mb-1";
  const freqOptions = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
  const priorityOptions = ["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1"];

  return (
    <ToolLayout
      title="XML Sitemap Generator"
      description="Generate a valid XML sitemap for your website with customizable URLs, dates, and priorities."
    >
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {urls.map((url, i) => (
            <div key={url.id} className="bg-canvas border border-border rounded-[var(--radius-md)] p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-ink">URL {i + 1}</span>
                {urls.length > 1 && (
                  <button onClick={() => removeUrl(url.id)}
                    className="text-xs text-danger hover:text-danger/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger rounded">
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label htmlFor={`loc-${url.id}`} className={labelClass}>URL (loc)</label>
                  <input id={`loc-${url.id}`} value={url.loc}
                    onChange={e => updateUrl(url.id, "loc", e.target.value)}
                    placeholder="https://example.com/page" className={inputClass} />
                </div>
                <div>
                  <label htmlFor={`lastmod-${url.id}`} className={labelClass}>Last Modified</label>
                  <input id={`lastmod-${url.id}`} type="date" value={url.lastmod}
                    onChange={e => updateUrl(url.id, "lastmod", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={`changefreq-${url.id}`} className={labelClass}>Change Freq</label>
                  <select id={`changefreq-${url.id}`} value={url.changefreq}
                    onChange={e => updateUrl(url.id, "changefreq", e.target.value)} className={inputClass}>
                    {freqOptions.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor={`priority-${url.id}`} className={labelClass}>Priority</label>
                  <select id={`priority-${url.id}`} value={url.priority}
                    onChange={e => updateUrl(url.id, "priority", e.target.value)} className={inputClass}>
                    {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addUrl}
            className="self-start text-sm font-medium text-primary hover:text-primary-ink border border-primary/30 px-4 py-2 rounded-[var(--radius-sm)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            + Add URL
          </button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-ink">Generated sitemap.xml</h3>
            <div className="flex gap-3">
              <button onClick={handleCopy}
                className="text-sm font-medium text-primary hover:text-primary-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                {copied ? "Copied!" : "Copy"}
              </button>
              <button onClick={handleDownload}
                className="text-sm font-medium text-primary hover:text-primary-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                Download
              </button>
            </div>
          </div>
          <pre className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 text-xs font-mono text-ink whitespace-pre-wrap break-all max-h-[400px] overflow-y-auto">
            {output}
          </pre>
          <p className="mt-2 text-xs text-ink-muted">
            ℹ️ Submit your sitemap URL in Google Search Console after uploading. Generating a sitemap does not guarantee all pages will be indexed.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
