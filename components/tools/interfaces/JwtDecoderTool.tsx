"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

/**
 * JWT Decoder — decodes JWT header and payload entirely in the browser.
 *
 * IMPORTANT: This tool DOES NOT verify the JWT signature.
 * Decoding a JWT does not verify its signature. A decoded JWT should
 * not be trusted for authorization decisions without server-side verification.
 *
 * Security constraints:
 * - eval() is NEVER used
 * - new Function() is NEVER used
 * - Decoded content is rendered as text only — never executed
 * - No data is sent to any external service
 */

function base64UrlDecode(input: string): string {
  // Convert base64url to base64
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  // Pad to multiple of 4
  while (base64.length % 4 !== 0) base64 += "=";
  try {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    throw new Error("Invalid Base64URL encoding");
  }
}

interface JwtPart {
  raw: string;
  decoded: string;
  parsed: unknown;
  error: string | null;
}

interface JwtResult {
  header: JwtPart;
  payload: JwtPart;
  signature: string;
  valid: boolean;
  error: string | null;
}

function decodeJwt(token: string): JwtResult | null {
  const trimmed = token.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    return {
      header: { raw: "", decoded: "", parsed: null, error: null },
      payload: { raw: "", decoded: "", parsed: null, error: null },
      signature: "",
      valid: false,
      error: `Invalid JWT structure: expected 3 parts separated by '.', got ${parts.length}.`
    };
  }

  const [headerRaw, payloadRaw, signatureRaw] = parts;

  function decodePart(raw: string): JwtPart {
    try {
      const decoded = base64UrlDecode(raw);
      let parsed: unknown = null;
      let error: string | null = null;
      try {
        parsed = JSON.parse(decoded);
      } catch {
        error = "Decoded bytes are not valid JSON.";
      }
      return { raw, decoded, parsed, error };
    } catch (e) {
      return { raw, decoded: "", parsed: null, error: (e instanceof Error ? e.message : "Decode error") };
    }
  }

  const header = decodePart(headerRaw);
  const payload = decodePart(payloadRaw);

  return {
    header,
    payload,
    signature: signatureRaw,
    valid: header.error === null && payload.error === null,
    error: null
  };
}

function formatJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function JwtPartDisplay({ label, part, color }: { label: string; part: JwtPart; color: string }) {
  const [copied, setCopied] = useState(false);
  const display = part.parsed !== null ? formatJson(part.parsed) : part.decoded || part.raw;

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>{label}</span>
        {display && (
          <button onClick={handleCopy}
            className="text-xs font-medium text-primary hover:text-primary-ink transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
      {part.error ? (
        <div className="bg-danger/10 border border-danger/20 rounded-[var(--radius-md)] p-3 text-danger text-xs font-mono">
          {part.error}
        </div>
      ) : (
        <pre className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 text-xs font-mono text-ink whitespace-pre-wrap break-all overflow-x-auto">
          {display || "(empty)"}
        </pre>
      )}
    </div>
  );
}

export default function JwtDecoderTool() {
  const [token, setToken] = useState("");
  const result = token.trim() ? decodeJwt(token) : null;

  return (
    <ToolLayout
      title="JWT Decoder"
      description="Decode and inspect JWT header and payload in your browser. Entirely local — nothing is sent anywhere."
    >
      <div className="w-full flex flex-col gap-6">
        <div className="bg-amber-50 border border-amber-200 rounded-[var(--radius-md)] px-4 py-3 flex items-start gap-2">
          <span className="text-amber-600 text-sm mt-0.5" aria-hidden="true">⚠️</span>
          <p className="text-sm text-amber-700 font-medium">
            Decoding a JWT does not verify its signature. Never make authorization decisions based solely on a decoded token without server-side verification.
          </p>
        </div>

        <div>
          <label htmlFor="jwt-input" className="block text-sm font-medium text-ink mb-2">JWT Token</label>
          <textarea id="jwt-input" value={token} onChange={e => setToken(e.target.value)}
            placeholder="Paste your JWT here (header.payload.signature)"
            rows={4}
            className="w-full bg-surface border border-border rounded-[var(--radius-md)] p-4 font-mono text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y" />
          {token && (
            <button onClick={() => setToken("")}
              className="mt-1 text-xs font-medium text-danger hover:text-danger/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-danger rounded">
              Clear
            </button>
          )}
        </div>

        {result && (
          <div className="animate-in fade-in flex flex-col gap-4">
            {result.error ? (
              <div className="bg-danger/10 border border-danger/20 rounded-[var(--radius-md)] p-4 text-danger text-sm font-medium">
                {result.error}
              </div>
            ) : (
              <>
                <JwtPartDisplay label="Header" part={result.header} color="text-primary" />
                <JwtPartDisplay label="Payload" part={result.payload} color="text-emerald-600" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">Signature</span>
                  <pre className="bg-canvas border border-border rounded-[var(--radius-md)] p-4 text-xs font-mono text-ink-muted whitespace-pre-wrap break-all mt-2">
                    {result.signature}
                  </pre>
                  <p className="text-xs text-ink-muted mt-1">Signature is displayed as-is (raw Base64URL). It is NOT verified by this tool.</p>
                </div>
              </>
            )}
            {result.valid && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-[var(--radius-md)] px-4 py-2 text-sm text-emerald-700">
                ✓ Structure decoded successfully. Remember: decoded ≠ verified.
              </div>
            )}
          </div>
        )}

        <div className="bg-canvas border border-border rounded-[var(--radius-md)] p-4">
          <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-2">How it works</p>
          <ul className="text-xs text-ink-muted space-y-1 list-disc list-inside">
            <li>Splits the token at <code className="font-mono">.</code> separators into header, payload, and signature.</li>
            <li>Decodes the Base64URL-encoded header and payload with <code className="font-mono">atob()</code> + <code className="font-mono">TextDecoder</code>.</li>
            <li>Parses the decoded JSON using <code className="font-mono">JSON.parse()</code>. No <code className="font-mono">eval</code> is used.</li>
            <li>The signature is NOT verified. Cryptographic verification requires the secret or public key on the server.</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
