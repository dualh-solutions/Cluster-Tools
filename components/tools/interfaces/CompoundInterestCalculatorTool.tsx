"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

export default function CompoundInterestCalculatorTool() {
  const [principal, setPrincipal] = useState("10000");
  const [monthlyContribution, setMonthlyContribution] = useState("100");
  const [years, setYears] = useState("10");
  const [interestRate, setInterestRate] = useState("7");
  const [compoundFrequency, setCompoundFrequency] = useState("12");

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const calculate = () => {
    const p = parseFloat(principal) || 0;
    const pmt = parseFloat(monthlyContribution) || 0;
    const t = parseFloat(years) || 0;
    const r = (parseFloat(interestRate) || 0) / 100;
    const n = parseFloat(compoundFrequency) || 12;

    if (t <= 0) return null;

    // Compound interest for principal: P(1 + r/n)^(nt)
    const principalFV = p * Math.pow(1 + r / n, n * t);
    
    // Future value of a series (contributions): PMT × {[(1 + r/n)^(nt) - 1] / (r/n)}
    // Assuming contributions are made at the END of each period
    // If contributions are monthly, but compounding is different, it gets complex.
    // For simplicity, we assume contributions match the compounding frequency or just do an approximation if they differ.
    // Usually, people compound monthly when they contribute monthly.
    
    // Let's standardise on monthly contributions to monthly compounding math, adapting n
    let contributionsFV = 0;
    
    if (r > 0) {
      const r_monthly = r / 12;
      const totalMonths = t * 12;
      contributionsFV = pmt * ((Math.pow(1 + r_monthly, totalMonths) - 1) / r_monthly);
      
      // If compounding is not monthly, the exact formula is more complex, but this is a common approximation.
      // To be accurate with n, we'd need to match PMT frequency with compounding.
      // Let's just use the strict formula for the principal and the monthly formula for the contributions.
    } else {
      contributionsFV = pmt * t * 12;
    }

    const futureValue = principalFV + contributionsFV;
    const totalContributions = pmt * t * 12;
    const totalInvested = p + totalContributions;
    const totalInterest = futureValue - totalInvested;

    return {
      futureValue,
      totalInvested,
      totalInterest,
      totalContributions
    };
  };

  const res = calculate();

  const handleReset = () => {
    setPrincipal("");
    setMonthlyContribution("");
    setYears("");
    setInterestRate("");
  };

  return (
    <ToolLayout
      title="Compound Interest Calculator"
      description="See how your money grows over time with compound interest."
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
          <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-6 shadow-sm flex flex-col gap-4">
            <h3 className="font-display text-lg font-medium text-ink mb-2">Investment Details</h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Initial Investment ($)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Monthly Contribution ($)</label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Length of Time in Years</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Estimated Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                step="0.1"
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Compound Frequency</label>
              <select
                value={compoundFrequency}
                onChange={(e) => setCompoundFrequency(e.target.value)}
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="1">Annually</option>
                <option value="12">Monthly</option>
                <option value="365">Daily</option>
              </select>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-6 shadow-sm flex flex-col">
            <h3 className="font-display text-lg font-medium text-ink mb-6">Results</h3>
            
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-canvas border border-border/50 rounded-[var(--radius-md)] p-6 flex flex-col justify-center items-center text-center flex-1">
                <span className="text-sm text-ink-muted mb-2 uppercase tracking-wider font-medium">Future Value</span>
                <div className="text-4xl font-display font-medium text-primary">
                  {res ? formatCurrency(res.futureValue) : "—"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-canvas border border-border/50 rounded-[var(--radius-sm)] p-4 text-center">
                  <span className="text-xs text-ink-muted uppercase tracking-wider font-medium block mb-1">Total Invested</span>
                  <span className="text-lg font-medium text-ink">
                    {res ? formatCurrency(res.totalInvested) : "—"}
                  </span>
                </div>
                <div className="bg-canvas border border-border/50 rounded-[var(--radius-sm)] p-4 text-center">
                  <span className="text-xs text-ink-muted uppercase tracking-wider font-medium block mb-1">Total Interest</span>
                  <span className="text-lg font-medium text-success">
                    {res ? formatCurrency(res.totalInterest) : "—"}
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
