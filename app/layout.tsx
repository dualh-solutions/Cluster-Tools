import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Hexagon, Globe, ChevronDown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://clustertools.online'),
  title: "Cluster Tools - Fast, Private Online Tools",
  description: "Convert, compress, and edit files entirely in your browser. No uploads, no servers, zero waiting.",
  keywords: ["online tools", "file converter", "pdf tools", "image compressor", "browser based tools", "privacy first tools"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://clustertools.online",
    title: "Cluster Tools - Fast, Private Online Tools",
    description: "Convert, compress, and edit files entirely in your browser. 100% private.",
    siteName: "Cluster Tools",
    images: [
      {
        url: "/og?title=Cluster Tools+-+Fast%2C+Private+Online+Tools&category=Tools",
        width: 1200,
        height: 630,
        alt: "Cluster Tools - Fast, Private Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cluster Tools - Fast, Private Online Tools",
    description: "Convert, compress, and edit files entirely in your browser. 100% private.",
    images: ["/og?title=Cluster Tools+-+Fast%2C+Private+Online+Tools&category=Tools"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "cluster-tools",
                "url": "https://clustertools.online",
                "description": "Convert, compress, and edit files entirely in your browser. No uploads, no servers, zero waiting.",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://clustertools.online/tools?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "cluster-tools",
                "url": "https://clustertools.online",
                "logo": "https://clustertools.online/favicon.ico",
                "description": "Browser-based, privacy-first file conversion and editing tools. 100% private, no server uploads.",
                "sameAs": []
              }
            ])
          }}
        />
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-body-md min-h-screen flex flex-col antialiased bg-background text-ink overflow-x-hidden`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
        
        {/* Main Content */}
        <div className="flex flex-1 w-full relative">
          <main className="flex-1 w-full min-w-0">
            {children}
          </main>
        </div>

        {/* Footer Component */}
        <footer className="bg-surface border-t border-outline-variant flat w-full pt-12 md:pt-4xl pb-6 md:pb-lg mt-auto">
          <div className="max-w-[1440px] mx-auto px-4 md:px-margin-desktop flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-xl mb-8 md:mb-4xl">
            <div className="col-span-1 flex flex-col gap-sm">
              <Link href="/" className="font-h2 text-h2 font-extrabold text-primary flex items-center gap-2 mb-2">
                <div className="relative flex items-center justify-center">
                  <Hexagon className="text-primary fill-primary/20" size={28} />
                  <div className="absolute w-2 h-2 bg-primary rounded-full"></div>
                </div>
                Cluster Tools
              </Link>
              <p className="font-metadata text-metadata text-on-surface-variant leading-relaxed">
                Fast, free, and private online tools that respect your privacy.
              </p>
            </div>
            <div className="flex flex-col gap-md">
              <h4 className="font-label-md text-label-md text-on-surface font-bold">Tools</h4>
              <Link href="/tools" className="font-metadata text-metadata text-on-surface-variant hover:text-primary transition-colors min-h-[44px] flex items-center">All Tools</Link>
            </div>
            <div className="flex flex-col gap-md">
              <h4 className="font-label-md text-label-md text-on-surface font-bold">Company</h4>
              <Link href="/about" className="font-metadata text-metadata text-on-surface-variant hover:text-primary transition-colors min-h-[44px] flex items-center">About Us</Link>
              <Link href="/privacy" className="font-metadata text-metadata text-on-surface-variant hover:text-primary transition-colors min-h-[44px] flex items-center">Privacy Policy</Link>
              <Link href="/terms" className="font-metadata text-metadata text-on-surface-variant hover:text-primary transition-colors min-h-[44px] flex items-center">Terms of Service</Link>
            </div>
          </div>
          
          <div className="max-w-[1440px] mx-auto px-4 md:px-margin-desktop pt-4 md:pt-lg border-t border-outline-variant flex flex-col items-center md:flex-row justify-between gap-3">
             <p className="font-metadata text-metadata text-on-surface-variant text-center md:text-left">© 2026 Cluster Tools. All rights reserved.</p>
             <button className="flex items-center gap-1 font-metadata text-metadata text-on-surface-variant hover:text-primary transition-colors min-h-[44px]">
                <Globe size={14} className="mr-1" /> English <ChevronDown size={14} />
             </button>
          </div>
        </footer>
        <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
