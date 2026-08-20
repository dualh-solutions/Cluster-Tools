import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/tools/registry";
import React from "react";
import { getToolComponent } from "@/lib/tools/loaders";
import { getRelatedTools } from "@/lib/tools/relationships";
import { generateToolMetadata } from "@/lib/tools/metadata";
import { Metadata } from "next";
import Link from "next/link";
import { getToolMDXContent } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";

const mdxComponents = {
  h2: (props: any) => <h2 className="text-2xl font-h2 font-extrabold mt-12 mb-4 text-on-surface" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-h3 font-bold mt-8 mb-4 text-on-surface" {...props} />,
  p: (props: any) => <p className="mb-6 text-on-surface-variant text-lg leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-5 space-y-2 mb-8 text-on-surface-variant" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-5 space-y-3 mb-10 text-on-surface-variant" {...props} />,
  li: (props: any) => <li className="pl-2" {...props} />,
  strong: (props: any) => <strong className="text-on-surface font-bold" {...props} />,
};

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);
  if (!tool) {
    return { title: "Tool Not Found | Pressto" };
  }
  return generateToolMetadata(tool);
}

export default async function ToolPage({ params }: PageProps) {
  const resolvedParams = await params;
  // 1. Resolve the tool & 2. Validate
  const tool = getToolBySlug(resolvedParams.slug);
  if (!tool || tool.category !== resolvedParams.category || tool.status !== "live") {
    notFound();
  }

  // 3. Load the component
  const dynamicTool = getToolComponent(tool.componentKey);
  if (!dynamicTool) {
    notFound();
  }

  const relatedTools = getRelatedTools(tool);
  const mdxContent = getToolMDXContent(tool.slug);

  // 4 & 5. Render the standard tool page and relevant content
  return (
    <div className="w-full flex-1 flex flex-col motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300 ease-out">
      
      {/* Tool Interface */}
      <div className="bg-canvas border-b border-border">
        {/* We let the ToolComponent render its ToolShell (which has dropzone etc) */}
        {/* If we remove title/desc from ToolShell, we can render them here. For now, ToolComponent renders it. */}
        {React.createElement(dynamicTool)}
      </div>

      {/* Content Section */}
      <section className="w-full max-w-[768px] mx-auto px-4 py-12 text-on-surface">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          
          <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-8 font-medium">
            <span className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {tool.processingMode === "client" ? "100% Private (Processed in browser)" : "Secure server-side processing"}
            </span>
          </div>

          <h2 className="text-2xl font-h2 font-extrabold mb-4 text-on-surface">About {tool.name}</h2>
          <p className="mb-8 text-on-surface-variant text-lg leading-relaxed">{tool.description}</p>
          
          {mdxContent ? (
            <div className="mdx-content">
              <MDXRemote source={mdxContent.source} components={mdxComponents} />
            </div>
          ) : (
            <>
              {tool.howTo && tool.howTo.length > 0 && (
                <>
                  <h3 className="text-xl font-h3 font-bold mb-4 text-on-surface">How to use {tool.shortName}</h3>
                  <ol className="list-decimal pl-5 space-y-3 mb-10 text-on-surface-variant">
                    {tool.howTo.map((step, i) => (
                      <li key={i} className="pl-2">
                        <strong className="text-on-surface">{step.name}:</strong> {step.text}
                      </li>
                    ))}
                  </ol>
                </>
              )}

              {tool.faqs && tool.faqs.length > 0 && (
                <>
                  <h3 className="text-xl font-h3 font-bold mb-4 text-on-surface">Frequently Asked Questions</h3>
                  <div className="space-y-6 mb-10">
                    {tool.faqs.map((faq, i) => (
                      <div key={i} className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm">
                        <strong className="block text-on-surface font-bold text-lg mb-2">{faq.question}</strong>
                        <p className="text-on-surface-variant m-0 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {relatedTools.length > 0 && (
            <div className="mt-12 pt-8 border-t border-outline-variant">
              <h3 className="text-xl font-h3 font-bold mb-6 text-on-surface">Related Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedTools.map(t => (
                  <Link 
                    key={t.id} 
                    href={`/tools/${t.category}/${t.slug}`}
                    className="block bg-surface border border-outline-variant rounded-xl p-4 hover:border-primary transition-all duration-200 group shadow-sm hover:shadow-md hover:-translate-y-1"
                  >
                    <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{t.name}</h4>
                    <p className="text-sm text-on-surface-variant mt-1 line-clamp-1">{t.shortName}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": tool.name,
            "applicationCategory": "BrowserApplication",
            "operatingSystem": "Any (runs in browser)",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": tool.description,
            "url": `https://pressto.dev/tools/${tool.category}/${tool.slug}`
          })
        }}
      />
      
      {tool.faqs && tool.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": tool.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />
      )}

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://pressto.dev"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Tools",
                "item": "https://pressto.dev/tools"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": tool.category.charAt(0).toUpperCase() + tool.category.slice(1),
                "item": `https://pressto.dev/tools/${tool.category}`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": tool.name,
                "item": `https://pressto.dev/tools/${tool.category}/${tool.slug}`
              }
            ]
          })
        }}
      />
    </div>
  );
}
