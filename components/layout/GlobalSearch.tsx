"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Command } from "lucide-react";
import { TOOLS_REGISTRY } from "@/lib/tools/registry";
import { getToolUrl } from "@/lib/tools/registry";
import { trackEvent } from "@/lib/utils/analytics";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function GlobalSearch({ variant = "header" }: { variant?: "header" | "hero" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Filter tools based on query
  const searchResults = query.trim() === "" 
    ? [] 
    : TOOLS_REGISTRY.filter((tool) => {
        const q = query.toLowerCase();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.shortName.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) ||
          tool.keywords.some(k => k.toLowerCase().includes(q)) ||
          tool.tags?.some(t => t.toLowerCase().includes(q))
        );
      }).slice(0, 8); // Sensible limit

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      // Close on Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      const timeoutId = setTimeout(() => {
        setQuery("");
        setSelectedIndex(0);
      }, 0);
      trackEvent('tool_search', { action: 'opened' });
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // Handle keyboard navigation within the results
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedTool = searchResults[selectedIndex];
      if (selectedTool) {
        trackEvent('tool_search', { action: 'selected', toolId: selectedTool.id, query });
        router.push(getToolUrl(selectedTool));
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      {variant === "hero" ? (
        <div 
          onClick={() => setIsOpen(true)}
          className="w-full max-w-[640px] mx-auto group cursor-text"
        >
          <div className="flex items-center bg-surface border border-black/5 rounded-full px-5 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <Search size={22} className="text-ink-muted/70 mr-3 shrink-0" />
            <input 
              type="text" 
              placeholder={`Search 48+ tools...`}
              className="flex-grow bg-transparent border-none outline-none text-[16px] text-ink placeholder:text-ink-muted/70 font-medium p-0 cursor-pointer w-full min-w-0"
              readOnly
              style={{ fontSize: '16px' }}
            />
            {/* Hide ⌘K badge on mobile — irrelevant on touch devices */}
            <div className="hidden md:flex items-center gap-1 ml-4 shrink-0">
              <span className="border border-gray-200 rounded-[6px] px-2 py-1 text-xs bg-surface text-ink-muted font-semibold shadow-sm">⌘</span>
              <span className="border border-gray-200 rounded-[6px] px-2 py-1 text-xs bg-surface text-ink-muted font-semibold shadow-sm">K</span>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center md:justify-start gap-2 w-10 h-10 md:w-64 md:h-auto md:px-md md:py-sm text-label-md font-label-md text-on-surface-variant bg-surface hover:bg-surface-container-low border border-outline-variant rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
          aria-label="Search tools"
        >
          <Search size={18} />
          <span className="hidden md:block flex-1 text-left">Search tools...</span>
          <span className="hidden md:flex items-center gap-0.5 bg-gray-100 text-ink-muted rounded-md px-1.5 py-0.5 text-[11px] font-semibold border border-gray-200 shadow-sm opacity-80">
            <Command size={12} />K
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-on-background/20 backdrop-blur-sm">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-[576px] bg-surface border border-outline-variant rounded-3xl ambient-shadow overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center px-lg py-md border-b border-outline-variant gap-3">
              <Search size={20} className="text-primary" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search tools, formats, or categories..."
                className="flex-1 bg-transparent border-none outline-none text-on-surface font-body-md placeholder:text-on-surface-variant"
              />
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface transition-colors rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-sm">
              {query.trim() === "" ? (
                <div className="p-8 text-center text-body-sm font-body-sm text-on-surface-variant">
                  Type to search for over 50+ tools including PDF converters, Image compressors, and more.
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-body-sm font-body-sm text-on-surface-variant">
                  No tools found for &quot;{query}&quot;. Try searching for a format like &quot;PDF&quot; or &quot;JPG&quot;.
                </div>
              ) : (
                <ul className="flex flex-col gap-1">
                  {searchResults.map((tool, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <li key={tool.id}>
                        <Link
                          href={getToolUrl(tool)}
                          onClick={() => {
                            trackEvent('tool_search', { action: 'selected', toolId: tool.id, query });
                            setIsOpen(false);
                          }}
                          className={`flex flex-col px-md py-sm rounded-2xl transition-colors ${
                            isSelected ? "bg-surface-variant" : "hover:bg-surface-container-low"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-label-md text-label-md text-on-surface flex items-center gap-2">
                              {tool.name}
                              {tool.isNew && (
                                <span className="text-metadata font-metadata font-bold uppercase tracking-wider bg-primary-container text-on-primary-container px-2 py-0.5 rounded-sm">New</span>
                              )}
                            </span>
                            <span className="text-metadata font-metadata text-secondary uppercase">{tool.category}</span>
                          </div>
                          <span className="text-body-sm font-body-sm text-on-surface-variant line-clamp-1">{tool.description}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
