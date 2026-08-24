"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Hexagon, X, Home, Info, LayoutGrid, ChevronDown, Moon } from "lucide-react";
import { GlobalSearch } from "./GlobalSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ToolsMegaMenu } from "./ToolsMegaMenu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isTools = pathname?.startsWith("/tools");
  const isAbout = pathname?.startsWith("/about");
  const isHome = !isTools && !isAbout;

  // Close menu on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <div className="sticky top-0 pt-[5px] z-50 w-full px-4 md:px-6 pointer-events-none">
        <header className="relative bg-surface/80 dark:bg-surface/90 backdrop-blur-xl border border-black/5 dark:border-outline-variant shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[28px] h-[72px] w-full max-w-[1440px] mx-auto flex justify-between items-center px-4 md:px-6 pointer-events-auto gap-2 md:gap-4 mt-2 md:mt-0">
          <div className="flex flex-1 items-center gap-2 md:gap-4 min-w-0">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ink-muted hover:text-primary transition-colors cursor-pointer active:opacity-70 md:hidden shrink-0" 
              aria-label="Open Menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0 md:left-auto md:top-auto font-sans tracking-[-0.02em] text-[22px] sm:text-2xl font-extrabold text-[#2E5CFF] flex items-center gap-2 sm:gap-2.5 active:opacity-70 z-50 shrink-0 min-w-0">
              <div className="relative flex items-center justify-center shrink-0">
                <Hexagon className="text-[#2E5CFF]" size={34} strokeWidth={2.5} />
                <div className="absolute w-[8px] h-[8px] bg-[#2E5CFF] rounded-full"></div>
              </div>
              <span className="truncate">Cluster<span className="hidden sm:inline"> Tools</span></span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center justify-center gap-1 h-full shrink-0">
            <Link href="/" className={`${isHome ? "bg-[#2E5CFF]/10 text-[#2E5CFF] font-semibold" : "text-ink-muted hover:bg-surface-hover font-medium"} flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors cursor-pointer active:opacity-70 text-[15px]`}>
              <Home size={18} className={isHome ? "text-[#2E5CFF]" : "text-ink-muted"} /> Home
            </Link>
            
            <ToolsMegaMenu isActive={isTools} />

            <Link href="/about" className={`${isAbout ? "bg-[#2E5CFF]/10 text-[#2E5CFF] font-semibold" : "text-ink-muted hover:bg-surface-hover font-medium"} flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors cursor-pointer active:opacity-70 text-[15px]`}>
              <Info size={18} className={isAbout ? "text-[#2E5CFF]" : "text-ink-muted"} /> About
            </Link>
          </nav>
          
          <div className="flex flex-1 justify-end items-center gap-2 md:gap-4 min-w-0">
            {!isHome && <GlobalSearch variant="header" />}
            <div className="w-11 h-11 rounded-full bg-surface dark:bg-surface-container flex items-center justify-center border border-black/5 shadow-sm text-ink-muted hover:text-ink transition-colors cursor-pointer">
              <ThemeToggle />
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-64 max-w-[80vw] bg-surface border-r border-black/5 shadow-2xl flex flex-col animate-in slide-in-from-left-full duration-200">
            <div className="flex items-center justify-between p-4 border-b border-black/5">
              <span className="font-bold text-xl text-ink">Menu</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-ink-muted hover:text-ink transition-colors rounded-full"
                aria-label="Close Menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col flex-1 p-2 gap-1 overflow-y-auto">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${isHome ? "text-[#2E5CFF] bg-[#2E5CFF]/10" : "text-ink-muted hover:text-ink hover:bg-gray-50"}`}
              >
                Home
              </Link>
              <Link 
                href="/tools" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${isTools ? "text-[#2E5CFF] bg-[#2E5CFF]/10" : "text-ink-muted hover:text-ink hover:bg-gray-50"}`}
              >
                Tools
              </Link>
              <Link 
                href="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${isAbout ? "text-[#2E5CFF] bg-[#2E5CFF]/10" : "text-ink-muted hover:text-ink hover:bg-gray-50"}`}
              >
                About
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

