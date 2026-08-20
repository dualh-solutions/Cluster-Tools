import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-[448px] w-full bg-surface border border-border rounded-[var(--radius-lg)] p-8 md:p-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
        <h2 className="font-display text-3xl font-medium text-ink mb-2">404 - Not Found</h2>
        <p className="text-ink-muted mb-8">
          The tool or page you are looking for does not exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-ink text-surface px-6 py-2.5 rounded-[var(--radius-sm)] font-medium transition-colors"
        >
          <Home size={18} />
          Back to Tools
        </Link>
      </div>
    </div>
  );
}
