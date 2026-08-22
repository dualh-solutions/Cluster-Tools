import { notFound } from "next/navigation";
import { TOOLS_REGISTRY, getToolUrl } from "@/lib/tools/registry";
import { getCategoryBySlug } from "@/lib/tools/categories";
import Link from "next/link";
import { Metadata } from "next";
import { 
  ChevronRight, 
  Home, 
  Layers, 
  Image as ImageIcon, 
  FileText, 
  Calculator, 
  Type, 
  Code, 
  Search, 
  Palette, 
  RefreshCw, 
  Briefcase, 
  Share2, 
  CheckSquare, 
  Wrench,
  ArrowRight,
  ShieldCheck,
  Shrink,
  Zap,
  PenTool,
  CheckCircle,
  Eye,
  Settings
} from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = getCategoryBySlug(resolvedParams.category);
  
  if (!category) {
    return { title: "Category Not Found | Cluster Tools" };
  }
  
  return {
    title: `${category.name} | Cluster Tools`,
    description: category.description,
  };
}

const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case "image": return ImageIcon;
    case "pdf": return FileText;
    case "calculators": return Calculator;
    case "text": return Type;
    case "developer": return Code;
    case "seo": return Search;
    case "color": return Palette;
    case "converters": return RefreshCw;
    case "business": return Briefcase;
    case "social-media": return Share2;
    case "productivity": return CheckSquare;
    case "general": return Wrench;
    default: return Layers;
  }
};

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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = getCategoryBySlug(resolvedParams.category);

  if (!category) {
    notFound();
  }

  const categoryTools = TOOLS_REGISTRY.filter(t => t.category === category.id);
  const CategoryIcon = getCategoryIcon(category.id);
  
  const words = category.name.split(" ");
  const firstWord = words[0];
  const restWords = words.slice(1).join(" ");

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-16 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
        
        {/* Left Content */}
        <div className="flex-1 w-full max-w-[640px]">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[13px] font-medium text-gray-500 mb-8">
            <Home size={14} className="text-gray-400" />
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-primary font-semibold">{category.name}</span>
          </nav>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-[#F4F0FF] flex items-center justify-center text-[#6D28D9] shadow-sm shrink-0">
              <CategoryIcon size={32} strokeWidth={2} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight">
              {firstWord} <span className="text-primary">{restWords}</span>
            </h1>
          </div>
          
          <p className="text-[17px] text-ink-muted leading-relaxed mb-6">
            {category.description}
          </p>
          
          <div className="inline-flex items-center gap-2 bg-[#EFF6FF] text-[#3B82F6] px-3 py-1.5 rounded-lg text-sm font-semibold border border-[#DBEAFE]">
            <Layers size={16} strokeWidth={2.5} />
            {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'} available
          </div>
        </div>

        {/* Right Illustration */}
        <div className="flex-1 w-full max-w-[500px] h-[300px] relative hidden lg:block">
          {/* Abstract background shape */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[400px] max-h-[260px] bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[40px] shadow-[inset_0_2px_20px_rgba(255,255,255,1)] flex items-center justify-center overflow-hidden">
             <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
             <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
             <CategoryIcon size={120} className="text-primary/20" strokeWidth={1} />
          </div>
          
          {/* Floating UI Elements */}
          <div className="absolute top-[20%] left-[10%] w-14 h-14 bg-surface rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex items-center justify-center animate-pulse duration-[3000ms]">
            <Shrink size={24} className="text-green-500" strokeWidth={2} />
          </div>
          <div className="absolute bottom-[25%] left-[20%] w-16 h-16 bg-surface rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex items-center justify-center animate-bounce duration-[4000ms]">
            <RefreshCw size={28} className="text-blue-500" strokeWidth={2} />
          </div>
          <div className="absolute top-[35%] right-[15%] w-12 h-12 bg-surface rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex items-center justify-center animate-pulse duration-[3500ms]">
            <Zap size={20} className="text-purple-500" strokeWidth={2} />
          </div>
          <div className="absolute bottom-[20%] right-[25%] w-14 h-14 bg-surface rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex items-center justify-center">
            <CheckCircle size={24} className="text-orange-500" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      {categoryTools.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-gray-200 rounded-3xl shadow-sm">
          <p className="text-gray-500 font-medium">No tools available in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categoryTools.map((tool) => {
            const ToolIcon = getToolIcon(tool.toolType);
            
            // Get color mapping based on toolType to give variety
            let iconBg = "bg-[#F4F0FF]";
            let iconColor = "text-[#6D28D9]";
            if (tool.toolType === "compressor") { iconBg = "bg-[#EFF6FF]"; iconColor = "text-[#3B82F6]"; }
            else if (tool.toolType === "calculator") { iconBg = "bg-[#F0FDF4]"; iconColor = "text-[#22C55E]"; }
            else if (tool.toolType === "converter") { iconBg = "bg-[#FFF7ED]"; iconColor = "text-[#EA580C]"; }
            else if (tool.toolType === "generator") { iconBg = "bg-[#FDF4FF]"; iconColor = "text-[#C026D3]"; }

            return (
              <Link
                key={tool.id}
                href={getToolUrl(tool)}
                className="group relative flex flex-col bg-surface border border-gray-200 rounded-[24px] p-6 hover:border-transparent transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-[16px] ${iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                    <ToolIcon size={26} className={iconColor} strokeWidth={2} />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-ink text-[17px] leading-tight group-hover:text-primary transition-colors pr-2">
                        {tool.name}
                      </h3>
                      {tool.popular && (
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#3B82F6] px-2 py-1 rounded-md">
                          POPULAR
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-[14px] text-ink-muted leading-relaxed mb-6 flex-1 pr-4">
                  {tool.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4">
                  <div className="flex flex-wrap gap-2.5">
                    {tool.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[12px] font-medium text-[#9CA3AF]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <ArrowRight size={20} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" strokeWidth={2} />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Footer Privacy Banner */}
      {categoryTools.length > 0 && (
        <div className="w-full max-w-[800px] mx-auto bg-[#EFF6FF] border border-[#DBEAFE] rounded-[24px] py-4 px-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
          <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck size={18} className="text-[#3B82F6]" strokeWidth={2.5} />
          </div>
          <p className="text-[14px] text-[#3B82F6] font-medium leading-snug">
            <span className="font-bold">100% Private</span> <span className="hidden sm:inline px-1">&middot;</span> All tools process files in your browser. Your files never leave your device.
          </p>
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
            "url": `https://cluster-tools.dev/tools/${category.slug}`,
            "hasPart": categoryTools.map(tool => ({
              "@type": "SoftwareApplication",
              "name": tool.name,
              "url": `https://cluster-tools.dev/tools/${category.slug}/${tool.slug}`,
              "applicationCategory": "BrowserApplication",
            }))
          })
        }}
      />
    </div>
  );
}
