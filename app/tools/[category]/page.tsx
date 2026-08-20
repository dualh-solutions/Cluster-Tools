import { notFound } from "next/navigation";
import { TOOLS_REGISTRY, getToolUrl } from "@/lib/tools/registry";
import { getCategoryBySlug } from "@/lib/tools/categories";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = getCategoryBySlug(resolvedParams.category);
  
  if (!category) {
    return { title: "Category Not Found | Pressto" };
  }
  
  return {
    title: `${category.name} | Pressto`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = getCategoryBySlug(resolvedParams.category);

  if (!category) {
    notFound();
  }

  const categoryTools = TOOLS_REGISTRY.filter(t => t.category === category.id);

  return (
    <div className="w-full max-w-[1024px] mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-ink-muted mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
        <ChevronRight size={14} />
        <span className="text-ink font-medium">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-display font-bold text-ink mb-4">{category.name}</h1>
        <p className="text-ink-muted max-w-[672px] text-lg">
          {category.description}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm font-medium text-ink-muted">
          <span>{categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'} available</span>
        </div>
      </div>

      {/* Tools Grid */}
      {categoryTools.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-[var(--radius-lg)]">
          <p className="text-ink-muted">No tools available in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTools.map((tool) => (
            <Link
              key={tool.id}
              href={getToolUrl(tool)}
              className="block bg-surface border border-border rounded-[var(--radius-md)] p-6 hover:border-primary transition-all duration-200 ease-out hover:shadow-elevated group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display font-medium text-ink group-hover:text-primary transition-colors text-lg">
                  {tool.name}
                </h3>
                {tool.popular && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-muted line-clamp-3 mb-4">{tool.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {tool.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] font-mono bg-canvas text-ink-muted px-2 py-0.5 rounded-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": category.name,
            "description": category.description,
            "url": `https://pressto.dev/tools/${category.slug}`,
            "hasPart": categoryTools.map(tool => ({
              "@type": "SoftwareApplication",
              "name": tool.name,
              "url": `https://pressto.dev/tools/${category.slug}/${tool.slug}`,
              "applicationCategory": "BrowserApplication",
            }))
          })
        }}
      />
    </div>
  );
}
