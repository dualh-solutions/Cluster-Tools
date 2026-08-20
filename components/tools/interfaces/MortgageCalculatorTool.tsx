"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

export default function MortgageCalculatorTool() {
  const [homePrice, setHomePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [termYears, setTermYears] = useState("30");

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const calculateMortgage = () => {
    if (!homePrice || !downPayment || !interestRate || !termYears) return null;
    
    const price = parseFloat(homePrice);
    const down = parseFloat(downPayment);
    const principal = price - down;
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(termYears) * 12;

    if (isNaN(principal) || isNaN(r) || isNaN(n) || principal <= 0 || n <= 0) return null;

    if (r === 0) {
      const monthlyPayment = principal / n;
      return {
        principalAmount: formatCurrency(principal),
        monthlyPayment: formatCurrency(monthlyPayment),
        totalInterest: formatCurrency(0),
        totalPayment: formatCurrency(principal)
      };
    }

    const monthlyPayment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - principal;

    return {
      principalAmount: formatCurrency(principal),
      monthlyPayment: formatCurrency(monthlyPayment),
      totalInterest: formatCurrency(totalInterest),
      totalPayment: formatCurrency(totalPayment)
    };
  };

  const result = calculateMortgage();

  const handleReset = () => {
    setHomePrice("");
    setDownPayment("");
    setInterestRate("");
    setTermYears("30");
  };

  return (
    <ToolLayout
      title="Mortgage Calculator"
      description="Estimate your monthly mortgage payments based on home price, down payment, and interest rate."
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
            <h3 className="font-display text-lg font-medium text-ink">Mortgage Details</h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Home Price ($)</label>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(e.target.value)}
                placeholder="e.g., 350000"
                min="0"
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Down Payment ($)</label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder="e.g., 70000"
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
                placeholder="e.g., 6.5"
                min="0"
                step="0.1"
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Loan Term (Years)</label>
              <input
                type="number"
                value={termYears}
                onChange={(e) => setTermYears(e.target.value)}
                placeholder="e.g., 30"
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
              <span className="text-sm text-ink-muted uppercase tracking-wider font-medium">Estimated Monthly Payment</span>
              <div className="text-3xl font-display font-medium text-primary">
                {result ? result.monthlyPayment : "—"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 bg-canvas border border-border/50 rounded-[var(--radius-md)] p-4 flex flex-col justify-center gap-1">
                <span className="text-xs text-ink-muted uppercase tracking-wider font-medium">Principal Amount</span>
                <div className="text-lg font-display font-medium text-ink">
                  {result ? result.principalAmount : "—"}
                </div>
              </div>
              <div className="bg-canvas border border-border/50 rounded-[var(--radius-md)] p-4 flex flex-col justify-center gap-1">
                <span className="text-xs text-ink-muted uppercase tracking-wider font-medium">Total Interest</span>
                <div className="text-lg font-display font-medium text-ink">
                  {result ? result.totalInterest : "—"}
                </div>
              </div>
              <div className="bg-canvas border border-border/50 rounded-[var(--radius-md)] p-4 flex flex-col justify-center gap-1">
                <span className="text-xs text-ink-muted uppercase tracking-wider font-medium">Total Cost of Loan</span>
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
