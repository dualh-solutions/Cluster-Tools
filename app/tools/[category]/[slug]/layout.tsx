import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/tools/registry";
import { generateToolMetadata } from "@/lib/tools/metadata";
import { generateToolSchema } from "@/lib/tools/schema";

interface LayoutProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Omit<LayoutProps, "children">): Promise<Metadata> {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);
  
  if (!tool || tool.category !== resolvedParams.category || tool.status !== "live") {
    return {};
  }

  return generateToolMetadata(tool);
}

export default async function ToolLayout({ params, children }: LayoutProps) {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);

  if (!tool || tool.category !== resolvedParams.category || tool.status !== "live") {
    notFound();
  }

  const schemaLd = generateToolSchema(tool);

  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLd) }}
      />
    </>
  );
}
