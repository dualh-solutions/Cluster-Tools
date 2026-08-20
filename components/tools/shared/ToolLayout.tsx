"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export interface ToolLayoutProps {
  title: string;
  description: string;
  categoryName?: string;
  categorySlug?: string;
  children: React.ReactNode;
}

export function ToolLayout({
  title,
  description,
  categoryName,
  categorySlug,
  children,
}: ToolLayoutProps) {
  return (
    <div className="w-full max-w-[896px] mx-auto px-margin-mobile md:px-margin-desktop py-xl md:py-3xl flex flex-col items-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-300 ease-out">
      {categoryName && categorySlug && (
        <div className="w-full mb-md">
          <Link
            href={`/tools/${categorySlug}`}
            className="inline-flex items-center gap-xs text-label-md font-label-md font-bold text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to {categoryName}
          </Link>
        </div>
      )}

      <div className="w-full text-center mb-2xl">
        <h1 className="font-display-lg text-display-lg font-extrabold text-on-surface mb-sm">
          {title}
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant max-w-[672px] mx-auto">
          {description}
        </p>
      </div>

      <div className="w-full bg-surface border border-outline-variant rounded-3xl ambient-shadow p-lg md:p-2xl flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
