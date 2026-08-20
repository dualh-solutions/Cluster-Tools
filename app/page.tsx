import Link from "next/link";
import { TOOLS_REGISTRY, getToolUrl } from "@/lib/tools/registry";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { 
  ArrowRight, Sparkles, Image as ImageIcon, FileText, Type, Code2, 
  TrendingUp, Calculator, LayoutGrid, Upload, Sliders, CheckCircle2,
  Lock, Zap, Users, Gift, ShieldCheck, Rocket, Globe, Heart
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { FloatingIcon } from "@/components/animations/FloatingIcon";

export default function Home() {
  const popularTools = TOOLS_REGISTRY.filter(t => t.popular).slice(0, 6);
  
  const displayCategories = [
    { id: "image", name: "Image", icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-50" },
    { id: "pdf", name: "PDF", icon: FileText, color: "text-red-500", bg: "bg-red-50" },
    { id: "text", name: "Text", icon: Type, color: "text-purple-500", bg: "bg-purple-50" },
    { id: "developer", name: "Developer", icon: Code2, color: "text-green-500", bg: "bg-green-50" },
    { id: "seo", name: "SEO / Web", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50" },
    { id: "calculators", name: "Calculator", icon: Calculator, color: "text-indigo-500", bg: "bg-indigo-50" },
    { id: "general", name: "General", icon: LayoutGrid, color: "text-pink-500", bg: "bg-pink-50" },
  ];

  const categoryToolCounts = displayCategories.map(cat => ({
    ...cat,
    count: TOOLS_REGISTRY.filter(t => t.category === cat.id).length
  }));

  const getToolCategoryStyle = (categoryId: string) => {
    switch (categoryId) {
      case "image": return "text-blue-600 bg-blue-50";
      case "pdf": return "text-red-600 bg-red-50";
      case "text": return "text-purple-600 bg-purple-50";
      case "developer": return "text-green-600 bg-green-50";
      case "seo": return "text-orange-600 bg-orange-50";
      case "calculators": return "text-indigo-600 bg-indigo-50";
      default: return "text-purple-600 bg-purple-50";
    }
  };

  const getToolIcon = (categoryId: string) => {
    switch (categoryId) {
      case "image": return <ImageIcon size={24} className="text-blue-500" />;
      case "pdf": return <FileText size={24} className="text-red-500" />;
      case "text": return <Type size={24} className="text-purple-500" />;
      case "developer": return <Code2 size={24} className="text-green-500" />;
      case "seo": return <TrendingUp size={24} className="text-orange-500" />;
      case "calculators": return <Calculator size={24} className="text-indigo-500" />;
      default: return <LayoutGrid size={24} className="text-pink-500" />;
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center pb-24 bg-background">
      
      {/* Hero Section */}
      <div className="w-full relative px-margin-mobile md:px-margin-desktop pt-20 pb-16 text-center flex flex-col items-center overflow-hidden">
        
        {/* Floating Icons Background */}
        <FloatingIcon delay={0} yOffset={20} duration={6} className="absolute top-10 left-[15%] w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center rotate-[-12deg] opacity-80 z-0 hidden lg:flex">
          <ImageIcon size={32} className="text-purple-400" />
        </FloatingIcon>
        <FloatingIcon delay={1} yOffset={15} duration={5} className="absolute top-40 left-[10%] w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center rotate-[15deg] opacity-80 z-0 hidden lg:flex">
          <FileText size={28} className="text-red-400" />
        </FloatingIcon>
        <FloatingIcon delay={2} yOffset={25} duration={7} className="absolute top-12 right-[15%] w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center rotate-[10deg] opacity-80 z-0 hidden lg:flex">
          <FileText size={28} className="text-blue-400" />
        </FloatingIcon>
        <FloatingIcon delay={0.5} yOffset={18} duration={5.5} className="absolute top-36 right-[12%] w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center rotate-[-15deg] opacity-80 z-0 hidden lg:flex">
          <ShieldCheck size={32} className="text-green-400" />
        </FloatingIcon>

        <StaggerContainer className="relative z-10 flex flex-col items-center w-full max-w-[896px]">
          {/* Top Badge */}
          <StaggerItem>
            <div className="flex items-center gap-2 bg-yellow-50/50 border border-yellow-100 rounded-full px-4 py-1.5 mb-8">
               <Sparkles size={14} className="text-yellow-400" />
               <span className="text-xs font-semibold text-primary/80">100% Private • No Uploads • Works Offline</span>
            </div>
          </StaggerItem>

          <StaggerItem>
            <h1 className="font-h1 text-[48px] md:text-[64px] leading-[1.1] font-extrabold text-on-surface tracking-tight mb-6">
              Fast, Free, <span className="text-primary">Privacy-First</span><br/>Online Tools
            </h1>
          </StaggerItem>
          
          <StaggerItem>
            <p className="font-body-lg text-[18px] text-on-surface-variant max-w-[580px] mb-12">
              Convert, compress, and edit files entirely in your browser. No uploads, no servers, zero waiting.
            </p>
          </StaggerItem>
          
          {/* Big Search Bar */}
          <StaggerItem className="w-full max-w-[640px] mx-auto mb-16 relative">
            <GlobalSearch variant="hero" />
          </StaggerItem>
          
          {/* 3-Step Sequence */}
          <StaggerItem className="w-full max-w-[800px]">
            <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-8 md:gap-12 w-full">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Upload size={20} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm text-on-surface">01 Drop it</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">Select or drop your file</div>
                </div>
              </div>
              
              <div className="hidden md:block w-8 h-[1px] border-t border-dashed border-outline-variant"></div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Sliders size={20} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm text-on-surface">02 We process it</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">In your browser</div>
                </div>
              </div>

              <div className="hidden md:block w-8 h-[1px] border-t border-dashed border-outline-variant"></div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm text-on-surface">03 You&apos;re done</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">Download instantly</div>
                </div>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>

      <div className="w-full max-w-[1440px] px-margin-mobile md:px-margin-desktop mb-24">
        {/* Features Bar */}
        <ScrollReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-t border-b border-outline-variant/60 mb-20">
          <div className="flex items-start gap-4">
             <div className="w-12 h-12 rounded-full bg-blue-50 flex flex-col items-center justify-center text-blue-500 shrink-0">
               <Lock size={24} />
             </div>
             <div>
               <h3 className="font-bold text-on-surface text-base mb-1">100% Private</h3>
               <p className="text-sm text-on-surface-variant">Your files never leave your device.</p>
             </div>
          </div>
          <div className="flex items-start gap-4">
             <div className="w-12 h-12 rounded-full bg-purple-50 flex flex-col items-center justify-center text-purple-500 shrink-0">
               <Zap size={24} />
             </div>
             <div>
               <h3 className="font-bold text-on-surface text-base mb-1">Blazing Fast</h3>
               <p className="text-sm text-on-surface-variant">Browser-powered processing.</p>
             </div>
          </div>
          <div className="flex items-start gap-4">
             <div className="w-12 h-12 rounded-full bg-green-50 flex flex-col items-center justify-center text-green-500 shrink-0">
               <Users size={24} />
             </div>
             <div>
               <h3 className="font-bold text-on-surface text-base mb-1">No Sign Up</h3>
               <p className="text-sm text-on-surface-variant">No accounts, no emails, just tools.</p>
             </div>
          </div>
          <div className="flex items-start gap-4">
             <div className="w-12 h-12 rounded-full bg-orange-50 flex flex-col items-center justify-center text-orange-500 shrink-0">
               <Gift size={24} />
             </div>
             <div>
               <h3 className="font-bold text-on-surface text-base mb-1">Always Free</h3>
               <p className="text-sm text-on-surface-variant">Powerful tools at zero cost.</p>
             </div>
          </div>
        </ScrollReveal>

        {/* Browse by Category */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[24px] font-bold text-on-surface">Browse by Category</h2>
            <Link href="/tools" className="text-sm font-bold text-primary hover:text-primary-fixed-variant transition-colors flex items-center gap-1">
              View all tools <ArrowRight size={16} />
            </Link>
          </div>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categoryToolCounts.map((category) => {
              const Icon = category.icon;
              return (
                <StaggerItem key={category.id} className="h-full">
                  <Link
                    href={`/tools/${category.id}`}
                    className="flex flex-col items-center justify-center p-6 bg-surface border border-outline-variant rounded-2xl hover:border-primary transition-all duration-200 group shadow-sm hover:shadow-md hover:-translate-y-1 h-full"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${category.bg} ${category.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="font-bold text-on-surface text-sm mb-1">{category.name}</h3>
                    <p className="text-xs text-on-surface-variant font-medium">{category.count} tools</p>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Popular Tools */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[24px] font-bold text-on-surface flex items-center gap-2">
              <Sparkles size={24} className="text-primary" /> Popular Tools
            </h2>
            <Link href="/tools" className="text-sm font-bold text-primary hover:text-primary-fixed-variant transition-colors flex items-center gap-1">
              Browse all tools <ArrowRight size={16} />
            </Link>
          </div>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {popularTools.map((tool) => (
              <StaggerItem key={tool.id} className="h-full">
                <Link
                  href={getToolUrl(tool)}
                  className="flex flex-col bg-surface border border-outline-variant rounded-2xl p-6 hover:border-primary transition-all duration-200 shadow-sm hover:shadow-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:-translate-y-1 relative h-full"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                        {getToolIcon(tool.category)}
                      </div>
                      <h3 className="font-bold text-[18px] text-on-surface group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getToolCategoryStyle(tool.category)}`}>
                      {tool.category === 'seo' ? 'SEO / WEB' : tool.category}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">{tool.description}</p>
                  <div className="mt-6 text-sm font-bold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Use tool <ArrowRight size={16} />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="flex justify-center mb-24">
            <Link href="/tools" className="inline-flex items-center justify-center px-8 py-3.5 bg-primary hover:bg-primary-fixed-variant text-white font-bold rounded-full transition-colors shadow-lg shadow-primary/25">
              Explore all {TOOLS_REGISTRY.length} tools <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <ScrollReveal delay={0.2} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10 mb-24">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
               <ShieldCheck size={24} />
             </div>
             <div>
               <h3 className="font-extrabold text-on-surface text-xl mb-0.5">100%</h3>
               <p className="font-bold text-sm text-on-surface mb-0.5">Private & Secure</p>
               <p className="text-xs text-on-surface-variant">Files never leave your device</p>
             </div>
           </div>
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
               <Rocket size={24} />
             </div>
             <div>
               <h3 className="font-extrabold text-on-surface text-xl mb-0.5">0s</h3>
               <p className="font-bold text-sm text-on-surface mb-0.5">Instant Processing</p>
               <p className="text-xs text-on-surface-variant">No waiting, everything happens instantly</p>
             </div>
           </div>
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
               <Globe size={24} />
             </div>
             <div>
               <h3 className="font-extrabold text-on-surface text-xl mb-0.5">{TOOLS_REGISTRY.length}+</h3>
               <p className="font-bold text-sm text-on-surface mb-0.5">Powerful Tools</p>
               <p className="text-xs text-on-surface-variant">All the tools you need, in one place</p>
             </div>
           </div>
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
               <Heart size={24} />
             </div>
             <div>
               <h3 className="font-extrabold text-on-surface text-xl mb-0.5">Free</h3>
               <p className="font-bold text-sm text-on-surface mb-0.5">Forever Free</p>
               <p className="text-xs text-on-surface-variant">All features available at zero cost</p>
             </div>
           </div>
        </ScrollReveal>

      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to convert or compress a file entirely in your browser",
            "description": "Convert, compress, and edit files entirely in your browser securely and instantly with zero uploads.",
            "step": [
              {
                "@type": "HowToStep",
                "position": 1,
                "name": "Drop it",
                "text": "Drag and drop your file into the tool area."
              },
              {
                "@type": "HowToStep",
                "position": 2,
                "name": "It processes",
                "text": "Your browser processes the file locally using WebAssembly and Web Workers. The file never leaves your device."
              },
              {
                "@type": "HowToStep",
                "position": 3,
                "name": "Done",
                "text": "Instantly download your converted or compressed file."
              }
            ]
          }),
        }}
      />
    </div>
  );
}
