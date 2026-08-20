import { TOOLS_REGISTRY, getToolUrl } from "@/lib/tools/registry";
import { CATEGORIES } from "@/lib/tools/categories";
import Link from "next/link";
import { Metadata } from "next";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";

export const metadata: Metadata = {
  title: "All Online Tools | Pressto",
  description: "Browse our complete collection of free, private, browser-based tools for images, PDFs, text, and more.",
};

export default function AllToolsPage() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-4xl">
      <h1 className="text-display-sm font-display-sm font-extrabold text-on-surface mb-sm">All Tools</h1>
      <p className="text-body-lg font-body-lg text-on-surface-variant mb-3xl max-w-[672px]">
        Browse our complete collection of fast, private, and free online tools. Every tool processes your files locally in your browser.
      </p>

      <div className="space-y-4xl">
        {CATEGORIES.map(category => {
          const categoryTools = TOOLS_REGISTRY.filter(t => t.category === category.id);
          
          if (categoryTools.length === 0) return null;

          return (
            <div key={category.id} className="scroll-mt-24" id={category.slug}>
              <div className="flex items-end justify-between border-b border-outline-variant pb-md mb-lg">
                <div>
                  <h2 className="text-h2 font-h2 font-bold text-on-surface">
                    <Link href={`/tools/${category.slug}`} className="hover:text-primary transition-colors">
                      {category.name}
                    </Link>
                  </h2>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">{category.description}</p>
                </div>
                <Link 
                  href={`/tools/${category.slug}`}
                  className="hidden md:block text-label-md font-label-md font-bold text-primary hover:text-primary-fixed-variant transition-colors hover:underline"
                >
                  View all {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'} →
                </Link>
              </div>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                {categoryTools.map(tool => (
                  <StaggerItem key={tool.id} className="h-full">
                    <Link
                      href={getToolUrl(tool)}
                      className="block bg-surface border border-outline-variant rounded-2xl p-lg hover:border-primary transition-all duration-200 ease-out ambient-shadow group hover:-translate-y-1 h-full"
                    >
                      <div className="flex items-start justify-between mb-sm">
                        <h3 className="font-h3 text-h3 font-semibold text-on-surface group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                        {tool.popular && (
                          <span className="text-metadata font-metadata font-bold uppercase tracking-wider bg-primary-container text-on-primary-container px-2 py-0.5 rounded-sm">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-2">{tool.description}</p>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}
