import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Pressto | Fast, Private Online Tools',
  description: 'Learn about Pressto and our mission to provide lightning-fast, 100% private file conversion tools that run entirely in your browser.',
  alternates: {
    canonical: 'https://pressto.dev/about',
  },
};

export default function AboutPage() {
  return (
    <div className="w-full max-w-[768px] mx-auto px-4 py-12 md:py-24 text-ink motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-300 ease-out">
      <div className="prose prose-slate max-w-none">
        <h1 className="text-4xl md:text-5xl font-display font-medium mb-8">About Pressto</h1>
        
        <p className="text-xl text-ink-muted mb-8 leading-relaxed">
          Pressto was built with a simple conviction: you shouldn&apos;t have to upload your personal files, sensitive documents, and private photos to a remote server just to resize an image or convert a PDF.
        </p>

        <h2 className="text-2xl font-display font-medium mt-12 mb-4">The Privacy Problem</h2>
        <p className="mb-4">
          Most online file conversion tools work the same way: you upload your file to their server, they process it in the cloud, and you download the result. 
          This approach has massive privacy implications. When you upload a scanned contract, a family photo, or a financial document to a free online converter, you are surrendering your data to an unknown server.
        </p>
        <p className="mb-6">
          Even if they promise to delete it, the file still travels across the internet, sitting on a server out of your control.
        </p>

        <h2 className="text-2xl font-display font-medium mt-12 mb-4">Our Solution: 100% Local Processing</h2>
        <p className="mb-4">
          Modern web browsers are incredibly powerful. Pressto harnesses advanced web technologies like WebAssembly (Wasm) and Web Workers to bring heavy file processing directly to your browser.
        </p>
        <p className="mb-6">
          When you drag and drop a file into Pressto, <strong>it never leaves your device.</strong> All the computation happens right inside your browser tab using your device&apos;s own processing power. 
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-8">
          <li><strong>Absolute Privacy:</strong> We don&apos;t have servers to store your files, meaning zero risk of data leaks.</li>
          <li><strong>Lightning Fast:</strong> By eliminating upload and download wait times, tools run instantly.</li>
          <li><strong>No Limits:</strong> We don&apos;t enforce arbitrary usage limits or demand you create an account.</li>
        </ul>

        <h2 className="text-2xl font-display font-medium mt-12 mb-4">Who Built This?</h2>
        <p className="mb-6">
          Pressto was built by a small team of independent developers who care deeply about web performance and user privacy. We wanted a tool we could trust with our own files, so we built it.
        </p>

        <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-8 mt-12 text-center">
          <h3 className="text-xl font-display font-medium mb-2">Have a question or feedback?</h3>
          <p className="text-ink-muted mb-6">We&apos;d love to hear from you. Drop us a line if you run into any bugs or have feature requests.</p>
          <a href="mailto:hello@pressto.dev" className="inline-block bg-primary hover:bg-primary-ink text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors">
            Contact the Team
          </a>
        </div>
      </div>
    </div>
  );
}
