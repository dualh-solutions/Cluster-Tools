# Implementation Plan: SEO & GEO Improvements

This plan details the technical steps to resolve the high-priority flaws identified in our recent SEO and GEO audits. Our goal is to improve AI citation readiness (GEO) and traditional organic visibility (SEO).

## User Review Required
> [!IMPORTANT]
> Please review this plan. This involves changes to domain canonicalization and global SEO schemas.

## Proposed Changes

---

### Global Next.js & Server Configuration

We need to enforce domain canonicalization (non-www) and explicitly welcome AI crawlers using Next.js route handlers and configuration.

#### [MODIFY] [next.config.ts](file:///C:/Users/LENOVO/Desktop/CLUSTER/next.config.ts)
- Add a redirect in `next.config.ts` from `www.clustertools.online` to `clustertools.online` to prevent duplicate content indexing. *(Note: While a redirect exists in `next.config.ts`, I will verify and ensure it specifically drops `www` for the root and all paths properly).*

#### [MODIFY] [robots.ts](file:///C:/Users/LENOVO/Desktop/CLUSTER/app/robots.ts)
- Update `robots.ts` to explicitly allow AI crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `OAI-SearchBot`) alongside the `*` rule, signaling AI-friendliness.

#### [NEW] [llms.txt route](file:///C:/Users/LENOVO/Desktop/CLUSTER/app/llms.txt/route.ts)
- Create a new API route `app/llms.txt/route.ts` that dynamically generates the `/llms.txt` file (RSL 1.0 standard). It will list the site description and all active tools with their URLs for AI consumption.

---

### Layout & Schema Enhancements

We need to expand our structured data to include Breadcrumbs and Organization/Author details for E-E-A-T signals.

#### [MODIFY] [layout.tsx](file:///C:/Users/LENOVO/Desktop/CLUSTER/app/layout.tsx)
- Enhance the `Organization` schema in the global layout to include more robust trust signals.
- Add an `Author` / `Person` schema to establish credibility.

#### [MODIFY] [page.tsx (Tool Template)](file:///C:/Users/LENOVO/Desktop/CLUSTER/app/tools/%5Bcategory%5D/%5Bslug%5D/page.tsx)
- Inject `BreadcrumbList` JSON-LD schema dynamically based on the tool's category and slug.
- Inject `FAQPage` schema dynamically by parsing FAQs from the `TOOLS_REGISTRY` if they exist.

---

### Content & MDX Enhancements (GEO Optimization)

AI engines favor 134-167 word "citable" passages that directly answer questions ("What is X?").

#### [MODIFY] [registry.ts](file:///C:/Users/LENOVO/Desktop/CLUSTER/lib/tools/registry.ts)
- Update the `ToolDefinition` type and the `TOOLS_REGISTRY` to ensure all tools have a robust `description` and a populated `faqs` array. The FAQs will feed directly into the `FAQPage` schema.

#### [MODIFY] Content MDX Files (Example: `content/tools/*.mdx`)
- *Batch Process*: I will update the MDX content for the most popular tools (e.g., Image Compressor, PDF Merger, Downloaders) to include a strong, citable introductory block (130-170 words) and direct definitions.

---

## Verification Plan

### Automated Tests
- Build the project using `npm run build` to ensure no TypeScript or Next.js routing errors were introduced.

### Manual Verification
- Review the output of `/robots.txt` and `/llms.txt` in the local development environment (`npm run dev`).
- Validate the generated JSON-LD in the `<head>` of a tool page to ensure `BreadcrumbList` and `FAQPage` schemas are correctly formed.
