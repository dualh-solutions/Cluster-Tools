import { 
  Home, ChevronRight, Shrink, RefreshCw, Calculator, Zap, Code, Search, PenTool, CheckCircle, Eye, Settings
} from "lucide-react";
import { notFound } from "next/navigation";
import { getToolBySlug, TOOLS_REGISTRY } from "@/lib/tools/registry";
import React from "react";
import { getToolComponent } from "@/lib/tools/loaders";
import { getRelatedTools } from "@/lib/tools/relationships";
import { generateToolMetadata } from "@/lib/tools/metadata";
import { Metadata } from "next";
import Link from "next/link";
import { getToolMDXContent } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ScrollToBottom } from "@/components/ui/ScrollToBottom";

const mdxComponents = {
  h1: (props: any) => <h2 className="text-[24px] md:text-[32px] font-extrabold mt-8 md:mt-12 mb-4 text-on-surface" {...props} />,
  h2: (props: any) => <h2 className="text-[20px] md:text-[28px] font-extrabold mt-8 md:mt-12 mb-4 text-on-surface tracking-tight" {...props} />,
  h3: (props: any) => <h3 className="text-[18px] md:text-[22px] font-bold mt-6 md:mt-8 mb-4 text-on-surface" {...props} />,
  p: (props: any) => <p className="mb-4 md:mb-6 text-on-surface-variant text-[16px] md:text-[18px] leading-[1.6]" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-5 space-y-2 mb-6 md:mb-8 text-[16px] md:text-[18px] text-on-surface-variant leading-[1.6]" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-5 space-y-2 md:space-y-3 mb-8 md:mb-10 text-[16px] md:text-[18px] text-on-surface-variant leading-[1.6]" {...props} />,
  li: (props: any) => <li className="pl-1 md:pl-2" {...props} />,
  strong: (props: any) => <span className="text-on-surface font-bold" {...props} />,
  b: (props: any) => <span className="text-on-surface font-bold" {...props} />,
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
    return { title: "Tool Not Found | Cluster Tools" };
  }
  return generateToolMetadata(tool);
}

export function generateStaticParams() {
  return TOOLS_REGISTRY.filter(t => t.status === "live").map((tool) => ({
    category: tool.category,
    slug: tool.slug,
  }));
}

const getToolIcon = (toolType: string) => {
  switch (toolType) {
    case "compressor": return Shrink;
    case "converter": return RefreshCw;
    case "calculator": return Calculator;
    case "generator": return Zap;
    case "formatter": return Code;
    case "analyzer": return Search;
    case "editor": return PenTool;
    case "validator": return CheckCircle;
    case "viewer": return Eye;
    default: return Settings;
  }
};

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

  const displayTitle = tool.title.split(' | ')[0];
  const MainIcon = getToolIcon(tool.toolType);

  // 4 & 5. Render the standard tool page and relevant content
  return (
    <div className="w-full flex-1 flex flex-col motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300 ease-out">
      <ScrollToBottom />
      
      {/* Visual Breadcrumb */}
      <div className="w-full max-w-[896px] mx-auto px-4 mt-6 md:mt-10 text-[13px] font-medium text-gray-500 flex items-center gap-2">
        <Home size={14} className="text-gray-400" />
        <Link href="/" className="hover:text-[#2E5CFF] transition-colors">Home</Link>
        <ChevronRight size={14} className="text-gray-400" />
        <Link href="/tools" className="hover:text-[#2E5CFF] transition-colors">Tools</Link>
        <ChevronRight size={14} className="text-gray-400" />
        <Link href={`/tools/${tool.category}`} className="hover:text-[#2E5CFF] transition-colors capitalize">{tool.category}</Link>
        <ChevronRight size={14} className="text-gray-400" />
        <span className="text-[#2E5CFF] font-semibold">{tool.name}</span>
      </div>

      {/* Shared Header (SEO H1) */}
      <div className="w-full text-center mb-2 flex flex-col items-center mt-8 px-4">
        <div className="w-[52px] h-[52px] rounded-2xl bg-[#F4F0FF] dark:bg-[#F4F0FF]/10 flex items-center justify-center text-[#6D28D9] dark:text-[#A78BFA] mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <MainIcon size={26} strokeWidth={2} />
        </div>
        <h1 className="text-[32px] font-extrabold text-ink tracking-tight leading-tight mb-3 max-w-[768px] mx-auto">
          {displayTitle}
        </h1>
        <p className="text-[15px] text-ink-muted max-w-[400px] mx-auto leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Tool Interface */}
      <div className="w-full pb-12">
        {React.createElement(dynamicTool)}
      </div>

      {/* Content Section */}
      <section className="w-full max-w-[768px] mx-auto px-4 py-8 text-on-surface">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": tool.name,
                "description": tool.description,
                "applicationCategory": "UtilitiesApplication",
                "operatingSystem": "All",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "url": `https://clustertools.online/tools/${tool.category}/${tool.slug}`,
                "dateModified": tool.lastModified ? new Date(tool.lastModified).toISOString() : undefined
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://clustertools.online/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Tools",
                    "item": "https://clustertools.online/tools"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": tool.category,
                    "item": `https://clustertools.online/tools/${tool.category}`
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "name": tool.name,
                    "item": `https://clustertools.online/tools/${tool.category}/${tool.slug}`
                  }
                ]
              },
              ...(tool.faqs && tool.faqs.length > 0 ? [{
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
              }] : [])
            ])
          }}
        />

        {tool.lastModified && (
          <div className="flex items-center gap-2 mb-8 text-sm text-on-surface-variant font-medium bg-surface p-3 rounded-lg border border-outline-variant w-fit shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2E5CFF]">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 6v6l4 2" />
            </svg>
            Last Updated: {new Date(tool.lastModified).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
            <span className="ml-2 px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider">Verified</span>
          </div>
        )}

        <div className="prose prose-slate dark:prose-invert max-w-none">
          
          {mdxContent ? (
            <div className="mdx-content">
              <MDXRemote source={mdxContent.source} components={mdxComponents} />
            </div>
          ) : (
            <>
              {tool.howTo && tool.howTo.length > 0 && (
                <>
                  <h2 className="text-[20px] md:text-[28px] font-extrabold mb-3 md:mb-4 text-on-surface tracking-tight">How to use {tool.shortName}</h2>
                  <ol className="list-decimal pl-5 space-y-2 md:space-y-3 mb-8 md:mb-10 text-[16px] md:text-[18px] text-on-surface-variant leading-[1.6]">
                    {tool.howTo.map((step, i) => (
                      <li key={i} className="pl-1 md:pl-2">
                        <span className="text-on-surface font-bold">{step.name}:</span> {step.text}
                      </li>
                    ))}
                  </ol>
                </>
              )}

              {tool.faqs && tool.faqs.length > 0 && (
                <>
                  <h2 className="text-[20px] md:text-[28px] font-extrabold mb-3 md:mb-4 text-on-surface tracking-tight">Frequently Asked Questions</h2>
                  <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                    {tool.faqs.map((faq, i) => (
                      <div key={i} className="bg-surface border border-outline-variant rounded-xl p-4 md:p-5 shadow-sm">
                        <div className="block text-on-surface font-bold text-[16px] md:text-[18px] mb-2">{faq.question}</div>
                        <p className="text-on-surface-variant text-[15px] md:text-[16px] m-0 leading-[1.6]">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {relatedTools.length > 0 && (
            <div className="mt-12 pt-8 border-t border-outline-variant">
              <h2 className="text-xl font-h3 font-bold mb-6 text-on-surface">Related Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedTools.map(t => (
                  <Link 
                    key={t.id} 
                    href={`/tools/${t.category}/${t.slug}`}
                    className="block bg-surface border border-outline-variant rounded-xl p-4 hover:border-primary transition-all duration-200 group shadow-sm hover:shadow-md hover:-translate-y-1"
                  >
                    <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors">{t.name}</h3>
                    <p className="text-sm text-on-surface-variant mt-1 line-clamp-1">{t.shortName}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
