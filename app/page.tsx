import { Nav } from '@/components/sections/Nav';
import { geminiApiKey } from '@/lib/env';
import { Hero } from '@/components/sections/Hero';
import { Footer } from '@/components/sections/Footer';
import { SkipLink } from '@/components/ui/SkipLink';
import { RevealObserver } from '@/components/ui/RevealObserver';
import { CommandPalette } from '@/components/sections/CommandPalette';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { ScrollProgress } from '@/components/motion/ScrollProgress';

export default function Home() {
  const chatEnabled = Boolean(geminiApiKey);
  return (
    <>
      <SkipLink />
      <Nav chatEnabled={chatEnabled} />
      {chatEnabled && <CommandPalette />}
      <RevealObserver />
      <SmoothScroll />
      <ScrollProgress />

      <main id="main" className="lg:pl-[var(--sidebar-width)]">
        <Hero id="hero" />
      </main>

      <Footer />
    </>
  );
}
