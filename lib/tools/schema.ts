import { ToolDefinition } from "./types";

export function generateBreadcrumbSchema(tool: ToolDefinition) {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://cluster-tools.dev/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": tool.category.charAt(0).toUpperCase() + tool.category.slice(1) + " Tools",
        "item": `https://cluster-tools.dev/tools/${tool.category}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tool.name,
        "item": `https://cluster-tools.dev/tools/${tool.category}/${tool.slug}`
      }
    ]
  };
}

export function generateSoftwareSchema(tool: ToolDefinition) {
  return {
    "@type": "WebApplication",
    name: tool.name,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (runs in browser)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: tool.description,
  };
}

export function generateFAQSchema(tool: ToolDefinition) {
  if (!tool.faqs || tool.faqs.length === 0) return null;

  return {
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function generateHowToSchema(tool: ToolDefinition) {
  if (!tool.howTo || tool.howTo.length === 0) return null;
  return {
    "@type": "HowTo",
    name: `How to use ${tool.name}`,
    description: tool.description,
    step: tool.howTo.map((step, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: step.name,
      text: step.text
    }))
  };
}

export function generateToolSchema(tool: ToolDefinition): Record<string, unknown> {
  const graph: unknown[] = [
    generateSoftwareSchema(tool),
    generateBreadcrumbSchema(tool)
  ];

  const faqSchema = generateFAQSchema(tool);
  if (faqSchema) graph.push(faqSchema);
  
  const howToSchema = generateHowToSchema(tool);
  if (howToSchema) graph.push(howToSchema);

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}
