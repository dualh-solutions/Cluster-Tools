import React, { useEffect, useState } from "react";
import { formatBytes } from "@/lib/utils/download";

export interface SavingsCounterProps {
  originalSize: number;
  finalSize: number;
}

export function SavingsCounter({ originalSize, finalSize }: SavingsCounterProps) {
  const [currentSize, setCurrentSize] = useState(originalSize);
  
  const savedBytes = originalSize - finalSize;
  const savedPercent = Math.max(0, Math.round((savedBytes / originalSize) * 100));
  
  useEffect(() => {
    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      const timeoutId = setTimeout(() => setCurrentSize(finalSize), 0);
      return () => clearTimeout(timeoutId);
    }

    const duration = 600; // ms
    const startTime = performance.now();
    const startSize = originalSize;
    
    let frameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const nextSize = startSize - (startSize - finalSize) * easeProgress;
      setCurrentSize(nextSize);
      
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCurrentSize(finalSize);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [originalSize, finalSize]);

  // Width of the bar relative to original (which is 100%)
  const barWidth = Math.max(5, (currentSize / originalSize) * 100);
  const isFinished = currentSize === finalSize;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center gap-4 text-sm">
        <div className="font-mono text-ink tabular-nums flex items-center gap-2">
          <span>{formatBytes(originalSize)}</span>
          <span className="text-ink-muted">→</span>
          <span>{formatBytes(currentSize)}</span>
        </div>
        
        {savedPercent > 0 && (
          <div 
            className={`font-mono text-xs px-2 py-0.5 rounded-full font-medium transition-colors duration-500 flex items-center gap-1 ${
              isFinished ? "bg-success/10 text-success" : "bg-accent/10 text-accent"
            }`}
          >
            <span>↓</span>
            <span>{savedPercent}%</span>
          </div>
        )}
      </div>
      
      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden flex">
        <div 
          className={`h-full transition-all duration-75 ${isFinished ? "bg-success" : "bg-primary"}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );
}
