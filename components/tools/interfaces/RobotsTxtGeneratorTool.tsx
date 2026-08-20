"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

interface RobotRule {
  id: string;
  userAgent: string;
  disallowPaths: string;
  allowPaths: string;
}

function generateRobotsTxt(rules: RobotRule[], sitemapUrl: string): string {
  const lines: string[] = [];
  for (const rule of rules) {
    lines.push(`User-agent: ${rule.userAgent || "*"}`);
    if (rule.allowPaths) {
      rule.allowPaths.split("\n").map(p => p.trim()).filter(Boolean).forEach(p => {
        lines.push(`Allow: ${p}`);
      });
    }
    if (rule.disallowPaths) {
      rule.disallowPaths.split("\n").map(p => p.trim()).filter(Boolean).forEach(p => {
        lines.push(`Disallow: ${p}`);
      });
    }
    lines.push("");
  }
  if (sitemapUrl.trim()) {
    lines.push(`Sitemap: ${sitemapUrl.trim()}`);
  }
  return lines.join("\n").trim();
}

export default function RobotsTxtGeneratorTool() {
  const [rules, setRules] = useState<RobotRule[]>([
    { id: "1", userAgent: "*", disallowPaths: "/admin/\n/private/", allowPaths: "/" }
  ]);
  const [sitemapUrl, setSitemapUrl] = useState("https://example.com/sitemap.xml");
  const [copied, setCopied] = useState(false);

  const addRule = () => {
    setRules(prev => [...prev, { id: Date.now().toString(), userAgent: "", disallowPaths: "", allowPaths: "" }]);
  };

  const removeRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const updateRule = (id: string, field: keyof RobotRule, value: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const output = generateRobotsTxt(rules, sitemapUrl);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass = "w-full bg-surface border border-border rounded-[var(--radius-sm)] px-3 py-2 text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
  const labelClass = "block text-xs font-medium text-ink-muted mb-1";

  return (
    <ToolLayout
      title="Robots.txt Generator"
      description="Generate a valid robots.txt file with custom User-agent rules, Allow/Disallow directives, and Sitemap URL."
    >
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {rules.map((rule, i) => (
            <div key={rule.id} className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-ink">Rule {i + 1}</span>
                {rules.length > 1 && (
                  <button onClick={() => removeRule(rule.id)}
                    className="text-xs text-danger hover:text-danger/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger rounded">
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label htmlFor={`ua-${rule.id}`} className={labelClass}>User-agent</label>
                  <input id={`ua-${rule.id}`} value={rule.userAgent}
                    onChange={e => updateRule(rule.id, "userAgent", e.target.value)}
                    placeholder="* (all bots)" className={inputClass} />
                </div>
                <div>
                  <label htmlFor={`allow-${rule.id}`} className={labelClass}>Allow paths (one per line)</label>
                  <textarea id={`allow-${rule.id}`} value={rule.allowPaths}
                    onChange={e => updateRule(rule.id, "allowPaths", e.target.value)}
                    placeholder="/" rows={3} className={inputClass + " resize-y"} />
                </div>
                <div>
                  <label htmlFor={`disallow-${rule.id}`} className={labelClass}>Disallow paths (one per line)</label>
                  <textarea id={`disallow-${rule.id}`} value={rule.disallowPaths}
                    onChange={e => updateRule(rule.id, "disallowPaths", e.target.value)}
                    placeholder="/admin/" rows={3} className={inputClass + " resize-y"} />
                </div>
              </div>
            </div>
          ))}
          <button onClick={addRule}
            className="self-start text-sm font-medium text-primary hover:text-primary-ink border border-primary/30 px-4 py-2 rounded-[var(--radius-sm)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            + Add Rule
          </button>
        </div>

        <div>
          <label htmlFor="sitemap-url" className={labelClass}>Sitemap URL (optional)</label>
          <input id="sitemap-url" value={sitemapUrl}
            onChange={e => setSitemapUrl(e.target.value)}
            placeholder="https://example.com/sitemap.xml"
            className="w-full bg-surface border border-border rounded-[var(--radius-md)] px-3 py-2 text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-ink">Generated robots.txt</h3>
            <button onClick={handleCopy}
              className="text-sm font-medium text-primary hover:text-primary-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 text-sm font-mono text-ink whitespace-pre-wrap break-all">
            {output}
          </pre>
          <p className="mt-2 text-xs text-ink-muted">
            ℹ️ Place this file at your domain root (e.g., https://example.com/robots.txt). Robots.txt is a guideline — compliant crawlers respect it, but it is not a security mechanism.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
