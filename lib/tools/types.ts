export type ToolStatus = "live" | "beta" | "coming-soon" | "deprecated";

export type ProcessingMode = "client" | "server" | "hybrid";

export type ToolType = 
  | "converter"
  | "compressor"
  | "calculator"
  | "generator"
  | "formatter"
  | "analyzer"
  | "editor"
  | "validator"
  | "viewer"
  | "preview"
  | "downloader";

export interface FAQ {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface ToolDefinition {
  // Identity
  id: string;
  slug: string;
  name: string;
  shortName: string;

  // Classification
  category: string;
  subcategory?: string;
  toolType: ToolType;
  tags: string[];

  // Implementation
  componentKey: string;
  processingMode: ProcessingMode;

  // Input/output
  inputTypes: string[];
  inputFormats: string[];
  outputTypes: string[];
  outputFormats: string[];

  // SEO/discovery
  title: string;
  description: string;
  keywords: string[];
  aliases: string[];
  searchTerms: string[];

  // Discovery
  popular?: boolean;
  isNew?: boolean;
  featured?: boolean;
  relatedTools?: string[]; // IDs of related tools

  // Lifecycle
  status: ToolStatus;
  lastModified: string; // ISO date string

  // Content
  contentSlug?: string;
  faqs?: FAQ[];
  howTo?: HowToStep[];
}

export interface CategoryDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
  lastModified: string;
}
