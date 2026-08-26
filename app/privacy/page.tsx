import { Metadata } from 'next';

import { constructMetadata } from '@/lib/tools/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Privacy Policy | Cluster Tools',
  description: 'Our privacy policy is simple: your files never leave your device. Read the details of how Cluster Tools protects your data.',
  url: 'https://clustertools.online/privacy',
  category: 'Privacy',
});

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-[768px] mx-auto px-5 md:px-4 py-10 md:py-24 text-ink motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-300 ease-out text-left">
      <div className="prose prose-slate max-w-none prose-p:text-[15px] md:prose-p:text-base prose-p:leading-[1.7] prose-li:text-[15px] md:prose-li:text-base prose-li:leading-[1.7]">
        <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 md:mb-8 tracking-tight">Privacy Policy</h1>
        <p className="text-ink-muted mb-6 md:mb-8 text-[13px] md:text-base">Last Updated: August 24, 2026</p>
        
        <p className="text-lg md:text-xl font-medium mb-8 md:mb-10 leading-[1.6] md:leading-snug">
          Our privacy policy can be summarized in one sentence:<br className="hidden sm:block" /> <strong>Your files never leave your device.</strong>
        </p>

        <h2 className="text-xl md:text-2xl font-display font-semibold mt-10 md:mt-12 mb-3 md:mb-4 tracking-tight">1. Local Processing (No File Uploads)</h2>
        <p className="mb-5 md:mb-6">
          Unlike traditional cloud-based tools, Cluster Tools processes all files entirely within your web browser using client-side technologies (such as WebAssembly and Web Workers). 
          When you use our tools to convert, compress, resize, or edit a file, that file is <strong>never uploaded to our servers</strong>. It is read locally by your browser, processed locally, and saved locally. We have no technical capability to view, store, or share the files you process.
        </p>

        <h2 className="text-xl md:text-2xl font-display font-semibold mt-10 md:mt-12 mb-3 md:mb-4 tracking-tight">2. Analytics and Tracking</h2>
        <p className="mb-3 md:mb-4">
          To understand how our tools are used and to improve the service, we use privacy-friendly, anonymized analytics (such as Vercel Web Analytics). 
          This collects basic, non-personally identifiable information such as:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-5 md:mb-6">
          <li>Page views and navigation paths</li>
          <li>General geographic region (country level)</li>
          <li>Browser and device type</li>
        </ul>
        <p className="mb-5 md:mb-6">
          This analytics data contains no information about the files you process or your specific identity.
        </p>

        <h2 className="text-xl md:text-2xl font-display font-semibold mt-10 md:mt-12 mb-3 md:mb-4 tracking-tight">3. Cookies</h2>
        <p className="mb-5 md:mb-6">
          Cluster Tools does not use tracking cookies or advertising cookies. Any local storage used by the site is strictly functional (for example, temporarily holding a file in memory while it is being processed by a tool in your active session).
        </p>

        <h2 className="text-xl md:text-2xl font-display font-semibold mt-10 md:mt-12 mb-3 md:mb-4 tracking-tight">4. Third-Party Links</h2>
        <p className="mb-5 md:mb-6">
          Our website may contain links to external sites that are not operated by us. Please be aware that we have no control over the content and policies of those sites, and cannot accept responsibility or liability for their respective privacy practices.
        </p>

        <h2 className="text-xl md:text-2xl font-display font-semibold mt-10 md:mt-12 mb-3 md:mb-4 tracking-tight">5. Contact Us</h2>
        <p className="mb-5 md:mb-6">
          If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <a href="mailto:privacy@clustertools.online" className="text-primary hover:underline">privacy@clustertools.online</a>.
        </p>
      </div>
    </div>
  );
}
