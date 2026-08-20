import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Pressto',
  description: 'Terms of service and usage conditions for Pressto.',
  alternates: {
    canonical: 'https://pressto.dev/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="w-full max-w-[768px] mx-auto px-4 py-12 md:py-24 text-ink motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-300 ease-out">
      <div className="prose prose-slate max-w-none">
        <h1 className="text-4xl md:text-5xl font-display font-medium mb-8">Terms of Service</h1>
        <p className="text-ink-muted mb-8">Last Updated: August 20, 2026</p>

        <h2 className="text-2xl font-display font-medium mt-12 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-6">
          By accessing and using Pressto (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our service.
        </p>

        <h2 className="text-2xl font-display font-medium mt-12 mb-4">2. Description of Service</h2>
        <p className="mb-6">
          Pressto provides a suite of browser-based file manipulation tools (including but not limited to image compression, format conversion, and PDF utilities). All processing is performed locally on your device using client-side technologies.
        </p>

        <h2 className="text-2xl font-display font-medium mt-12 mb-4">3. User Responsibility</h2>
        <p className="mb-4">
          Because Pressto processes files locally on your hardware, you are solely responsible for:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>The content and legality of the files you process.</li>
          <li>Ensuring you have the legal right to modify or convert the files you use with our tools.</li>
          <li>Any outcomes resulting from the processing of your files (e.g., unintended data loss during compression).</li>
        </ul>

        <h2 className="text-2xl font-display font-medium mt-12 mb-4">4. &quot;As Is&quot; Service</h2>
        <p className="mb-6">
          The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. Pressto makes no warranties, expressed or implied, and hereby disclaims all warranties, including without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property. We do not warrant that the results of the use of the tools will be perfectly accurate, reliable, or error-free on all devices and browsers.
        </p>

        <h2 className="text-2xl font-display font-medium mt-12 mb-4">5. Limitation of Liability</h2>
        <p className="mb-6">
          In no event shall Pressto or its creators be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>

        <h2 className="text-2xl font-display font-medium mt-12 mb-4">6. Changes to Terms</h2>
        <p className="mb-6">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide reasonable notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>

        <h2 className="text-2xl font-display font-medium mt-12 mb-4">7. Contact</h2>
        <p className="mb-6">
          If you have any questions about these Terms, please contact us at <a href="mailto:hello@pressto.dev" className="text-primary hover:underline">hello@pressto.dev</a>.
        </p>
      </div>
    </div>
  );
}
