"use client";

import React, { useState, useEffect } from 'react';
import { Link2, Check, MessageCircle } from 'lucide-react';

export function SocialShare({ title }: { title?: string }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const shareTitle = title || "Check out this free tool from Cluster Tools!";
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(shareTitle);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy');
    }
  };

  // Only render on client to avoid hydration mismatch with window.location
  if (!url) return null;

  return (
    <div className="flex items-center gap-3 pt-4 border-t border-border mt-4 w-full justify-center sm:justify-start">
      <span className="text-[13px] font-bold text-ink-muted">Share this tool:</span>
      <div className="flex items-center gap-2">
        <a 
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-ink-muted hover:text-[#1DA1F2] hover:bg-surface-hover transition-colors"
          aria-label="Share on Twitter/X"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
        </a>
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-ink-muted hover:text-[#4267B2] hover:bg-surface-hover transition-colors"
          aria-label="Share on Facebook"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        </a>
        <a 
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-ink-muted hover:text-[#0A66C2] hover:bg-surface-hover transition-colors"
          aria-label="Share on LinkedIn"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        </a>
        <a 
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-ink-muted hover:text-[#25D366] hover:bg-surface-hover transition-colors"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle size={15} />
        </a>
        <button 
          onClick={handleCopy}
          className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-hover transition-colors"
          aria-label="Copy link"
        >
          {copied ? <Check size={15} className="text-green-500" /> : <Link2 size={15} />}
        </button>
      </div>
    </div>
  );
}
