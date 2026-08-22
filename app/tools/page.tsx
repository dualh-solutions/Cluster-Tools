import { TOOLS_REGISTRY, getToolUrl } from "@/lib/tools/registry";
import { CATEGORIES } from "@/lib/tools/categories";
import Link from "next/link";
import { Metadata } from "next";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { MagicCardContainer, MagicCard } from "@/components/animations/MagicCard";
import { FloatingIcon } from "@/components/animations/FloatingIcon";
import { 
  LayoutGrid, ArrowRight, ImageIcon, ShieldCheck, 
  Minimize, Crop, FileImage, ImagePlus, Maximize,
  ArrowDownToLine, Combine, SplitSquareHorizontal, RotateCw, FileOutput, FileMinus, Hash, FileSearch,
  Percent, CalendarDays, Landmark, Home, Tag, TrendingUp, LineChart, BadgeDollarSign,
  WholeWord, CaseSensitive, ListX, FileDiff, Braces, ShieldCheck as ShieldCheckIcon, Minimize2, Calculator, Type, Code2, FileText, File
} from "lucide-react";

export const metadata: Metadata = {
  title: "All Online Tools | Cluster Tools",
  description: "Browse our complete collection of free, private, browser-based tools for images, PDFs, text, and more.",
};

const getSpecificToolIcon = (slug: string, fallback: any) => {
  switch (slug) {
    case "image-compressor": return Minimize;
    case "image-cropper": return Crop;
    case "jpg-to-pdf": return FileImage;
    case "jpg-to-png": return File;
    case "png-to-jpg": return File;
    case "png-to-webp": return File;
    case "jpg-to-webp": return File;
    case "webp-to-jpg": return File;
    case "heic-to-jpg": return File;
    case "image-to-pdf": return ImagePlus;
    case "pdf-to-jpg": return ImagePlus;
    case "image-resizer": return Maximize;
    case "compress-pdf": return ArrowDownToLine;
    case "merge-pdf": return Combine;
    case "split-pdf": return SplitSquareHorizontal;
    case "rotate-pdf": return RotateCw;
    case "extract-pdf-pages": return FileOutput;
    case "delete-pdf-pages": return FileMinus;
    case "pdf-page-counter": return Hash;
    case "pdf-metadata-viewer": return FileSearch;
    case "percentage-calculator": return Percent;
    case "age-calculator": return CalendarDays;
    case "loan-calculator": return Landmark;
    case "mortgage-calculator": return Home;
    case "discount-calculator": return Tag;
    case "compound-interest-calculator": return TrendingUp;
    case "roi-calculator": return LineChart;
    case "profit-margin-calculator": return BadgeDollarSign;
    case "word-counter": return WholeWord;
    case "character-counter": return Type;
    case "case-converter": return CaseSensitive;
    case "remove-duplicate-lines": return ListX;
    case "text-diff-checker": return FileDiff;
    case "json-formatter": return Braces;
    case "json-validator": return ShieldCheckIcon;
    case "json-minifier": return Minimize2;
    default: return fallback;
  }
};

const getToolColorStyle = (slug: string) => {
  const styles = [
    "bg-blue-50 text-[#3B82F6]",
    "bg-green-50 text-[#22C55E]",
    "bg-orange-50 text-[#F97316]",
    "bg-yellow-50 text-[#EAB308]",
    "bg-pink-50 text-[#EC4899]",
    "bg-cyan-50 text-[#06B6D4]",
    "bg-purple-50 text-[#A855F7]",
    "bg-teal-50 text-[#14B8A6]",
    "bg-indigo-50 text-[#6366F1]",
    "bg-red-50 text-[#EF4444]",
  ];
  // Simple hash for consistent colors based on slug length and characters
  const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Hardcode the ones from the screenshot for exact matching
  if (slug === "image-compressor") return "bg-blue-50 text-[#2E5CFF]";
  if (slug === "image-cropper") return "bg-green-50 text-[#22C55E]";
  if (slug === "jpg-to-png") return "bg-orange-50 text-[#F97316]";
  if (slug === "png-to-jpg") return "bg-yellow-50 text-[#EAB308]";
  if (slug === "image-resizer") return "bg-pink-50 text-[#EC4899]";
  if (slug === "webp-to-jpg") return "bg-cyan-50 text-[#06B6D4]";
  if (slug === "heic-to-jpg") return "bg-purple-50 text-[#A855F7]";
  if (slug === "png-to-webp") return "bg-teal-50 text-[#14B8A6]";
  if (slug === "jpg-to-webp") return "bg-indigo-50 text-[#6366F1]";

  return styles[hash % styles.length];
};

const getCategoryIcon = (id: string) => {
  switch (id) {
    case "image": return ImageIcon;
    case "pdf": return FileText;
    case "calculators": return Calculator;
    case "text": return Type;
    case "developer": return Code2;
    default: return LayoutGrid;
  }
};

const getCategoryColor = (id: string) => {
  switch (id) {
    case "image": return "bg-blue-50 text-[#2E5CFF]";
    case "pdf": return "bg-red-50 text-[#EF4444]";
    case "calculators": return "bg-indigo-50 text-[#6366F1]";
    case "text": return "bg-purple-50 text-[#A855F7]";
    case "developer": return "bg-green-50 text-[#22C55E]";
    default: return "bg-blue-50 text-[#2E5CFF]";
  }
};

export default function AllToolsPage() {
  return (
    <div className="w-full flex-1 flex flex-col bg-transparent overflow-x-hidden min-h-screen">
      
      {/* ─── Hero Section ─── */}
      <div className="w-full relative px-6 md:px-10 lg:px-20 pt-16 pb-12 overflow-hidden flex flex-col max-w-[1440px] mx-auto">
        
        {/* Floating Icons Background Right */}
        <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-50/50 to-purple-50/50 rounded-full blur-[80px] -z-10 opacity-70"></div>
          
          <FloatingIcon delay={0} yOffset={15} duration={6} className="absolute top-20 left-[20%] w-16 h-16 bg-surface rounded-[20px] flex items-center justify-center rotate-[-8deg] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/5 z-0">
            <ImageIcon size={30} className="text-[#A855F7]" />
          </FloatingIcon>
          <FloatingIcon delay={1.5} yOffset={20} duration={5} className="absolute top-44 right-[20%] w-14 h-14 bg-surface rounded-[16px] flex items-center justify-center rotate-[12deg] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/5 z-0">
            <ShieldCheck size={26} className="text-[#22C55E]" />
          </FloatingIcon>
          
          {/* Sparkles / Stars */}
          <div className="absolute top-16 right-[40%] text-yellow-200">✨</div>
          <div className="absolute top-36 left-[10%] text-blue-200 text-sm">✦</div>
          <div className="absolute top-64 right-[30%] text-purple-200 text-xl">✨</div>
        </div>

        <StaggerContainer className="relative z-10 flex items-start gap-5 max-w-[800px]">
          <StaggerItem>
            <div className="w-14 h-14 rounded-[18px] bg-blue-50 flex items-center justify-center text-[#2E5CFF] shrink-0 mt-1 shadow-sm">
              <LayoutGrid size={28} />
            </div>
          </StaggerItem>
          <StaggerItem>
            <h1 className="text-[36px] md:text-[48px] leading-[1.1] font-extrabold text-ink tracking-tight mb-3">
              All Tools
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#4B5563] font-medium leading-relaxed max-w-[560px]">
              Browse our complete collection of fast, private, and free online tools.<br className="hidden md:block"/>
              Every tool processes your files locally in your browser.
            </p>
          </StaggerItem>
        </StaggerContainer>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 pb-24 space-y-20">
        {CATEGORIES.map(category => {
          const categoryTools = TOOLS_REGISTRY.filter(t => t.category === category.id);
          
          if (categoryTools.length === 0) return null;

          const CategoryIcon = getCategoryIcon(category.id);
          const categoryColorStyle = getCategoryColor(category.id);

          return (
            <div key={category.id} className="scroll-mt-24 relative z-10" id={category.slug}>
              
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/5 pb-4 mb-8 gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 ${categoryColorStyle}`}>
                    <CategoryIcon size={24} />
                  </div>
                  <div>
                    <h2 className="text-[20px] font-bold text-ink flex items-center gap-2">
                      <Link href={`/tools/${category.slug}`} className="hover:text-[#2E5CFF] transition-colors">
                        {category.name}
                      </Link>
                    </h2>
                    <p className="text-[14px] text-gray-500 font-medium mt-0.5">{category.description}</p>
                  </div>
                </div>
                <Link 
                  href={`/tools/${category.slug}`}
                  className="hidden md:flex items-center text-[14px] font-bold text-[#2E5CFF] hover:text-blue-700 transition-colors"
                >
                  View all {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'} <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>

              {/* Mobile: dense wrap pills */}
              <div className="md:hidden mb-6">
                <div className="flex flex-wrap gap-2.5">
                  {categoryTools.map(tool => (
                    <Link
                      key={tool.id}
                      href={getToolUrl(tool)}
                      className="flex items-center gap-2 px-3.5 py-2 bg-surface border border-black/5 shadow-sm rounded-full hover:border-[#2E5CFF]/30 transition-all active:scale-95"
                    >
                      <span className="font-bold text-ink text-[13px] whitespace-nowrap">{tool.name}</span>
                      {tool.popular && (
                        <span className="text-[10px] font-bold text-[#2E5CFF] bg-blue-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                          Popular
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Desktop: Stagger Grid */}
              <MagicCardContainer className="hidden md:block">
                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTools.map(tool => {
                    const ToolIcon = getSpecificToolIcon(tool.slug, CategoryIcon);
                    const toolColorStyle = getToolColorStyle(tool.slug);
                    
                    return (
                      <StaggerItem key={tool.id} className="h-full">
                        <MagicCard
                          href={getToolUrl(tool)}
                          className="flex items-start bg-surface border border-black/5 rounded-[24px] p-6 hover:border-[#2E5CFF]/30 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group h-full gap-5 relative overflow-hidden"
                        >
                          <div className={`w-14 h-14 rounded-[18px] flex flex-col items-center justify-center shrink-0 shadow-sm ${toolColorStyle}`}>
                            {["png-to-jpg", "jpg-to-png", "webp-to-jpg", "heic-to-jpg", "png-to-webp", "jpg-to-webp"].includes(tool.slug) ? (
                              <div className="relative flex items-center justify-center">
                                <ToolIcon size={26} strokeWidth={2} />
                                <span className="absolute mt-1 font-bold text-[8.5px] tracking-wider leading-none">
                                  {tool.slug === "png-to-jpg" ? "PNG" : 
                                   tool.slug === "jpg-to-png" ? "JPG" : 
                                   tool.slug === "webp-to-jpg" ? "WebP" : 
                                   tool.slug === "heic-to-jpg" ? "HEIC" : 
                                   tool.slug === "png-to-webp" ? "PNG" : 
                                   tool.slug === "jpg-to-webp" ? "JPG" : ""}
                                </span>
                              </div>
                            ) : (
                              <ToolIcon size={24} />
                            )}
                          </div>
                          
                          <div className="flex flex-col flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h3 className="font-bold text-[16px] text-ink group-hover:text-[#2E5CFF] transition-colors truncate">
                                {tool.name}
                              </h3>
                              {tool.popular && (
                                <span className="text-[10px] font-bold text-[#2E5CFF] bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium leading-[1.5] line-clamp-2">
                              {tool.description}
                            </p>
                            
                            <div className="absolute bottom-6 right-6 text-gray-300 group-hover:text-[#2E5CFF] transition-colors duration-300">
                              <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </div>
                        </MagicCard>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              </MagicCardContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}
