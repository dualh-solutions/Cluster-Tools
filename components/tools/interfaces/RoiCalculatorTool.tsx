"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

export default function RoiCalculatorTool() {
  const [amountInvested, setAmountInvested] = useState("1000");
  const [amountReturned, setAmountReturned] = useState("1500");

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const calculate = () => {
    const invested = parseFloat(amountInvested);
    const returned = parseFloat(amountReturned);

    if (isNaN(invested) || isNaN(returned) || invested === 0) return null;

    const gain = returned - invested;
    const roi = (gain / invested) * 100;

    return {
      gain,
      roi: parseFloat(roi.toFixed(2))
    };
  };

  const res = calculate();

  const handleReset = () => {
    setAmountInvested("");
    setAmountReturned("");
  };

  return (
    <ToolLayout
      title="ROI Calculator"
      description="Calculate Return on Investment (ROI) to evaluate the efficiency of an investment."
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
          <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-6 shadow-sm flex flex-col gap-6">
            <h3 className="font-display text-lg font-medium text-ink mb-2">Investment Details</h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Amount Invested</label>
              <input
                type="number"
                value={amountInvested}
                onChange={(e) => setAmountInvested(e.target.value)}
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Amount Returned</label>
              <input
                type="number"
                value={amountReturned}
                onChange={(e) => setAmountReturned(e.target.value)}
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
          </div>

          <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-6 shadow-sm flex flex-col">
            <h3 className="font-display text-lg font-medium text-ink mb-6">Results</h3>
            
            <div className="flex-1 flex flex-col gap-4 justify-center">
              <div className="bg-canvas border border-border/50 rounded-[var(--radius-md)] p-6 flex flex-col justify-center items-center text-center">
                <span className="text-sm text-ink-muted mb-2 uppercase tracking-wider font-medium">Return on Investment (ROI)</span>
                <div className={`text-4xl font-display font-medium ${res && res.roi < 0 ? 'text-danger' : 'text-success'}`}>
                  {res ? `${res.roi}%` : "—"}
                </div>
              </div>

              <div className="bg-canvas border border-border/50 rounded-[var(--radius-sm)] p-4 text-center mt-2">
                <span className="text-xs text-ink-muted uppercase tracking-wider font-medium block mb-1">Investment Gain / Loss</span>
                <span className={`text-lg font-medium ${res && res.gain < 0 ? 'text-danger' : 'text-success'}`}>
                  {res ? formatCurrency(res.gain) : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
