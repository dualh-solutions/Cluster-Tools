import { Metadata } from 'next';
import { Shield, Zap, Lock, Code2, Globe, Heart, Server, Eye, Check } from 'lucide-react';

import { constructMetadata } from '@/lib/tools/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'About Cluster Tools — Browser-Based Tools Built for Privacy',
  description: 'Cluster Tools builds fast, free, privacy-first file tools that run entirely in your browser. No servers, no uploads, no data collected. Learn about our mission and how it works.',
  url: 'https://clustertools.online/about',
  category: 'About',
});

export default function AboutPage() {
  return (
    <div className="w-full bg-background">

      {/* Hero Section */}
      <div className="w-full bg-surface border-b border-outline-variant">
        <div className="max-w-[768px] mx-auto px-5 md:px-4 py-12 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 md:px-4 py-1.5 rounded-full text-[13px] md:text-sm font-semibold mb-4 md:mb-6">
            <Lock size={14} />
            No uploads. No servers. No data collected.
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-on-surface mb-4 md:mb-6 leading-tight md:leading-tight tracking-tight">
            Built for people who care about their privacy.
          </h1>
          <p className="text-[17px] md:text-xl text-on-surface-variant leading-[1.6] md:leading-relaxed">
            Cluster Tools is a collection of free, browser-based tools for converting, compressing, and editing files.
            Every tool runs entirely on your device — your files never leave your browser.
          </p>
        </div>
      </div>

      {/* The Privacy Problem */}
      <div className="w-full max-w-[768px] mx-auto px-5 md:px-4 py-10 md:py-16">
        
        <div className="prose prose-slate max-w-none text-left">
          
          <h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface mt-0 mb-4 md:mb-6 tracking-tight">Why most online tools are a privacy problem</h2>
          <p className="text-[15px] md:text-lg text-on-surface-variant mb-5 md:mb-6 leading-[1.7] md:leading-relaxed">
            The standard model for online file tools works like this: you upload your file to their server, it gets processed in the cloud, and you download the result.
            Every tool on ilovepdf.com, smallpdf.com, tinypng.com, and thousands of others works this way.
          </p>
          <p className="text-[15px] md:text-lg text-on-surface-variant mb-5 md:mb-6 leading-[1.7] md:leading-relaxed">
            When you compress a PDF of your lease agreement, convert your tax documents, or resize a medical scan — that file travels across the internet to a server you know nothing about.
            Even if the company promises to delete it, it still sat on their infrastructure. Their logs saw it. Their processing pipeline touched it.
          </p>
          <p className="text-[15px] md:text-lg text-on-surface-variant mb-8 md:mb-10 leading-[1.7] md:leading-relaxed">
            For most casual use this is fine. But for anything sensitive — contracts, financial documents, medical records, personal photos, business data — uploading to unknown servers is an unnecessary risk. We built Cluster Tools because the alternative actually works.
          </p>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-4 md:mb-6 tracking-tight">How Cluster Tools works differently</h2>
          
          {/* Tech cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose mb-8 md:mb-10">
            <div className="bg-surface border border-outline-variant rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
                <Code2 size={20} className="text-blue-500" />
              </div>
              <h3 className="font-bold text-on-surface text-base mb-2">WebAssembly</h3>
              <p className="text-[14px] text-on-surface-variant leading-[1.6]">
                Heavy processing tasks (PDF manipulation, image encoding, HEIC decoding) run via WebAssembly — native-speed compiled code that runs in the browser sandbox.
              </p>
            </div>
            <div className="bg-surface border border-outline-variant rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-3">
                <Zap size={20} className="text-purple-500" />
              </div>
              <h3 className="font-bold text-on-surface text-base mb-2">Web Workers</h3>
              <p className="text-[14px] text-on-surface-variant leading-[1.6]">
                Processing runs in background threads (Web Workers), keeping the UI responsive while your file is being compressed, converted, or transformed.
              </p>
            </div>
            <div className="bg-surface border border-outline-variant rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-3">
                <Server size={20} className="text-green-500" />
              </div>
              <h3 className="font-bold text-on-surface text-base mb-2">File API</h3>
              <p className="text-[14px] text-on-surface-variant leading-[1.6]">
                Files are loaded directly into browser memory using the File API. No upload occurs. The file never leaves the JavaScript sandbox on your device.
              </p>
            </div>
          </div>

          <p className="text-[15px] md:text-lg text-on-surface-variant mb-8 md:mb-10 leading-[1.7] md:leading-relaxed">
            The result is a tool that's often <em>faster</em> than server-based alternatives — because there's no upload time, no queue on a shared server, and no download wait. Your device's processor handles it directly.
          </p>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-4 md:mb-6 tracking-tight">Our commitments to you</h2>
          
          <div className="space-y-4 not-prose mb-8 md:mb-10">
            {[
              {
                icon: Eye,
                color: 'text-blue-500',
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                title: 'Zero file access',
                desc: "We have no servers that receive your files. This isn't a privacy policy promise — it's an architectural fact. There's no server to receive your data."
              },
              {
                icon: Shield,
                color: 'text-green-500',
                bg: 'bg-green-50 dark:bg-green-900/20',
                title: 'Minimal analytics only',
                desc: "We use Vercel Analytics to collect aggregated, anonymous page view counts. No user tracking, no cross-site fingerprinting, no advertising pixels. We genuinely don't want your personal data."
              },
              {
                icon: Heart,
                color: 'text-red-500',
                bg: 'bg-red-50 dark:bg-red-900/20',
                title: 'Free, without paywalls',
                desc: "Every tool is completely free. There are no upload limits hidden behind a sign-up wall, no 'free users get low quality' tiers, and no subscriptions required for full features."
              },
              {
                icon: Globe,
                color: 'text-purple-500',
                bg: 'bg-purple-50 dark:bg-purple-900/20',
                title: 'Works offline',
                desc: 'Once loaded, most Cluster Tools tools function without an internet connection. Since processing is local, internet access is only needed to load the page — not to run the tool.'
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-4 md:p-5 bg-surface border border-outline-variant rounded-xl">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon size={20} className={item.color} />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface mb-1 md:mb-2">{item.title}</h3>
                  <p className="text-[14px] md:text-[15px] text-on-surface-variant leading-[1.6]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-4 md:mb-6 tracking-tight">Who built this?</h2>
          <p className="text-[15px] md:text-lg text-on-surface-variant mb-5 md:mb-6 leading-[1.7] md:leading-relaxed">
            Cluster Tools was built by a small independent team of developers. We found ourselves constantly frustrated by online tools that required accounts, imposed arbitrary file size limits, were slow because of server queues, or showed invasive ads.
          </p>
          <p className="text-[15px] md:text-lg text-on-surface-variant mb-5 md:mb-6 leading-[1.7] md:leading-relaxed">
            Modern browsers are genuinely powerful — WebAssembly brings near-native performance to the web, and libraries like PDF-lib, libwebp, and libheif have been compiled to run in JavaScript. The technical capability to build fully client-side file tools has existed for years. We just built the cleanest, most useful version of them we could.
          </p>
          <p className="text-[15px] md:text-lg text-on-surface-variant mb-8 md:mb-10 leading-[1.7] md:leading-relaxed">
            We rely on Vercel Analytics for basic usage statistics. We have no other tracking. We fund the site through minimal, non-intrusive advertising. No user data is monetized.
          </p>

          {/* What we don't do */}
          <div className="bg-surface border border-outline-variant rounded-2xl p-5 md:p-6 mb-8 md:mb-10 not-prose">
            <h3 className="font-bold text-on-surface text-[17px] md:text-lg mb-4">What Cluster Tools does not do</h3>
            <div className="space-y-3">
              {[
                'Receive, store, or transmit your uploaded files to any server',
                'Create user accounts or track individual users',
                'Sell data to advertisers or third parties',
                'Impose file size or daily usage limits',
                'Require email registration to access any feature',
                'Show advertising inside tool interfaces',
              ].map((item) => (
                <div key={item} className="flex items-start md:items-center gap-3 text-[14px] md:text-[15px] text-on-surface-variant leading-[1.5]">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5 md:mt-0">
                    <Check size={12} className="text-green-600" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 text-center not-prose">
            <h3 className="text-lg md:text-xl font-bold text-on-surface mb-2">Questions or feedback?</h3>
            <p className="text-on-surface-variant mb-5 md:mb-6 text-[14px] md:text-[15px]">
              Found a bug, have a feature request, or want to suggest a tool? We read every message.
            </p>
            <a
              href="mailto:hello@clustertools.online"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full font-semibold transition-colors text-[14px] md:text-sm"
            >
              Contact us at hello@clustertools.online
            </a>
          </div>

        </div>
      </div>

      {/* JSON-LD: Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "cluster-tools",
            "url": "https://clustertools.online",
            "logo": "https://clustertools.online/favicon.ico",
            "description": "Browser-based, privacy-first file conversion and editing tools. No server uploads. 100% free.",
            "email": "hello@clustertools.online",
            "knowsAbout": [
              "PDF compression",
              "Image conversion",
              "WebAssembly file processing",
              "Browser-based developer tools",
              "Privacy-first web applications"
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Free Online File Tools",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "SoftwareApplication",
                    "name": "PDF Tools",
                    "applicationCategory": "UtilitiesApplication",
                    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "SoftwareApplication",
                    "name": "Image Tools",
                    "applicationCategory": "UtilitiesApplication",
                    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
                  }
                }
              ]
            }
          })
        }}
      />
    </div>
  );
}
