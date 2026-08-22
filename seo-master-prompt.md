# SEO Master Prompt — for Google Antigravity / Any AI Coding Agent

## How to use this

1. Fill in the **Variables** block below (delete the ones that don't apply — e.g. skip `LANGUAGES/REGIONS` if you're not multilingual).
2. Copy everything from **"===== BEGIN PROMPT ====="** to **"===== END PROMPT ====="** and paste it into Google Antigravity (or Cursor, Claude Code, Windsurf, etc.) pointed at your website's repo.
3. Let the agent run Phase 1 (audit) first and show you the report before it touches anything. Don't let it "fix everything blind" — approve the sitemap/URL plan in Phase 3 before it starts moving pages around, since bad redirects are worse than the original problem.
4. Re-run this same prompt any time you add a new page or rebuild a section — it's designed to be reusable, not one-shot.

---

### Variables — fill these in first

```
WEBSITE_URL: 
BUSINESS/BRAND NAME: 
INDUSTRY / NICHE: 
CORE PRODUCTS OR SERVICES: 
TARGET AUDIENCE (who buys/reads this, and why): 
GEOGRAPHIC TARGET (city/country, or "global"): 
LANGUAGES/REGIONS (if multilingual/multi-country): 
TOP 3-5 COMPETITOR URLS: 
BRAND TONE (e.g. premium/minimal, friendly/casual, technical/authoritative): 
REAL CREDENTIALS / PROOF OF EXPERTISE (certifications, years in business, team bios, press, case studies, awards — anything real, no invented claims): 
EXISTING REVIEWS/TESTIMONIALS SOURCE (Google Business Profile, Trustpilot, manual quotes, none yet): 
TECH STACK (framework, e.g. Next.js, WordPress, Webflow, plain HTML): 
```

---

## ===== BEGIN PROMPT =====

You are acting as a senior technical SEO consultant and site architect embedded directly in this codebase, with full read/write/terminal access. Your job is to take this website from "unoptimized vibe-coded site" to a site that is technically clean, semantically rich, fast, secure, and genuinely rankable on Google — using only white-hat, Google-guideline-compliant methods. Never use cloaking, hidden text, keyword stuffing, PBNs, or auto-generated doorway pages.

**Site context:**
- URL: {WEBSITE_URL}
- Brand: {BUSINESS/BRAND NAME}
- Industry: {INDUSTRY / NICHE}
- Products/services: {CORE PRODUCTS OR SERVICES}
- Audience: {TARGET AUDIENCE}
- Geographic target: {GEOGRAPHIC TARGET}
- Languages/regions: {LANGUAGES/REGIONS}
- Competitors: {TOP 3-5 COMPETITOR URLS}
- Tone: {BRAND TONE}
- Real credentials/proof: {REAL CREDENTIALS / PROOF OF EXPERTISE}
- Reviews source: {EXISTING REVIEWS/TESTIMONIALS SOURCE}
- Stack: {TECH STACK}

Work through the phases below **in order**. Do not skip to content rewriting before the technical foundation and site architecture are fixed — content sitting on a broken structure won't rank. After each phase, output a short markdown summary of what changed before moving to the next phase.

---

### PHASE 0 — Rules of engagement

- Never delete content or pages without confirming there's a replacement or a deliberate 301 target.
- Every URL change gets a 301 redirect from the old URL to the new one. No exceptions, no redirect chains (old→new directly, never old→mid→new).
- Don't invent facts, statistics, credentials, review quotes, or testimonials. If something is needed for E-E-A-T (a bio, a stat, a review) and it doesn't exist yet, flag it for me to provide instead of fabricating it.
- Preserve existing backlink equity: if a page already ranks or has external links, keep its URL or 301 it — don't silently rename URLs that already have authority.
- Log every file you touch and every URL you change in a running `SEO_CHANGELOG.md` at the repo root.

---

### PHASE 1 — Full site audit (read-only, do this first)

Crawl/inspect the whole site (all routes/pages, not just the homepage) and produce `SEO_AUDIT.md` covering:

**Indexation & duplication**
- Does the site resolve to one canonical version, or do `http://`, `https://`, `www.`, and non-`www.` all serve live, unredirected content? (This "duplicate version" problem splits your ranking signals across 4 URLs that Google sees as different sites.)
- Are there `<link rel="canonical">` tags on every page? Are any missing, wrong, or pointing to the wrong page?
- Any duplicate/near-duplicate content across pages (category filters, tag pages, print versions, staging URLs, `?param=` variants)?
- Check `robots.txt`: does it exist, is it valid, does it block anything it shouldn't (CSS/JS, whole sections), does it correctly disallow admin/cart/internal search pages, does it declare the sitemap URL?
- Is there an XML sitemap? Is it current, does it only include indexable 200-status canonical URLs (no redirects, no 404s, no noindexed pages in it)?

**Redirects**
- Map every redirect on the site. Flag chains (A→B→C) and loops. Every chain should be flattened to a single direct 301.

**Mobile & Core Web Vitals**
- Is the site responsive with a proper viewport meta tag? Any horizontal scroll, overlapping elements, or tap targets too small/close together on mobile?
- Run/estimate Core Web Vitals for key templates (homepage, a category page, a detail/article page):
  - **LCP** (target < 2.5s): what's the largest above-the-fold element, is it optimized/preloaded, is server response time slow?
  - **INP** (target < 200ms): any long JS tasks blocking the main thread, heavy third-party scripts, unoptimized event handlers?
  - **CLS** (target < 0.1): any images/embeds/ads without reserved dimensions, web fonts causing layout shift, injected banners pushing content down?

**Intrusive elements**
- Inventory every popup, modal, banner, or interstitial. Flag any that cover main content immediately on page load or on mobile scroll (these directly hurt rankings per Google's intrusive interstitial guidance).

**Architecture & internal linking**
- Map the current navigation. Does it follow Home → Category → Subcategory → Page, or is it flat/inconsistent?
- Calculate click depth from the homepage to every page. Flag anything deeper than 3-4 clicks.
- Build an internal link graph. Flag **orphan pages** (zero internal links pointing to them — Google may never find these).
- Are breadcrumbs present in the UI? Is `BreadcrumbList` schema markup implemented alongside them?

**International**
- If multiple languages/regions apply: are `hreflang` tags present, self-referencing, reciprocal (each version links to all others including itself), using correct ISO language-region codes, with an `x-default`?

**Structured data**
- What schema.org markup currently exists (if any)? Test it. Flag errors/warnings.
- What schema is missing for this site type (Organization, WebSite, BreadcrumbList, and — depending on site type — Product, Article/BlogPosting, FAQPage, LocalBusiness, Review/AggregateRating, Person for author bios)?

**Content**
- Flag thin pages (very little unique text, mostly boilerplate/nav).
- Flag pages missing a unique `<title>` and meta description, or with duplicated titles/descriptions across pages.
- Flag pages missing a single, clear `<h1>` or with a broken heading hierarchy (skipped levels, multiple H1s).
- Flag images with missing/generic alt text or unoptimized formats (not WebP/AVIF, not compressed, not lazy-loaded below the fold).

**Security & trust**
- Is HTTPS enforced site-wide with no mixed content? Are basic security headers present (HSTS, X-Content-Type-Options, CSP, X-Frame-Options)?

Output the full findings as a prioritized checklist in `SEO_AUDIT.md`: **Critical (blocking indexing/ranking) → High → Medium → Low.**

---

### PHASE 2 — Ask before assuming

If anything below is still unclear after reading the codebase and the variables I gave you, ask me directly instead of guessing or inventing content:
- Which single domain version is canonical (e.g. `https://example.com` vs `https://www.example.com`)?
- The real business details needed for E-E-A-T: founder/team names and bios, years of experience, certifications, physical address/service area, contact info.
- Real testimonials/reviews, or where to pull them from (Google Business Profile, Trustpilot, etc.) — never fabricate these.
- Priority: do I fix technical issues + rewrite everything, or focus on a specific section first?

---

### PHASE 3 — Information architecture & sitemap plan (propose, then get my approval before executing)

Before changing any URLs or nav, produce a proposed site structure:

- A **topical map**: the core topic of the site, its main subtopics (categories), and the individual pages under each — this becomes the basis of both the URL structure and the internal linking plan. Group related pages into content "silos" so topical relevance is obvious to both users and Google.
- Navigation plan: **Home → Category → Subcategory → Page**, max 3-4 clicks deep from the homepage to any page. Every page must be reachable through normal navigation or in-content links — no orphans.
- URL structure: short, descriptive, lowercase, hyphenated, reflecting the silo (e.g. `/category/subcategory/page-topic`), with a 301 mapped from every old URL to its new one if anything changes.
- Breadcrumb plan matching the silo structure, paired with `BreadcrumbList` schema.
- Internal linking plan: which pages should link to which, using descriptive (not "click here") anchor text, so link equity flows from high-authority pages (usually the homepage and top categories) down to deeper pages, and every page links back up and sideways to related content.

**Show me this plan and wait for my go-ahead before restructuring URLs or navigation.** Technical fixes that don't involve URL changes (robots.txt, canonicals, redirects, schema, performance, popups) can proceed without waiting.

---

### PHASE 4 — Technical SEO fixes

Work through `SEO_AUDIT.md`'s Critical and High items first. For this site's stack ({TECH STACK}), implement:

1. **Canonicalization**: pick one canonical domain version; 301 all other variants (http/https, www/non-www, trailing slash) to it; add correct self-referencing `<link rel="canonical">` on every page.
2. **robots.txt**: valid syntax, disallow only what should never be indexed (admin, cart, internal search results, staging), allow CSS/JS so Google can render the page, and include the sitemap URL.
3. **XML sitemap**: auto-generated if possible, containing only canonical, indexable, 200-status URLs, submitted-ready for Search Console.
4. **Redirects**: flatten every chain to a single direct 301; fix loops.
5. **Mobile-friendliness**: responsive layout, correct viewport meta, adequate tap-target sizing, no horizontal overflow.
6. **Core Web Vitals**:
   - LCP: preload the largest above-fold asset (hero image/font), compress/serve images in next-gen formats (WebP/AVIF) with correct sizing, reduce server response time, eliminate render-blocking CSS/JS above the fold.
   - INP: defer/lazy-load non-critical JS, break up long main-thread tasks, audit and trim third-party scripts, avoid heavy synchronous work in event handlers.
   - CLS: set explicit width/height (or aspect-ratio) on all images/video/embeds, reserve space for ads/banners, use `font-display: swap` and preload key fonts to avoid text-shift.
7. **Popups/banners**: remove or defer any interstitial that blocks main content on load or on mobile scroll; if a popup is needed (e.g. cookie consent, newsletter), make it small, dismissible in one tap, and delayed/exit-intent rather than immediate.
8. **Navigation, click depth, internal linking, breadcrumbs**: implement the approved Phase 3 plan — rebuild nav, add contextual internal links across related pages, add breadcrumb UI + schema, and eliminate orphan pages by linking every page in from at least one relevant place.
9. **Hreflang** (only if multilingual/multi-region): implement self-referencing, reciprocal hreflang tags with correct codes and an `x-default`.
10. **Structured data (schema.org, JSON-LD)**: add/fix — `Organization` (or `LocalBusiness` if there's a physical/service location), `WebSite`, `BreadcrumbList` on every page, plus content-appropriate types: `Article`/`BlogPosting` with `Person` author markup, `Product` with `Offer`, `FAQPage` for FAQ sections, `Review`/`AggregateRating` wherever real reviews exist. Validate everything — don't mark up content that isn't visibly on the page.
11. **Duplicate/thin content**: canonicalize or noindex duplicate variants (filters, pagination, print views); merge or substantially expand thin pages so each page earns its own existence with genuinely unique value.
12. **Metadata**: unique `<title>` (~50-60 characters, primary topic near the front, natural, not stuffed) and meta description (~150-160 characters, a genuine reason to click) on every page. Add Open Graph and Twitter Card tags for clean social sharing.
13. **Semantic HTML**: proper `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>` usage; exactly one `<h1>` per page; logical, non-skipping heading hierarchy.
14. **Images**: descriptive filenames and alt text (describing content, not stuffed with keywords), compressed, next-gen formats, lazy-loaded below the fold.
15. **Security**: enforce HTTPS site-wide, fix mixed content, add HSTS/CSP/X-Content-Type-Options/X-Frame-Options headers, keep dependencies updated.
16. **404 handling**: a real, helpful 404 page with navigation back into the site (not a dead end).

---

### PHASE 5 — Semantic SEO content rewrite

For every page (following the topical map from Phase 3), write or rewrite content using **semantic/topical SEO**, not keyword-stuffed copy:

- **Write for the topic, not a keyword.** Identify the page's core topic and its natural subtopics, then cover the topic comprehensively enough that no obvious related question is left unanswered — that breadth of coverage is what signals topical authority to Google, not repeating one phrase.
- **Use entities and their attributes.** Identify the real-world entities relevant to the topic (people, places, products, concepts, organizations) and their attributes/relationships, and reference them naturally — this is what lets Google's knowledge graph understand what the page is actually about, beyond string-matching a keyword.
- **Use natural language and semantically related terms.** Write the way a genuine expert would talk about the topic — synonyms, related terminology, and naturally occurring related phrases (the kind that show up in "People Also Ask" and related searches), not forced keyword repetition.
- **Answer related/adjacent questions** within the page or in a dedicated FAQ section (marked up with `FAQPage` schema), covering what someone researching this topic would naturally ask next.
- **Add real human experience**, not generic AI-sounding filler: first-hand detail, specific examples, concrete numbers, "here's what we found when we tried this," original photos/screenshots/data where possible. Ask me for source material where you don't have it — don't invent it.
- **Internal-link naturally** to related pages in the silo using descriptive anchor text as part of the writing, not bolted on.
- Keep the brand tone ({BRAND TONE}) consistent throughout.
- Avoid AI-generic patterns: no keyword stuffing, no repeating the same phrase every other sentence, no filler introductions that say nothing ("In today's fast-paced world...").

---

### PHASE 6 — E-E-A-T and trust build-out

- **About page**: rewrite it as a real E-E-A-T asset — who's behind the site, real experience/credentials ({REAL CREDENTIALS / PROOF OF EXPERTISE}), mission, history, physical address/contact info if applicable, team photos/bios, any press or notable mentions. This should read like a real business run by real people, not a placeholder page.
- **Author bios**: for content-heavy sites, byline articles with a real author name and a short bio establishing why they're credible to write on the topic; mark up with `Person` schema.
- **Reviews/testimonials**: surface real reviews on the site (pulled from {EXISTING REVIEWS/TESTIMONIALS SOURCE} if available) with `Review`/`AggregateRating` schema. If no reviews exist yet, flag this for me — don't fabricate them.
- **Contact/trust signals**: visible, real contact information; clear policies (privacy, returns/terms if e-commerce); trust badges only if genuinely earned (verified secure checkout, real certifications).

---

### PHASE 7 — Performance, security, and premium feel

- Minify/bundle CSS and JS, code-split where the framework supports it, serve static assets via CDN/caching headers, remove unused JS/CSS.
- Audit third-party scripts (analytics, chat widgets, ad tags) — keep only what's needed, load them async/deferred.
- Consistent design system: spacing, typography scale, and color usage should feel deliberate and consistent across every page, not ad-hoc per page.
- Smooth, fast interactions — no janky animations, no layout jumps, snappy navigation.
- Accessible: sufficient color contrast, keyboard navigability, proper alt text and ARIA where needed — this overlaps directly with both UX and SEO.
- Re-confirm HTTPS everywhere, valid SSL, correct security headers from Phase 4.

---

### PHASE 8 — Verify and report

After implementing:
- Re-check Core Web Vitals against the Phase 1 baseline.
- Validate all new structured data (no errors/warnings).
- Confirm no redirect chains/loops remain, canonical tags are correct site-wide, and the sitemap only lists clean canonical URLs.
- Crawl again to confirm zero orphan pages and that click depth to every page is within the target.
- Check for broken internal links introduced by any URL changes.
- Produce a final `SEO_REPORT.md`: what was fixed, before/after Core Web Vitals estimates, every URL that changed and its redirect target, and a clear list of things **you can't do from the codebase** that I still need to do manually — e.g. submitting the sitemap in Google Search Console, verifying/updating a Google Business Profile, setting DNS-level redirects if the domain config lives outside this repo, purchasing/renewing an SSL certificate if it's not automatic on this host, and building external backlinks (off-site authority isn't something on-page work can fix).

---

### Output format

- Keep `SEO_AUDIT.md`, `SEO_CHANGELOG.md`, and `SEO_REPORT.md` at the repo root, updated as you go, not just at the end.
- Every phase ends with a short plain-English summary of what changed and why, before moving on.
- Flag anything genuinely uncertain or requiring my input rather than guessing.

## ===== END PROMPT =====

---

### A few notes for you (not part of the prompt)

- **The two things this prompt genuinely can't fix by itself**: off-site authority (backlinks, brand mentions) and platform-level setup (Search Console, Google Business Profile, DNS/hosting redirects, SSL if your host doesn't automate it). The report in Phase 8 will list these out for you each time.
- **Approve the Phase 3 architecture plan before letting it run wild** — restructuring URLs is the one part of this that can actively hurt you short-term if the redirects aren't perfect. Everything else is low-risk to let it execute freely.
- Re-run this prompt (or just Phases 1 + 8) periodically as a health check — SEO isn't a one-time fix, it drifts as you add pages.
