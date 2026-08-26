import Link from "next/link";
import { TOOLS_REGISTRY, getToolUrl } from "@/lib/tools/registry";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import {
  ArrowRight, Sparkles, Image as ImageIcon, FileText, Type, Code2,
  TrendingUp, Calculator, LayoutGrid, Upload, Sliders, CheckCircle2,
  Lock, Zap, Users, Gift, ShieldCheck, Rocket, Globe, Heart, Download
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { FloatingIcon } from "@/components/animations/FloatingIcon";
import { MagicCardContainer, MagicCard } from "@/components/animations/MagicCard";
import type { Metadata } from "next";

import { constructMetadata } from "@/lib/tools/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Cluster Tools - Fast, Private Online Tools",
  description: "Convert, compress, and edit files entirely in your browser. No uploads, no servers, zero waiting.",
  url: "https://clustertools.online",
  category: "Home",
  other: {
    'og:updated_time': new Date().toISOString(),
  },
});

export default function Home() {
  const popularTools = TOOLS_REGISTRY.filter(t => t.popular).slice(0, 6);

  const displayCategories = [
    { id: "image", name: "Image", icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { id: "pdf", name: "PDF", icon: FileText, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
    { id: "text", name: "Text", icon: Type, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { id: "developer", name: "Developer", icon: Code2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { id: "downloader", name: "Downloader", icon: Download, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20" },
    { id: "seo", name: "SEO / Web", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { id: "calculators", name: "Calculator", icon: Calculator, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { id: "general", name: "General", icon: LayoutGrid, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-900/20" },
  ];

  const categoryToolCounts = displayCategories.map(cat => ({
    ...cat,
    count: TOOLS_REGISTRY.filter(t => t.category === cat.id).length
  }));

  const getToolCategoryStyle = (categoryId: string) => {
    switch (categoryId) {
      case "image": return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400";
      case "pdf": return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
      case "text": return "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400";
      case "developer": return "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400";
      case "downloader": return "text-pink-600 bg-pink-50 dark:bg-pink-900/20 dark:text-pink-400";
      case "seo": return "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400";
      case "calculators": return "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400";
      default: return "text-slate-600 bg-slate-50 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  const getToolIcon = (categoryId: string) => {
    switch (categoryId) {
      case "image": return <ImageIcon size={20} className="text-blue-500 md:w-6 md:h-6" />;
      case "pdf": return <FileText size={20} className="text-red-500 md:w-6 md:h-6" />;
      case "text": return <Type size={20} className="text-purple-500 md:w-6 md:h-6" />;
      case "developer": return <Code2 size={20} className="text-green-500 md:w-6 md:h-6" />;
      case "downloader": return <Download size={20} className="text-pink-500 md:w-6 md:h-6" />;
      case "seo": return <TrendingUp size={20} className="text-orange-500 md:w-6 md:h-6" />;
      case "calculators": return <Calculator size={20} className="text-indigo-500 md:w-6 md:h-6" />;
      default: return <LayoutGrid size={20} className="text-slate-500 md:w-6 md:h-6" />;
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center pb-16 md:pb-24 overflow-x-hidden bg-transparent">

      <div className="w-full relative px-4 md:px-margin-desktop py-12 md:py-0 text-center flex flex-col items-center justify-center overflow-hidden min-h-[calc(100vh-80px)]">

        {/* Floating Icons — hidden on mobile, visible on lg+ */}
        <FloatingIcon delay={0} yOffset={20} duration={6} className="absolute top-10 left-[15%] w-16 h-16 bg-surface rounded-2xl flex items-center justify-center rotate-[-12deg] shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-0 hidden lg:flex border border-black/5">
          <ImageIcon size={28} className="text-[#A855F7]" />
        </FloatingIcon>
        <FloatingIcon delay={1} yOffset={15} duration={5} className="absolute top-40 left-[10%] w-14 h-14 bg-surface rounded-2xl flex items-center justify-center rotate-[15deg] shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-0 hidden lg:flex border border-black/5">
          <FileText size={24} className="text-[#EF4444]" />
        </FloatingIcon>
        <FloatingIcon delay={2} yOffset={25} duration={7} className="absolute top-12 right-[15%] w-14 h-14 bg-surface rounded-2xl flex items-center justify-center rotate-[10deg] shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-0 hidden lg:flex border border-black/5">
          <FileText size={24} className="text-[#3B82F6]" />
        </FloatingIcon>
        <FloatingIcon delay={0.5} yOffset={18} duration={5.5} className="absolute top-36 right-[12%] w-16 h-16 bg-surface rounded-2xl flex items-center justify-center rotate-[-15deg] shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-0 hidden lg:flex border border-black/5">
          <ShieldCheck size={28} className="text-[#22C55E]" />
        </FloatingIcon>

        <div className="relative z-10 flex flex-col items-center w-full max-w-[896px]">

          {/* Top Badge */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-surface border border-[#F5C070] rounded-full px-2.5 py-1 sm:px-4 sm:py-1.5 mb-4 sm:mb-6 shadow-sm">
            <Lock className="w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] text-[#E38827]" />
            <span className="text-[9px] sm:text-[11px] font-bold text-[#E38827] uppercase tracking-wide">
              100% Private • No Uploads • Works Offline
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-[32px] sm:text-[44px] md:text-[56px] lg:text-[72px] leading-[1.1] font-extrabold text-ink tracking-[-0.02em] mb-20 px-2 text-center">
            Fast, Free, <span className="text-[#2E5CFF]">Privacy-First</span> <br className="hidden sm:block" />
            Online Tools
          </h1>

          {/* Subtext */}
          <p className="text-[15px] md:text-[20px] text-[#4B5563] font-medium max-w-[640px] mb-2.5 px-2 leading-relaxed text-center mx-auto">
            Convert, compress, and edit files entirely in your browser.<br className="hidden sm:block" /> No uploads, no servers, zero waiting.
          </p>

          <StaggerContainer className="flex flex-col items-center w-full">
            {/* Search Bar */}
            <StaggerItem className="w-full max-w-[640px] mx-auto mb-2.5 relative px-0">
              <GlobalSearch variant="hero" />
            </StaggerItem>

          {/* 3-Step Sequence */}
          <StaggerItem className="w-full px-2">
            <div className="bg-surface rounded-[20px] md:rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 px-3 md:px-6 py-3 md:py-4 max-w-max mx-auto flex flex-row items-center gap-1.5 md:gap-8">

              <div className="flex items-center gap-1.5 md:gap-3">
                <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#2E5CFF] shrink-0">
                  <Upload size={14} className="md:w-[18px] md:h-[18px]" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-[10px] md:text-[13px] text-ink leading-tight whitespace-nowrap">01 Drop it</div>
                  <div className="hidden sm:block text-[10px] md:text-[12px] text-ink-muted font-medium leading-tight whitespace-nowrap">Select or drop your file</div>
                </div>
              </div>

              {/* Dashes */}
              <div className="text-[#2E5CFF] opacity-30 tracking-widest font-bold text-[8px] md:text-base">---<span className="hidden md:inline">---</span></div>

              <div className="flex items-center gap-1.5 md:gap-3">
                <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#2E5CFF] shrink-0">
                  <Sliders size={14} className="md:w-[18px] md:h-[18px]" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-[10px] md:text-[13px] text-ink leading-tight whitespace-nowrap">02 Process</div>
                  <div className="hidden sm:block text-[10px] md:text-[12px] text-ink-muted font-medium leading-tight whitespace-nowrap">In your browser</div>
                </div>
              </div>

              {/* Dashes */}
              <div className="text-[#2E5CFF] opacity-30 tracking-widest font-bold text-[8px] md:text-base">---<span className="hidden md:inline">---</span></div>

              <div className="flex items-center gap-1.5 md:gap-3">
                <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#2E5CFF] shrink-0">
                  <CheckCircle2 size={14} className="md:w-[18px] md:h-[18px]" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-[10px] md:text-[13px] text-ink leading-tight whitespace-nowrap">03 Done</div>
                  <div className="hidden sm:block text-[10px] md:text-[12px] text-ink-muted font-medium leading-tight whitespace-nowrap">Download instantly</div>
                </div>
              </div>

            </div>
          </StaggerItem>

          {/* Features Box */}
          <StaggerItem className="w-full max-w-[900px] mt-2.5 px-2">
            <div className="bg-surface rounded-[20px] md:rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 p-4 md:px-8 md:py-5 grid grid-cols-2 lg:flex lg:flex-row justify-between gap-y-5 gap-x-3 lg:gap-4 lg:divide-x divide-gray-100">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 w-full lg:w-1/4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#3B82F6] shrink-0">
                  <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <div>
                  <h3 className="font-bold text-ink text-[11px] sm:text-sm mb-0.5">100% Private</h3>
                  <p className="text-[9px] sm:text-xs text-ink-muted font-medium leading-tight">Your files never leave your device.</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 w-full lg:w-1/4 lg:pl-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-[#A855F7] shrink-0">
                  <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <div>
                  <h3 className="font-bold text-ink text-[11px] sm:text-sm mb-0.5">Blazing Fast</h3>
                  <p className="text-[9px] sm:text-xs text-ink-muted font-medium leading-tight">Browser-powered processing.</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 w-full lg:w-1/4 lg:pl-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-[#22C55E] shrink-0">
                  <Users size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <div>
                  <h3 className="font-bold text-ink text-[11px] sm:text-sm mb-0.5">No Sign Up</h3>
                  <p className="text-[9px] sm:text-xs text-ink-muted font-medium leading-tight">No accounts, no emails.</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 w-full lg:w-1/4 lg:pl-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-[#F97316] shrink-0">
                  <Gift size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <div>
                  <h3 className="font-bold text-ink text-[11px] sm:text-sm mb-0.5">Always Free</h3>
                  <p className="text-[9px] sm:text-xs text-ink-muted font-medium leading-tight">Powerful tools at zero cost.</p>
                </div>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
        </div>
      </div>
      {/* ─── Content below hero ─── */}
      <div className="w-full max-w-[1440px] px-4 md:px-margin-desktop mb-16 md:mb-24 mt-8 md:mt-12">

        {/* ── Browse by Category ── */}
        <div className="mb-10 md:mb-24">
          <div className="flex items-center justify-between mb-5 md:mb-8">
            <h2 className="text-xl md:text-[24px] font-bold text-on-surface">Browse by Category</h2>
            <Link href="/tools" className="text-sm font-bold text-primary hover:text-primary-fixed-variant transition-colors flex items-center gap-1 shrink-0 min-h-[44px] flex items-center">
              View all online tools <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile: dense wrap pills. Desktop: 7-col grid */}
          <div className="md:hidden">
            <div className="flex flex-wrap gap-2.5">
              {categoryToolCounts.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.id}
                    href={`/tools/${category.id}`}
                    className="flex items-center gap-2 pr-3 pl-1.5 py-1.5 bg-surface border border-outline-variant rounded-full hover:border-primary hover:bg-surface-container-low transition-all duration-200 shadow-sm active:scale-95"
                  >
                    <div className={`w-8 h-8 rounded-full ${category.bg} ${category.color} flex items-center justify-center shrink-0`}>
                      <Icon size={14} />
                    </div>
                    <span className="font-bold text-on-surface text-[13px] whitespace-nowrap">{category.name}</span>
                    <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded-full ml-0.5">
                      {category.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop: stagger grid */}
          <MagicCardContainer className="hidden md:block">
            <StaggerContainer className="grid grid-cols-4 lg:grid-cols-7 gap-4">
              {categoryToolCounts.map((category) => {
                const Icon = category.icon;
                return (
                  <StaggerItem key={category.id} className="h-full">
                    <MagicCard
                      href={`/tools/${category.id}`}
                      className="flex flex-col items-center justify-center p-6 bg-surface border border-outline-variant rounded-2xl hover:border-primary transition-colors transition-shadow duration-200 shadow-sm hover:shadow-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary h-full"
                    >
                      <div className={`w-14 h-14 rounded-2xl ${category.bg} ${category.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                        <Icon size={28} />
                      </div>
                      <h3 className="font-bold text-on-surface text-sm mb-1">{category.name}</h3>
                      <p className="text-xs text-on-surface-variant font-medium">{category.count} tools</p>
                    </MagicCard>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </MagicCardContainer>
        </div>

        {/* ── Popular Tools ── */}
        <div className="mb-10 md:mb-16">
          <div className="flex items-center justify-between mb-5 md:mb-8">
            <h2 className="text-xl md:text-[24px] font-bold text-on-surface flex items-center gap-2">
              <Sparkles size={20} className="text-primary md:w-6 md:h-6" /> Popular Tools
            </h2>
            <Link href="/tools" className="text-sm font-bold text-primary hover:text-primary-fixed-variant transition-colors flex items-center gap-1 shrink-0 min-h-[44px] flex items-center">
              Browse all popular tools <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile: single-column dense list. md+: 2-col cards. lg+: 3-col cards */}
          <MagicCardContainer>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
              {popularTools.map((tool) => (
                <StaggerItem key={tool.id} className="h-full">
                  <MagicCard
                    href={getToolUrl(tool)}
                    className="flex flex-row md:flex-col items-center md:items-start bg-surface border border-outline-variant rounded-xl md:rounded-2xl p-3 md:p-6 hover:border-primary transition-colors transition-shadow duration-200 shadow-sm hover:shadow-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary relative h-full gap-3 md:gap-0"
                  >
                    {/* Icon — Left on mobile, Top on desktop */}
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-surface-container flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                      {getToolIcon(tool.category)}
                    </div>

                    {/* Content — middle on mobile, bottom on desktop */}
                    <div className="flex flex-col flex-1 min-w-0 md:w-full md:mt-4">
                      <div className="flex items-center justify-between mb-0.5 md:mb-2 gap-2">
                        <h3 className="font-bold text-[14px] md:text-[18px] text-on-surface group-hover:text-primary transition-colors leading-tight truncate">
                          {tool.name}
                        </h3>
                        {/* Desktop only category tag */}
                        <span className={`hidden md:inline-block text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shrink-0 ${getToolCategoryStyle(tool.category)}`}>
                          {tool.category === 'seo' ? 'SEO' : tool.category}
                        </span>
                      </div>
                      {/* 1 line on mobile, 2 lines on desktop */}
                      <p className="text-[12px] md:text-sm text-on-surface-variant line-clamp-1 md:line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    {/* Mobile-only arrow */}
                    <div className="md:hidden shrink-0 text-outline-variant group-hover:text-primary transition-colors ml-1">
                      <ArrowRight size={18} />
                    </div>

                    {/* Desktop-only CTA */}
                    <div className="hidden md:flex mt-6 text-sm font-bold text-primary items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Use tool <ArrowRight size={16} />
                    </div>
                  </MagicCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </MagicCardContainer>

          {/* CTA button — full width on mobile */}
          <div className="flex justify-center">
            <Link href="/tools" className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 md:py-3.5 bg-primary hover:bg-primary-fixed-variant text-white font-bold rounded-full transition-colors shadow-lg shadow-primary/25 text-base min-h-[48px]">
            Discover all {TOOLS_REGISTRY.length} free utilities <ArrowRight size={18} className="ml-2" />
          </Link>
          </div>
        </div>

        {/* ── Stats Bar: 2×2 on mobile, 4-col on lg ── */}
        <ScrollReveal delay={0.2} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 py-8 md:py-10 border-t border-outline-variant/60 mb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-on-surface text-lg md:text-xl mb-0.5">100%</h3>
              <p className="font-bold text-xs md:text-sm text-on-surface mb-0.5">Private & Secure</p>
              <p className="text-[10px] md:text-xs text-on-surface-variant hidden sm:block">Files never leave your device</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shrink-0">
              <Rocket size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-on-surface text-lg md:text-xl mb-0.5">0s</h3>
              <p className="font-bold text-xs md:text-sm text-on-surface mb-0.5">Instant Processing</p>
              <p className="text-[10px] md:text-xs text-on-surface-variant hidden sm:block">No waiting at all</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shrink-0">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-on-surface text-lg md:text-xl mb-0.5">{TOOLS_REGISTRY.length}+</h3>
              <p className="font-bold text-xs md:text-sm text-on-surface mb-0.5">Powerful Tools</p>
              <p className="text-[10px] md:text-xs text-on-surface-variant hidden sm:block">All in one place</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 shrink-0">
              <Heart size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-on-surface text-lg md:text-xl mb-0.5">Free</h3>
              <p className="font-bold text-xs md:text-sm text-on-surface mb-0.5">Forever Free</p>
              <p className="text-[10px] md:text-xs text-on-surface-variant hidden sm:block">All features, zero cost</p>
            </div>
          </div>
        </ScrollReveal>

      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to convert or compress a file entirely in your browser",
            "description": "Convert, compress, and edit files entirely in your browser securely and instantly with zero uploads.",
            "step": [
              {
                "@type": "HowToStep",
                "position": 1,
                "name": "Drop it",
                "text": "Drag and drop your file into the tool area."
              },
              {
                "@type": "HowToStep",
                "position": 2,
                "name": "It processes",
                "text": "Your browser processes the file locally using WebAssembly and Web Workers. The file never leaves your device."
              },
              {
                "@type": "HowToStep",
                "position": 3,
                "name": "Done",
                "text": "Instantly download your converted or compressed file."
              }
            ]
          }),
        }}
      />
    </div>
  );
}
