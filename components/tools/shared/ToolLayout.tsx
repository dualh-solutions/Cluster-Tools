"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools/registry';
import { 
  ArrowLeft, Shrink, UploadCloud, Download, Lock, Zap,
  RefreshCw, Calculator, Code, Search, PenTool, CheckCircle, Eye, Settings, Copy
} from "lucide-react";

export interface ToolLayoutProps {
  title: string;
  description: string;
  categoryName?: string;
  categorySlug?: string;
  children: React.ReactNode;
  hideSafetyBox?: boolean;
  hideHowItWorks?: boolean;
  noChildrenBox?: boolean;
}

export function ToolLayout({
  title,
  description,
  categoryName,
  categorySlug,
  children,
  hideSafetyBox,
  hideHowItWorks,
  noChildrenBox,
}: ToolLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const slug = (params?.slug as string) || (pathname?.split('/').pop() as string);
  const tool = slug ? getToolBySlug(slug) : null;

  const displayTitle = tool ? tool.title.split(' | ')[0] : title;

  // Determine Main Icon based on toolType
  const getMainIcon = () => {
    if (!tool) return Shrink;
    switch (tool.toolType) {
      case "compressor": return Shrink;
      case "converter": return RefreshCw;
      case "calculator": return Calculator;
      case "generator": return Zap;
      case "formatter": return Code;
      case "analyzer": return Search;
      case "editor": return PenTool;
      case "validator": return CheckCircle;
      case "viewer": return Eye;
      default: return Settings;
    }
  };
  const MainIcon = getMainIcon();

  // Determine Step 1
  const getStep1 = () => {
    const hasFiles = tool && tool.inputFormats && tool.inputFormats.length > 0;
    if (hasFiles) {
      return { title: "Upload", desc: "Drop or select\nyour file", icon: UploadCloud, color: "text-[#3B82F6]", bg: "bg-[#EFF6FF]", iconBg: "bg-[#DBEAFE]" };
    }
    return { title: "Input", desc: "Enter your\ndata or text", icon: PenTool, color: "text-[#3B82F6]", bg: "bg-[#EFF6FF]", iconBg: "bg-[#DBEAFE]" };
  };

  // Determine Step 2
  const getStep2 = () => {
    let title = "Process";
    let desc = "We process it\ninstantly";
    let icon = Settings;
    
    if (tool) {
      switch (tool.toolType) {
        case "compressor": title = "Compress"; desc = "We shrink it\ninstantly"; icon = Shrink; break;
        case "converter": title = "Convert"; desc = "We convert\nyour file"; icon = RefreshCw; break;
        case "calculator": title = "Calculate"; desc = "We compute\nthe results"; icon = Calculator; break;
        case "generator": title = "Generate"; desc = "We generate\nthe output"; icon = Zap; break;
        case "formatter": title = "Format"; desc = "We format\nyour code"; icon = Code; break;
        case "analyzer": title = "Analyze"; desc = "We process\nthe data"; icon = Search; break;
        case "editor": title = "Edit"; desc = "Apply your\nchanges"; icon = PenTool; break;
        case "validator": title = "Validate"; desc = "We check\nfor errors"; icon = CheckCircle; break;
        case "viewer": title = "View"; desc = "Render the\ncontents"; icon = Eye; break;
      }
    }
    return { title, desc, icon, color: "text-[#6D28D9]", bg: "bg-[#F4F0FF]", iconBg: "bg-[#EDE9FE]" };
  };

  // Determine Step 3
  const getStep3 = () => {
    const hasFiles = tool && tool.outputFormats && tool.outputFormats.length > 0;
    if (hasFiles) {
      return { title: "Download", desc: "Save your\nprocessed file", icon: Download, color: "text-[#22C55E]", bg: "bg-[#F0FDF4]", iconBg: "bg-[#DCFCE7]" };
    }
    return { title: "Copy", desc: "Copy the\nresults", icon: Copy, color: "text-[#22C55E]", bg: "bg-[#F0FDF4]", iconBg: "bg-[#DCFCE7]" };
  };

  const step1 = getStep1();
  const step2 = getStep2();
  const step3 = getStep3();

  return (
    <div className="w-full max-w-[768px] mx-auto px-4 flex flex-col items-center motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300 ease-out">
      {categoryName && categorySlug && (
        <div className="w-full mb-4">
          <Link
            href={`/tools/${categorySlug}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to {categoryName}
          </Link>
        </div>
      )}

      <div className="w-full text-center mb-8 flex flex-col items-center mt-6">
        <div className="w-[52px] h-[52px] rounded-2xl bg-[#F4F0FF] dark:bg-[#F4F0FF]/10 flex items-center justify-center text-[#6D28D9] dark:text-[#A78BFA] mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <MainIcon size={26} strokeWidth={2} />
        </div>
        <h1 className="text-[32px] font-extrabold text-ink tracking-tight leading-tight mb-3">
          {displayTitle}
        </h1>
        <p className="text-[15px] text-ink-muted max-w-[400px] mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {noChildrenBox ? (
        <div className="w-full flex flex-col mb-4">
          {children}
        </div>
      ) : (
        <div className="w-full bg-surface rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-border p-6 flex flex-col mb-4">
          {children}
        </div>
      )}

      {/* Safety Box */}
      {!hideSafetyBox && (
      <div className="w-full bg-[#F0FDF4] dark:bg-[#F0FDF4]/5 border border-[#DCFCE7] dark:border-[#DCFCE7]/10 rounded-[24px] p-6 flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#22C55E] flex items-center justify-center text-white shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <div className="flex flex-col text-left">
          <h4 className="text-[15px] font-bold text-ink mb-1">Your files are safe with us</h4>
          <p className="text-[14px] text-ink-muted leading-relaxed">
            100% private. Files are processed in your browser and never uploaded to any server.
          </p>
        </div>
      </div>
      )}

      {/* How it works section */}
      {!hideHowItWorks && (
      <div className="w-full bg-surface rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-border pt-6 flex flex-col mb-12 overflow-hidden">
        <div className="flex items-center gap-3 mb-6 px-6">
          <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-[#EFF6FF]/10 flex items-center justify-center text-primary">
            <Zap size={16} strokeWidth={2} />
          </div>
          <h2 className="text-[16px] font-bold text-ink">How it works</h2>
        </div>

        <div className="relative grid grid-cols-3 gap-2 sm:gap-6 px-2 sm:px-6 pb-8">
          {/* Dashed line */}
          <div className="absolute top-[28px] left-[20%] right-[20%] border-t border-dashed border-[#D1D5DB] z-0" />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center z-10">
            <div className="bg-surface px-2 sm:px-4 mb-2">
              <div className={`w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-[16px] ${step1.bg} dark:bg-transparent dark:border dark:border-border flex items-center justify-center ${step1.color}`}>
                <step1.icon size={24} strokeWidth={1.5} />
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full ${step1.iconBg} dark:bg-transparent dark:border dark:border-border ${step1.color} flex items-center justify-center text-[11px] font-bold mb-2`}>1</div>
            <h3 className="text-[12px] sm:text-[13px] font-bold text-ink mb-1">{step1.title}</h3>
            <p className="hidden sm:block text-[12px] text-ink-muted leading-snug whitespace-pre-line">{step1.desc}</p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center z-10">
            <div className="bg-surface px-2 sm:px-4 mb-2">
              <div className={`w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-[16px] ${step2.bg} dark:bg-transparent dark:border dark:border-border flex items-center justify-center ${step2.color}`}>
                <step2.icon size={24} strokeWidth={1.5} />
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full ${step2.iconBg} dark:bg-transparent dark:border dark:border-border ${step2.color} flex items-center justify-center text-[11px] font-bold mb-2`}>2</div>
            <h3 className="text-[12px] sm:text-[13px] font-bold text-ink mb-1">{step2.title}</h3>
            <p className="hidden sm:block text-[12px] text-ink-muted leading-snug whitespace-pre-line">{step2.desc}</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center z-10">
            <div className="bg-surface px-2 sm:px-4 mb-2">
              <div className={`w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-[16px] ${step3.bg} dark:bg-transparent dark:border dark:border-border flex items-center justify-center ${step3.color}`}>
                <step3.icon size={24} strokeWidth={1.5} />
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full ${step3.iconBg} dark:bg-transparent dark:border dark:border-border ${step3.color} flex items-center justify-center text-[11px] font-bold mb-2`}>3</div>
            <h3 className="text-[12px] sm:text-[13px] font-bold text-ink mb-1">{step3.title}</h3>
            <p className="hidden sm:block text-[12px] text-ink-muted leading-snug whitespace-pre-line">{step3.desc}</p>
          </div>
        </div>

        <div className="w-full bg-[#F0FDF4] dark:bg-surface py-3 flex items-center justify-center gap-2 text-[13px] font-semibold text-[#16A34A] border-t border-[#DCFCE7] dark:border-border">
          <Lock size={14} strokeWidth={2.5} />
          <span>100% Private (Processed in browser)</span>
        </div>
      </div>
      )}
    </div>
  );
}
