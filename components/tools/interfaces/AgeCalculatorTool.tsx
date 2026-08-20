"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

interface AgeResult {
  years: number;
  months: number;
  days: number;
}

export default function AgeCalculatorTool() {
  // Use today's date in local timezone as default YYYY-MM-DD
  const [dob, setDob] = useState("");
  const [targetDate, setTargetDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  let result: AgeResult | null = null;
  let error: string | null = null;
    if (!dob || !targetDate) {
      result = null;
      error = null;
    } else {
    const birthDate = new Date(dob);
    const target = new Date(targetDate);

    // Reset time components to strictly compare dates
    birthDate.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    if (isNaN(birthDate.getTime()) || isNaN(target.getTime())) {
      error = "Invalid date format";
    } else if (birthDate > target) {
      error = "Date of birth cannot be after the target date";
    } else {
      let years = target.getFullYear() - birthDate.getFullYear();
      let months = target.getMonth() - birthDate.getMonth();
      let days = target.getDate() - birthDate.getDate();

      if (days < 0) {
        months -= 1;
        // Get the number of days in the previous month
        const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      result = { years, months, days };
    }
  }

  const handleReset = () => {
    setDob("");
    const today = new Date();
    setTargetDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
  };

  return (
    <ToolLayout
      title="Age Calculator"
      description="Calculate your exact age in years, months, and days based on your date of birth."
    >
      <div className="w-full max-w-[768px] mx-auto">
        <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-6 md:p-8 shadow-sm">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-xl font-medium text-ink">Calculate Age</h2>
            <button
              onClick={handleReset}
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-ink mb-2">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-4 py-3 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-ink mb-2">
                Age at the Date of
              </label>
              <input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-4 py-3 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-[var(--radius-md)] p-4 text-danger text-sm font-medium mb-8">
              {error}
            </div>
          )}

          <div className="bg-canvas border border-border/50 rounded-[var(--radius-md)] p-6">
            <h3 className="text-sm text-ink-muted uppercase tracking-wider font-medium mb-4">Result</h3>
            
            {result ? (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-surface border border-border rounded-[var(--radius-sm)] p-4">
                  <div className="text-4xl font-display font-medium text-primary mb-1">
                    {result.years}
                  </div>
                  <div className="text-sm text-ink font-medium">Years</div>
                </div>
                <div className="bg-surface border border-border rounded-[var(--radius-sm)] p-4">
                  <div className="text-4xl font-display font-medium text-primary mb-1">
                    {result.months}
                  </div>
                  <div className="text-sm text-ink font-medium">Months</div>
                </div>
                <div className="bg-surface border border-border rounded-[var(--radius-sm)] p-4">
                  <div className="text-4xl font-display font-medium text-primary mb-1">
                    {result.days}
                  </div>
                  <div className="text-sm text-ink font-medium">Days</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-ink-muted">
                Please enter a valid date of birth.
              </div>
            )}
            
            {result && (
              <div className="mt-6 text-center text-ink text-lg font-medium">
                You are {result.years} years, {result.months} months, and {result.days} days old.
              </div>
            )}
          </div>

        </div>
      </div>
    </ToolLayout>
  );
}
