import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Pressto',
  description: 'Our privacy policy is simple: your files never leave your device. Read the details of how Pressto protects your data.',
  alternates: {
    canonical: 'https://pressto.dev/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-[768px] mx-auto px-4 py-12 md:py-24 text-ink motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-300 ease-out">
      <div className="prose prose-slate max-w-none">
        <h1 className="text-4xl md:text-5xl font-display font-medium mb-8">Privacy Policy</h1>
        <p className="text-ink-muted mb-8">Last Updated: August 20, 2026</p>
        
        <p className="text-xl font-medium mb-8">
          Our privacy policy can be summarized in one sentence: <strong>Your files never leave your device.</strong>
        </p>

        <h2 className="text-2xl font-display font-medium mt-12 mb-4">1. Local Processing (No File Uploads)</h2>
        <p className="mb-6">
          Unlike traditional cloud-based tools, Pressto processes all files entirely within your web browser using client-side technologies (such as WebAssembly and Web Workers). 
          When you use our tools to convert, compress, resize, or edit a file, that file is <strong>never uploaded to our servers</strong>. It is read locally by your browser, processed locally, and saved locally. We have no technical capability to view, store, or share the files you process.
        </p>

        <h2 className="text-2xl font-display font-medium mt-12 mb-4">2. Analytics and Tracking</h2>
        <p className="mb-4">
          To understand how our tools are used and to improve the service, we use privacy-friendly, anonymized analytics (such as Vercel Web Analytics). 
          This collects basic, non-personally identifiable information such as:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>Page views and navigation paths</li>
          <li>General geographic region (country level)</li>
          <li>Browser and device type</li>
        </ul>
        <p className="mb-6">
          This analytics data contains no information about the files you process or your specific identity.
        </p>

        <h2 className="text-2xl font-display font-medium mt-12 mb-4">3. Cookies</h2>
        <p className="mb-6">
          Pressto does not use tracking cookies or advertising cookies. Any local storage used by the site is strictly functional (for example, temporarily holding a file in memory while it is being processed by a tool in your active session).
        </p>

        <h2 className="text-2xl font-display font-medium mt-12 mb-4">4. Third-Party Links</h2>
        <p className="mb-6">
          Our website may contain links to external sites that are not operated by us. Please be aware that we have no control over the content and policies of those sites, and cannot accept responsibility or liability for their respective privacy practices.
        </p>

        <h2 className="text-2xl font-display font-medium mt-12 mb-4">5. Contact Us</h2>
        <p className="mb-6">
          If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <a href="mailto:privacy@pressto.dev" className="text-primary hover:underline">privacy@pressto.dev</a>.
        </p>
      </div>
    </div>
  );
}
