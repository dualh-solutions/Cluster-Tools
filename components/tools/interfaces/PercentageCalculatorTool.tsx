"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

export default function PercentageCalculatorTool() {
  // Mode 1: What is X% of Y?
  const [m1x, setM1x] = useState("");
  const [m1y, setM1y] = useState("");

  // Mode 2: X is what percentage of Y?
  const [m2x, setM2x] = useState("");
  const [m2y, setM2y] = useState("");

  // Mode 3: Percentage increase/decrease
  const [m3x, setM3x] = useState("");
  const [m3y, setM3y] = useState("");

  const formatNumber = (num: number) => {
    // Format to 4 decimal places maximum, remove trailing zeros
    return parseFloat(num.toFixed(4)).toString();
  };

  const calculateMode1 = () => {
    if (!m1x || !m1y) return null;
    const x = parseFloat(m1x);
    const y = parseFloat(m1y);
    if (!isNaN(x) && !isNaN(y)) {
      return formatNumber((x / 100) * y);
    }
    return null;
  };

  const calculateMode2 = () => {
    if (!m2x || !m2y) return null;
    const x = parseFloat(m2x);
    const y = parseFloat(m2y);
    if (!isNaN(x) && !isNaN(y) && y !== 0) {
      return formatNumber((x / y) * 100);
    } else if (y === 0) {
      return "Infinity (Division by zero)";
    }
    return null;
  };

  const calculateMode3 = () => {
    if (!m3x || !m3y) return null;
    const x = parseFloat(m3x);
    const y = parseFloat(m3y);
    if (!isNaN(x) && !isNaN(y) && x !== 0) {
      const diff = y - x;
      const percentage = (Math.abs(diff) / Math.abs(x)) * 100;
      return {
        value: formatNumber(percentage),
        type: diff >= 0 ? "increase" : "decrease"
      };
    } else if (x === 0) {
      return { value: "Infinity (Division by zero)", type: "increase" };
    }
    return null;
  };

  const m1res = calculateMode1();
  const m2res = calculateMode2();
  const m3res = calculateMode3() as { value: string, type: "increase" | "decrease" } | null;

  const handleReset = () => {
    setM1x(""); setM1y("");
    setM2x(""); setM2y("");
    setM3x(""); setM3y("");
  };

  return (
    <ToolLayout
      title="Percentage Calculator"
      description="Calculate percentages, increases, and differences easily. Free, private, and fast."
    >
      <div className="w-full max-w-[896px] mx-auto flex flex-col gap-8">
        
        <div className="flex justify-end">
          <button
            onClick={handleReset}
            className="text-sm font-medium text-ink-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Clear all fields
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mode 1 */}
          <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
            <h3 className="font-display text-lg font-medium text-ink mb-4">What is X% of Y?</h3>
            <div className="flex items-center gap-3 mb-6 flex-wrap sm:flex-nowrap">
              <span className="text-ink font-medium">What is</span>
              <input
                type="number"
                value={m1x}
                onChange={(e) => setM1x(e.target.value)}
                placeholder="X"
                className="w-24 bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-center"
              />
              <span className="text-ink font-medium">% of</span>
              <input
                type="number"
                value={m1y}
                onChange={(e) => setM1y(e.target.value)}
                placeholder="Y"
                className="w-28 bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-center"
              />
              <span className="text-ink font-medium">?</span>
            </div>
            <div className="bg-canvas border border-border/50 rounded-[var(--radius-md)] p-4 min-h-[80px] flex flex-col justify-center">
              <span className="text-sm text-ink-muted mb-1 uppercase tracking-wider font-medium">Result</span>
              <div className="text-2xl font-display font-medium text-primary">
                {m1res !== null ? m1res : "—"}
              </div>
            </div>
          </div>

          {/* Mode 2 */}
          <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
            <h3 className="font-display text-lg font-medium text-ink mb-4">X is what % of Y?</h3>
            <div className="flex items-center gap-3 mb-6 flex-wrap sm:flex-nowrap">
              <input
                type="number"
                value={m2x}
                onChange={(e) => setM2x(e.target.value)}
                placeholder="X"
                className="w-24 bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-center"
              />
              <span className="text-ink font-medium">is what % of</span>
              <input
                type="number"
                value={m2y}
                onChange={(e) => setM2y(e.target.value)}
                placeholder="Y"
                className="w-28 bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-center"
              />
              <span className="text-ink font-medium">?</span>
            </div>
            <div className="bg-canvas border border-border/50 rounded-[var(--radius-md)] p-4 min-h-[80px] flex flex-col justify-center">
              <span className="text-sm text-ink-muted mb-1 uppercase tracking-wider font-medium">Result</span>
              <div className="text-2xl font-display font-medium text-primary">
                {m2res !== null ? `${m2res}%` : "—"}
              </div>
            </div>
          </div>

          {/* Mode 3 */}
          <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-6 shadow-sm md:col-span-2">
            <h3 className="font-display text-lg font-medium text-ink mb-4">Percentage Increase/Decrease</h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-ink font-medium whitespace-nowrap">From</span>
                <input
                  type="number"
                  value={m3x}
                  onChange={(e) => setM3x(e.target.value)}
                  placeholder="X"
                  className="flex-1 sm:w-32 bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-center"
                />
              </div>
              <span className="text-ink font-medium">to</span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="number"
                  value={m3y}
                  onChange={(e) => setM3y(e.target.value)}
                  placeholder="Y"
                  className="flex-1 sm:w-32 bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-center"
                />
              </div>
            </div>
            <div className="bg-canvas border border-border/50 rounded-[var(--radius-md)] p-4 min-h-[80px] flex flex-col justify-center">
              <span className="text-sm text-ink-muted mb-1 uppercase tracking-wider font-medium">Result</span>
              <div className="text-2xl font-display font-medium flex items-center gap-2">
                {m3res !== null ? (
                  <>
                    <span className={m3res.type === "increase" ? "text-success" : "text-danger"}>
                      {m3res.value}% {m3res.type}
                    </span>
                  </>
                ) : (
                  <span className="text-primary">—</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
