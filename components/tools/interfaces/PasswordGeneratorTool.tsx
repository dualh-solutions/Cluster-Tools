"use client";

import React, { useState, useCallback } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

function generatePassword(length: number, useLower: boolean, useUpper: boolean, useNumbers: boolean, useSymbols: boolean): string {
  const charset = [
    useLower ? LOWERCASE : "",
    useUpper ? UPPERCASE : "",
    useNumbers ? NUMBERS : "",
    useSymbols ? SYMBOLS : "",
  ].join("");
  if (!charset) return "";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }

  // Ensure at least one character from each selected set
  const required: string[] = [];
  if (useLower) required.push(LOWERCASE[new Uint32Array(1)[0] % LOWERCASE.length]);
  if (useUpper) required.push(UPPERCASE[new Uint32Array(1)[0] % UPPERCASE.length]);
  if (useNumbers) required.push(NUMBERS[new Uint32Array(1)[0] % NUMBERS.length]);
  if (useSymbols) required.push(SYMBOLS[new Uint32Array(1)[0] % SYMBOLS.length]);

  // Inject required chars at crypto-random positions without replacing padding
  if (required.length > 0 && required.length <= length) {
    const positions = new Uint32Array(required.length);
    crypto.getRandomValues(positions);
    const chars = password.split("");
    const usedPositions = new Set<number>();
    required.forEach((ch, idx) => {
      let pos = positions[idx] % length;
      while (usedPositions.has(pos)) pos = (pos + 1) % length;
      usedPositions.add(pos);
      chars[pos] = ch;
    });
    password = chars.join("");
  }

  return password;
}

function strengthLabel(length: number, sets: number): { label: string; color: string } {
  if (length < 8 || sets < 2) return { label: "Weak", color: "text-danger" };
  if (length < 12 || sets < 3) return { label: "Fair", color: "text-amber-500" };
  if (length < 16 || sets < 4) return { label: "Good", color: "text-yellow-500" };
  return { label: "Strong", color: "text-emerald-500" };
}

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const activeSetCount = [useLower, useUpper, useNumbers, useSymbols].filter(Boolean).length;
  const canGenerate = activeSetCount > 0;

  const generate = useCallback(() => {
    if (!canGenerate) return;
    setPassword(generatePassword(length, useLower, useUpper, useNumbers, useSymbols));
    setCopied(false);
  }, [length, useLower, useUpper, useNumbers, useSymbols, canGenerate]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = password ? strengthLabel(length, activeSetCount) : null;

  const checkboxClass = "rounded border-border text-primary focus:ring-primary";
  const labelClass = "flex items-center gap-2 text-sm text-ink select-none cursor-pointer";

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate cryptographically strong, random passwords using your browser's built-in secure random number generator."
    >
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="pw-length" className="text-sm font-medium text-ink">Length: {length} characters</label>
            </div>
            <input id="pw-length" type="range" min={6} max={128} value={length}
              onChange={e => setLength(Number(e.target.value))}
              className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-ink-muted mt-1">
              <span>6</span><span>128</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-ink mb-3">Character Sets</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className={labelClass}>
                <input type="checkbox" checked={useLower} onChange={e => setUseLower(e.target.checked)} className={checkboxClass} />
                a–z (lowercase)
              </label>
              <label className={labelClass}>
                <input type="checkbox" checked={useUpper} onChange={e => setUseUpper(e.target.checked)} className={checkboxClass} />
                A–Z (uppercase)
              </label>
              <label className={labelClass}>
                <input type="checkbox" checked={useNumbers} onChange={e => setUseNumbers(e.target.checked)} className={checkboxClass} />
                0–9 (numbers)
              </label>
              <label className={labelClass}>
                <input type="checkbox" checked={useSymbols} onChange={e => setUseSymbols(e.target.checked)} className={checkboxClass} />
                !@#… (symbols)
              </label>
            </div>
            {!canGenerate && (
              <p className="text-xs text-danger mt-2">Select at least one character set.</p>
            )}
          </div>

          <button onClick={generate} disabled={!canGenerate}
            className="w-full bg-primary hover:bg-primary-ink text-surface py-3 rounded-[var(--radius-md)] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
            Generate Password
          </button>
        </div>

        {password && (
          <div className="animate-in fade-in">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-ink">Generated Password</label>
                {strength && <span className={`text-xs font-semibold ${strength.color}`}>{strength.label}</span>}
              </div>
              <button onClick={handleCopy}
                className="text-sm font-medium text-primary hover:text-primary-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-canvas border border-border rounded-[var(--radius-md)] px-4 py-4 font-mono text-sm text-ink break-all select-all">
              {password}
            </div>
            <p className="mt-3 text-xs text-ink-muted">
              ℹ️ Uses <code className="font-mono">crypto.getRandomValues()</code> — cryptographically secure. Password strength depends on length, character variety, and usage context. Never share or reuse passwords.
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
