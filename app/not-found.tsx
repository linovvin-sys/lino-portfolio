import { Button } from '@/components/ui/Button';
import { ArrowLeft } from '@/components/ui/Icons';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-6 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="font-display mt-4 text-[clamp(3rem,2rem+5vw,6rem)] leading-none text-[var(--color-fg)]">
        Page not found
      </h1>
      <p className="mt-5 max-w-md text-[length:var(--text-md)] leading-relaxed text-[var(--color-muted)]">
        Hallucination detected: this page doesn&apos;t exist in the latent space.
      </p>
      <Button href="/" size="lg" className="mt-10">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Button>
    </main>
  );
}
