"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { TOOLS_REGISTRY } from "@/lib/tools/registry";
import { 
  LayoutGrid, ChevronDown,
  Image as ImageIcon, FileText, Type, Code2, Calculator, ArrowRight,
  Minimize, Crop, FileImage, ImagePlus, Maximize,
  ArrowDownToLine, Combine, SplitSquareHorizontal, RotateCw, FileOutput, FileMinus, Hash, FileSearch,
  Percent, CalendarDays, Landmark, Home, Tag, TrendingUp, LineChart, BadgeDollarSign,
  WholeWord, CaseSensitive, ListX, FileDiff, Braces, ShieldCheck, Minimize2, Download
} from "lucide-react";

const CATEGORIES = [
  { id: "pdf", name: "PDF", icon: FileText, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  { id: "image", name: "Image", icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "calculators", name: "Calculators", icon: Calculator, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  { id: "text", name: "Text", icon: Type, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { id: "developer", name: "Developer", icon: Code2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },

];

const getSpecificToolIcon = (slug: string, fallback: any) => {
  switch (slug) {
    case "image-compressor": return Minimize;
    case "image-cropper": return Crop;
    case "jpg-to-pdf": return FileImage;
    case "jpg-to-png": return FileImage;
    case "png-to-jpg": return FileImage;
    case "png-to-webp": return FileImage;
    case "jpg-to-webp": return FileImage;
    case "webp-to-jpg": return FileImage;
    case "heic-to-jpg": return FileImage;
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
    case "json-validator": return ShieldCheck;
    case "json-minifier": return Minimize2;

    default: return fallback;
  }
};

export function ToolsMegaMenu({ isActive }: { isActive: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // Close menu on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div 
      className="relative flex items-center h-full group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link 
        href="/tools" 
        onClick={() => setIsOpen(false)}
        className={`${isActive ? "bg-[#2E5CFF]/10 text-[#2E5CFF] font-semibold" : "text-gray-600 hover:bg-gray-50 font-medium"} flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors cursor-pointer active:opacity-70 text-[15px]`}
      >
        <LayoutGrid size={18} className={isActive ? "text-[#2E5CFF]" : "text-gray-500"} /> Tools <ChevronDown size={14} className={`ml-0.5 transition-transform duration-200 opacity-70 ${isOpen ? "rotate-180" : ""}`} />
      </Link>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div className="fixed top-[96px] left-1/2 -translate-x-1/2 w-[95vw] lg:w-[1150px] xl:w-[1300px] bg-surface border border-outline-variant shadow-2xl rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-[100] cursor-default flex flex-col max-h-[85vh]">
          
          <div className="p-6 lg:p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 overflow-y-auto overflow-x-hidden">
            {CATEGORIES.map((cat) => {
              const categoryTools = TOOLS_REGISTRY.filter(t => t.category === cat.id);
              const Icon = cat.icon;
              
              return (
                <div key={cat.id} className="flex flex-col">
                  {/* Column Header */}
                  <div className="flex items-center gap-2.5 mb-5 border-b border-outline-variant pb-3">
                    <div className={`w-8 h-8 rounded-md ${cat.bg} ${cat.color} flex items-center justify-center shrink-0`}>
                      <Icon size={18} />
                    </div>
                    <span className="font-bold text-sm uppercase tracking-wider text-on-surface-variant">
                      {cat.name}
                    </span>
                  </div>
                  
                  {/* Tool Links */}
                  <div className="flex flex-col gap-1">
                    {categoryTools.map(tool => {
                      const SpecificIcon = getSpecificToolIcon(tool.slug, Icon);
                      return (
                        <Link 
                          key={tool.id}
                          href={`/tools/${tool.category}/${tool.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 -mx-3 rounded-lg hover:bg-surface-container-low hover:text-primary text-[15px] font-medium text-on-surface transition-colors group/link"
                        >
                          <SpecificIcon size={16} className={`${cat.color} opacity-70 group-hover/link:opacity-100 shrink-0`} />
                          <span className="truncate leading-tight" title={tool.name}>{tool.shortName || tool.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar */}
          <div className="bg-surface-container-lowest border-t border-outline-variant p-4 flex justify-center shrink-0">
            <Link 
              href="/tools" 
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-fixed-variant transition-colors"
            >
              View complete tools directory <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
