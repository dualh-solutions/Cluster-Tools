import { CategoryDefinition } from "./types";

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: "image",
    slug: "image",
    name: "Image Tools",
    description: "Compress, resize, and edit images easily in your browser.",
    lastModified: "2026-08-24T00:00:00.000Z",
  },
  {
    id: "pdf",
    slug: "pdf",
    name: "PDF Tools",
    description: "Convert, merge, and split PDF documents securely.",
    lastModified: "2026-08-24T00:00:00.000Z",
  },
  {
    id: "calculators",
    slug: "calculators",
    name: "Calculators",
    description: "Smart calculators for business, finance, and everyday use.",
    lastModified: "2026-08-24T00:00:00.000Z",
  },
  {
    id: "text",
    slug: "text",
    name: "Text Tools",
    description: "Format, analyze, and clean text and strings.",
    lastModified: "2026-08-24T00:00:00.000Z",
  },
  {
    id: "developer",
    slug: "developer",
    name: "Developer Tools",
    description: "Essential utilities for coding and development.",
    lastModified: "2026-08-24T00:00:00.000Z",
  },
  {
    id: "seo",
    slug: "seo",
    name: "SEO Tools",
    description: "Tools to optimize and analyze your website for search engines.",
    lastModified: "2026-08-24T00:00:00.000Z",
  },
  {
    id: "color",
    slug: "color",
    name: "Color Tools",
    description: "Pickers, converters, and palettes for designers.",
    lastModified: "2026-08-24T00:00:00.000Z",
  },
  {
    id: "converters",
    slug: "converters",
    name: "Converters",
    description: "Convert units, measurements, and data formats.",
    lastModified: "2026-08-24T00:00:00.000Z",
  },
  {
    id: "business",
    slug: "business",
    name: "Business Tools",
    description: "Utilities for marketing, sales, and business operations.",
    lastModified: "2026-08-24T00:00:00.000Z",
  },
  {
    id: "social-media",
    slug: "social-media",
    name: "Social Media Tools",
    description: "Format and optimize content for social platforms.",
    lastModified: "2026-08-24T00:00:00.000Z",
  },
  {
    id: "productivity",
    slug: "productivity",
    name: "Productivity Tools",
    description: "Tools to help you get work done faster.",
    lastModified: "2026-08-24T00:00:00.000Z",
  },
  {
    id: "downloader",
    slug: "downloader",
    name: "Social Media Downloaders",
    description: "Download videos and media from various social platforms.",
    lastModified: "2026-08-24T00:00:00.000Z",
  },
  {
    id: "general",
    slug: "general",
    name: "General Tools",
    description: "Everyday utility tools for developers and power users.",
    lastModified: "2026-08-24T00:00:00.000Z",
  },
];

export function getCategoryById(id: string): CategoryDefinition | undefined {
  return CATEGORIES.find(c => c.id === id);
}

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}
