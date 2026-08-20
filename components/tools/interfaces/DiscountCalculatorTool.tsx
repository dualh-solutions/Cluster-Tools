"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/shared/ToolLayout";

export default function DiscountCalculatorTool() {
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const calculateDiscount = () => {
    if (!originalPrice || !discountPercent) return null;
    
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);

    if (isNaN(price) || isNaN(discount) || price < 0 || discount < 0 || discount > 100) return null;

    const savings = price * (discount / 100);
    const finalPrice = price - savings;

    return {
      savingsAmount: formatCurrency(savings),
      finalPrice: formatCurrency(finalPrice)
    };
  };

  const result = calculateDiscount();

  const handleReset = () => {
    setOriginalPrice("");
    setDiscountPercent("");
  };

  return (
    <ToolLayout
      title="Discount Calculator"
      description="Quickly calculate the final price of an item after a percentage discount."
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
            <h3 className="font-display text-lg font-medium text-ink">Price Details</h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Original Price ($)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="e.g., 100"
                min="0"
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-ink">Discount (%)</label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="e.g., 20"
                min="0"
                max="100"
                step="0.1"
                className="w-full bg-canvas border border-border rounded-[var(--radius-sm)] px-3 py-2 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-6 shadow-sm flex flex-col gap-6">
            <h3 className="font-display text-lg font-medium text-ink">Final Price Summary</h3>
            
            <div className="bg-canvas border border-border/50 rounded-[var(--radius-md)] p-4 flex flex-col justify-center gap-1">
              <span className="text-sm text-ink-muted uppercase tracking-wider font-medium">Final Price</span>
              <div className="text-3xl font-display font-medium text-primary">
                {result ? result.finalPrice : "—"}
              </div>
            </div>

            <div className="bg-canvas border border-border/50 rounded-[var(--radius-md)] p-4 flex flex-col justify-center gap-1">
              <span className="text-xs text-ink-muted uppercase tracking-wider font-medium">You Save</span>
              <div className="text-lg font-display font-medium text-success">
                {result ? result.savingsAmount : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
