"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Hexagon, X } from "lucide-react";
import { GlobalSearch } from "./GlobalSearch";
import { ThemeToggle } from "@/components/ThemeToggle";

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
      <header className="bg-surface/80 backdrop-blur-md border-b border-outline-variant docked full-width top-0 sticky z-50">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 max-w-[1440px] mx-auto">
          <div className="flex flex-1 items-center gap-md">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="text-secondary hover:text-primary transition-colors cursor-pointer active:opacity-70 flex items-center md:hidden" 
              aria-label="Open Menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="font-h2 text-h2 font-extrabold text-primary flex items-center gap-2 active:opacity-70 z-50">
              <div className="relative flex items-center justify-center">
                <Hexagon className="text-primary fill-primary/20" size={28} />
                <div className="absolute w-2 h-2 bg-primary rounded-full"></div>
              </div>
              Pressto
            </Link>
          </div>
          
          <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-[32px]">
            <Link href="/" className={`${isHome ? "text-primary font-bold border-b-2 border-primary" : "text-on-surface-variant hover:text-primary font-medium border-b-2 border-transparent hover:border-primary/50"} py-[20px] transition-colors cursor-pointer active:opacity-70 text-body-sm font-body-sm`}>Home</Link>
            <Link href="/tools" className={`${isTools ? "text-primary font-bold border-b-2 border-primary" : "text-on-surface-variant hover:text-primary font-medium border-b-2 border-transparent hover:border-primary/50"} py-[20px] transition-colors cursor-pointer active:opacity-70 text-body-sm font-body-sm`}>Tools</Link>
            <Link href="/about" className={`${isAbout ? "text-primary font-bold border-b-2 border-primary" : "text-on-surface-variant hover:text-primary font-medium border-b-2 border-transparent hover:border-primary/50"} py-[20px] transition-colors cursor-pointer active:opacity-70 text-body-sm font-body-sm`}>About</Link>
          </nav>
          
          <div className="flex flex-1 justify-end items-center gap-md">
            {!isHome && <GlobalSearch variant="header" />}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div 
            className="fixed inset-0 bg-on-background/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-64 max-w-[80vw] bg-surface border-r border-outline-variant shadow-2xl flex flex-col animate-in slide-in-from-left-full duration-200">
            <div className="flex items-center justify-between p-md border-b border-outline-variant">
              <span className="font-bold text-h3 text-on-surface">Menu</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full"
                aria-label="Close Menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col flex-1 p-sm gap-1 overflow-y-auto">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-md py-sm rounded-lg text-body-lg font-medium transition-colors ${isHome ? "text-primary bg-primary/10" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"}`}
              >
                Home
              </Link>
              <Link 
                href="/tools" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-md py-sm rounded-lg text-body-lg font-medium transition-colors ${isTools ? "text-primary bg-primary/10" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"}`}
              >
                Tools
              </Link>
              <Link 
                href="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-md py-sm rounded-lg text-body-lg font-medium transition-colors ${isAbout ? "text-primary bg-primary/10" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"}`}
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
