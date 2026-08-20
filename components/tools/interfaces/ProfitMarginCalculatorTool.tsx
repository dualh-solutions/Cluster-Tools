"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

export default function ProfitMarginCalculatorTool() {
  const [cost, setCost] = useState("50");
  const [revenue, setRevenue] = useState("100");

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const calculate = () => {
    const c = parseFloat(cost);
    const r = parseFloat(revenue);

    if (isNaN(c) || isNaN(r) || r === 0 || c === 0) return null;

    const grossProfit = r - c;
    const grossMargin = (grossProfit / r) * 100;
    const markup = (grossProfit / c) * 100;

    return {
      grossProfit,
      grossMargin: parseFloat(grossMargin.toFixed(2)),
      markup: parseFloat(markup.toFixed(2))
    };
  };

  const res = calculate();

  const handleReset = () => {
    setCost("");
    setRevenue("");
  };

  return (
    <ToolLayout
      title="Profit Margin Calculator"
      description="Calculate gross profit, margin, and markup based on your cost and revenue."
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
            <h3 className="font-display text-lg font-medium text-ink mb-2">Financial Details</h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Cost of Goods Sold (COGS)</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Total Revenue (Sales)</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
          </div>

          <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-6 shadow-sm flex flex-col">
            <h3 className="font-display text-lg font-medium text-ink mb-6">Results</h3>
            
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-canvas border border-border/50 rounded-[var(--radius-md)] p-6 flex flex-col justify-center items-center text-center flex-1">
                <span className="text-sm text-ink-muted mb-2 uppercase tracking-wider font-medium">Gross Profit</span>
                <div className={`text-4xl font-display font-medium ${res && res.grossProfit < 0 ? 'text-danger' : 'text-primary'}`}>
                  {res ? formatCurrency(res.grossProfit) : "—"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-canvas border border-border/50 rounded-[var(--radius-sm)] p-4 text-center">
                  <span className="text-xs text-ink-muted uppercase tracking-wider font-medium block mb-1">Gross Margin</span>
                  <span className={`text-lg font-medium ${res && res.grossMargin < 0 ? 'text-danger' : 'text-success'}`}>
                    {res ? `${res.grossMargin}%` : "—"}
                  </span>
                </div>
                <div className="bg-canvas border border-border/50 rounded-[var(--radius-sm)] p-4 text-center">
                  <span className="text-xs text-ink-muted uppercase tracking-wider font-medium block mb-1">Markup</span>
                  <span className={`text-lg font-medium ${res && res.markup < 0 ? 'text-danger' : 'text-success'}`}>
                    {res ? `${res.markup}%` : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
