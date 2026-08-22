# SEO Changelog

This document tracks all URL changes, file modifications, and SEO adjustments made to the site.

## 2026-08-20
- Created `SEO_AUDIT.md` (Phase 1).
- Generated Phase 3 Implementation Plan for user review.
- **Phase 4 (Technical):**
  - Added `Organization` schema to `app/layout.tsx`.
  - Added visual breadcrumbs to tool pages (`app/tools/[category]/[slug]/page.tsx`).
  - Removed duplicate Schema generation from `page.tsx` since `layout.tsx` handles it.
  - Added Security Headers (HSTS, CSP, X-Frame-Options) to `next.config.ts`.
- **Phase 5 (Content):**
  - Verified MDX content exists for tools under `content/tools/`.
- **Phase 6 & 7:**
  - `about` page verified to have acceptable E-E-A-T baseline.
  - Security headers added.
