import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[var(--color-bg)]">
      <h1 className="text-8xl md:text-[12rem] font-display mb-6 tracking-tighter text-[var(--color-fg)]">
        404
      </h1>
      <p className="text-xl md:text-2xl font-mono text-[var(--color-muted)] mb-8">
        Hallucination detected: this page doesn't exist in the latent space.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 border border-[var(--color-rule)] rounded-full hover:bg-[var(--color-surface)] transition-colors font-medium text-[var(--color-fg)]"
      >
        Return to Baseline
      </Link>
    </div>
  );
}
