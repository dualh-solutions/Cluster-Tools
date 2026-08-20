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
  metadataBase: new URL('https://pressto.dev'),
  title: "Pressto - Fast, Private Online Tools",
  description: "Convert, compress, and edit files entirely in your browser. No uploads, no servers, zero waiting.",
  keywords: ["online tools", "file converter", "pdf tools", "image compressor", "browser based tools", "privacy first tools"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pressto.dev",
    title: "Pressto - Fast, Private Online Tools",
    description: "Convert, compress, and edit files entirely in your browser. 100% private.",
    siteName: "Pressto",
    images: [
      {
        url: "/og?title=Pressto+-+Fast%2C+Private+Online+Tools&category=Tools",
        width: 1200,
        height: 630,
        alt: "Pressto - Fast, Private Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pressto - Fast, Private Online Tools",
    description: "Convert, compress, and edit files entirely in your browser. 100% private.",
    images: ["/og?title=Pressto+-+Fast%2C+Private+Online+Tools&category=Tools"],
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
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Pressto",
              "url": "https://pressto.dev",
              "description": "Convert, compress, and edit files entirely in your browser. No uploads, no servers, zero waiting.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://pressto.dev/tools?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-body-md min-h-screen flex flex-col antialiased bg-background text-ink`} suppressHydrationWarning>
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
        <footer className="bg-surface border-t border-outline-variant flat w-full pt-4xl pb-lg mt-auto">
          <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xl mb-4xl">
            <div className="col-span-1 flex flex-col gap-sm pr-lg">
              <Link href="/" className="font-h2 text-h2 font-extrabold text-primary flex items-center gap-2 mb-2">
                <div className="relative flex items-center justify-center">
                  <Hexagon className="text-primary fill-primary/20" size={28} />
                  <div className="absolute w-2 h-2 bg-primary rounded-full"></div>
                </div>
                Pressto
              </Link>
              <p className="font-metadata text-metadata text-on-surface-variant leading-relaxed">
                Fast, free, and private online tools<br/>that respect your privacy.
              </p>
            </div>
            <div className="flex flex-col gap-md">
              <h4 className="font-label-md text-label-md text-on-surface font-bold">Tools</h4>
              <Link href="/tools" className="font-metadata text-metadata text-on-surface-variant hover:text-primary transition-colors">All Tools</Link>
            </div>
            <div className="flex flex-col gap-md">
              <h4 className="font-label-md text-label-md text-on-surface font-bold">Company</h4>
              <Link href="/about" className="font-metadata text-metadata text-on-surface-variant hover:text-primary transition-colors">About Us</Link>
              <Link href="/privacy" className="font-metadata text-metadata text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="font-metadata text-metadata text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
          
          <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop pt-lg border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-md">
             <p className="font-metadata text-metadata text-on-surface-variant">© 2026 Pressto. All rights reserved.</p>
             <button className="flex items-center gap-1 font-metadata text-metadata text-on-surface-variant hover:text-primary transition-colors">
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
