import { Metadata } from "next";
import { ToolDefinition } from "./types";

export function generateToolMetadata(tool: ToolDefinition): Metadata {
  const url = `https://cluster-tools.dev/tools/${tool.category}/${tool.slug}`;
  const ogImageUrl = `/og?title=${encodeURIComponent(tool.title)}&category=${encodeURIComponent(tool.category)}`;

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords.join(", "),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: tool.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
      images: [ogImageUrl],
    }
  };
}
