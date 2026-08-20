"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

export default function LoanCalculatorTool() {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [termMonths, setTermMonths] = useState("");

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const calculateLoan = () => {
    if (!principal || !interestRate || !termMonths) return null;
    
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(termMonths);

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || n <= 0) return null;

    if (r === 0) {
      const monthlyPayment = p / n;
      return {
        monthlyPayment: formatCurrency(monthlyPayment),
        totalInterest: formatCurrency(0),
        totalPayment: formatCurrency(p)
      };
    }

    const monthlyPayment = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - p;

    return {
      monthlyPayment: formatCurrency(monthlyPayment),
      totalInterest: formatCurrency(totalInterest),
      totalPayment: formatCurrency(totalPayment)
    };
  };

  const result = calculateLoan();

  const handleReset = () => {
    setPrincipal("");
    setInterestRate("");
    setTermMonths("");
  };

  return (
    <ToolLayout
      title="Loan Calculator"
      description="Calculate monthly payments, total interest, and total cost of a loan."
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
          {/* Input Section */}
          <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-6 shadow-sm flex flex-col gap-6">
            <h3 className="font-display text-lg font-medium text-ink">Loan Details</h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Loan Amount ($)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="e.g., 10000"
                min="0"
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Annual Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g., 5.5"
                min="0"
                step="0.1"
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Loan Term (Months)</label>
              <input
                type="number"
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
                placeholder="e.g., 60"
                min="1"
                step="1"
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-6 shadow-sm flex flex-col gap-6">
            <h3 className="font-display text-lg font-medium text-ink">Repayment Summary</h3>
            
            <div className="bg-canvas border border-border/50 rounded-[var(--radius-md)] p-4 flex flex-col justify-center gap-1">
              <span className="text-sm text-ink-muted uppercase tracking-wider font-medium">Monthly Payment</span>
              <div className="text-3xl font-display font-medium text-primary">
                {result ? result.monthlyPayment : "—"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-canvas border border-border/50 rounded-[var(--radius-md)] p-4 flex flex-col justify-center gap-1">
                <span className="text-xs text-ink-muted uppercase tracking-wider font-medium">Total Interest</span>
                <div className="text-lg font-display font-medium text-ink">
                  {result ? result.totalInterest : "—"}
                </div>
              </div>
              <div className="bg-canvas border border-border/50 rounded-[var(--radius-md)] p-4 flex flex-col justify-center gap-1">
                <span className="text-xs text-ink-muted uppercase tracking-wider font-medium">Total Payment</span>
                <div className="text-lg font-display font-medium text-ink">
                  {result ? result.totalPayment : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
