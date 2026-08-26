import { Metadata } from "next";
import { ToolDefinition } from "./types";

export interface BaseMetadataProps {
  title: string;
  description: string;
  url: string;
  category?: string;
  [key: string]: any;
}

export function constructMetadata({ title, description, url, category = "Tools", ...rest }: BaseMetadataProps): Metadata {
  const ogImageUrl = `/og?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    ...rest,
  };
}

export function generateToolMetadata(tool: ToolDefinition): Metadata {
  const url = `https://clustertools.online/tools/${tool.category}/${tool.slug}`;
  
  return constructMetadata({
    title: tool.title,
    description: tool.description,
    url,
    category: tool.category,
    keywords: tool.keywords.join(", "),
  });
}
