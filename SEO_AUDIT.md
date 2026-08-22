# SEO Audit - clustertools.online

**Date:** 2026-08-20

## 🔴 Critical (Blocking Indexing/Ranking)
- **None detected.** The site has a basic `robots.ts` and `sitemap.ts` configured, and metadata base is set correctly in `app/layout.tsx`.

## 🟠 High Priority
- **Duplicate/Canonical Variants:** The Next.js setup appears standard, but there is no explicit redirect from `www` to non-`www` (or vice versa) enforced at the application level. It's relying on the hosting provider (like Vercel) for domain canonicalization.
- **Missing Core Structured Data:** While `WebSite` schema exists in `app/layout.tsx` and `HowTo` schema in `app/page.tsx`, we are missing `Organization` schema and `BreadcrumbList` schema across the site. Tool pages need specific `SoftwareApplication` or `WebApplication` schema.
- **Thin Content / Orphan Pages:** Needs to be verified across all `/tools/[category]/[slug]` pages. Tool pages often suffer from thin content if they just display an interface without explaining what the tool does, how it works, and why it's secure.

## 🟡 Medium Priority
- **Metadata Uniqueness:** The global `layout.tsx` defines a good default title and description, but individual tool pages must override these with highly specific titles (e.g., "Free PDF to JPG Converter | Cluster Tools") and descriptions.
- **Internal Linking & Silo Structure:** The homepage links to categories and tools, but we need to ensure breadcrumbs are implemented on every tool page to link back to its parent category.
- **H1 Hierarchy:** Need to ensure every tool page has exactly one `<h1>` that describes the tool clearly.

## 🟢 Low Priority
- **Core Web Vitals:** The site is using Next.js and Tailwind, which generally performs well. However, we must ensure any heavy processing (WebAssembly/Workers for the tools) doesn't block the main thread and impact INP.
- **Image Optimization:** Ensure any illustrative images or icons use SVGs or optimized WebP/AVIF formats (currently using Lucide React icons, which are inline SVGs and very fast).
