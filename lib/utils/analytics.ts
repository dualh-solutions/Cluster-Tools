/**
 * Simple, lightweight analytics abstraction for Pressto.
 * Currently provider-agnostic. Can be wired up to Vercel Analytics or PostHog later.
 * 
 * Privacy constraints:
 * - DO NOT send uploaded files
 * - DO NOT send file contents
 * - DO NOT send document text
 * - DO NOT send image data
 * - DO NOT send unnecessary personal information
 */

type EventName = 
  | 'tool_view' 
  | 'tool_started' 
  | 'file_selected' 
  | 'processing_started' 
  | 'processing_completed' 
  | 'download_clicked' 
  | 'processing_error' 
  | 'tool_favorite' 
  | 'tool_search';

export function trackEvent(eventName: EventName, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  
  // Safe default: only log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, properties);
  }

  // TODO: Connect to Vercel Analytics / PostHog in the future here
  // e.g. window.va('track', eventName, properties);
}
