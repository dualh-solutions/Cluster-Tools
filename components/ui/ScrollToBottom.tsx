"use client";

import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";

export function ScrollToBottom() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Get how far we can scroll in total
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // If we are close to the bottom (within 500px) or if the page isn't scrollable enough, hide the button
      // Also don't show it if we are at the very top (give them a chance to read the first part)
      if (scrollableHeight <= 0 || window.scrollY >= scrollableHeight - 500) {
        setIsVisible(false);
      } else if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false); // Hide at top
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Check initially
    setTimeout(handleScroll, 500); // Wait a bit for layout to settle
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth"
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToBottom}
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 bg-primary text-on-primary rounded-full shadow-lg hover:bg-primary-fixed hover:scale-105 active:scale-95 transition-all duration-300 md:hidden animate-in fade-in zoom-in slide-in-from-bottom-8"
      aria-label="Scroll to bottom"
    >
      <ArrowDown size={24} strokeWidth={2.5} />
    </button>
  );
}
