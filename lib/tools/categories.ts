import { CategoryDefinition } from "./types";

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: "image",
    slug: "image",
    name: "Image Tools",
    description: "Compress, resize, and edit images easily in your browser.",
  },
  {
    id: "pdf",
    slug: "pdf",
    name: "PDF Tools",
    description: "Convert, merge, and split PDF documents securely.",
  },
  {
    id: "calculators",
    slug: "calculators",
    name: "Calculators",
    description: "Smart calculators for business, finance, and everyday use.",
  },
  {
    id: "text",
    slug: "text",
    name: "Text Tools",
    description: "Format, analyze, and clean text and strings.",
  },
  {
    id: "developer",
    slug: "developer",
    name: "Developer Tools",
    description: "Essential utilities for coding and development.",
  },
  {
    id: "seo",
    slug: "seo",
    name: "SEO Tools",
    description: "Tools to optimize and analyze your website for search engines.",
  },
  {
    id: "color",
    slug: "color",
    name: "Color Tools",
    description: "Pickers, converters, and palettes for designers.",
  },
  {
    id: "converters",
    slug: "converters",
    name: "Converters",
    description: "Convert units, measurements, and data formats.",
  },
  {
    id: "business",
    slug: "business",
    name: "Business Tools",
    description: "Utilities for marketing, sales, and business operations.",
  },
  {
    id: "social-media",
    slug: "social-media",
    name: "Social Media Tools",
    description: "Format and optimize content for social platforms.",
  },
  {
    id: "productivity",
    slug: "productivity",
    name: "Productivity Tools",
    description: "Tools to help you get work done faster.",
  },
  {
    id: "general",
    slug: "general",
    name: "General Tools",
    description: "Everyday utility tools for developers and power users.",
  },
];

export function getCategoryById(id: string): CategoryDefinition | undefined {
  return CATEGORIES.find(c => c.id === id);
}

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}
