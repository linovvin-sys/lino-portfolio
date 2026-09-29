import React from 'react';
import { Nav } from '@/components/sections/Nav';
import { geminiApiKey } from '@/lib/env';
import { Footer } from '@/components/sections/Footer';
import { CommandPalette } from '@/components/sections/CommandPalette';
import { SkipLink } from '@/components/ui/SkipLink';
import { Container } from '@/components/ui/Container';
import { RevealObserver } from '@/components/ui/RevealObserver';
import { ArrowLeft } from '@/components/ui/Icons';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { ScrollProgress } from '@/components/motion/ScrollProgress';

interface PageShellProps {
  children: React.ReactNode;
  back?: { href: string; label: string };
  size?: 'default' | 'narrow';
  /**
   * false for a `<Section>`-based page (About, Roadmap, ...) that already
   * renders its own full-bleed Container — wrapping it again would double
   * the max-width/padding. Defaults to true for plain content children
   * (résumé, case studies, lab experiments) that need the Container here.
   */
  container?: boolean;
}

/** Shared chrome for secondary pages: same nav, back link, container and footer as the home page. */
export function PageShell({ children, back, size = 'default', container = true }: PageShellProps) {
  const chatEnabled = Boolean(geminiApiKey);
  return (
    <>
      <SkipLink />
      <Nav chatEnabled={chatEnabled} />
      {chatEnabled && <CommandPalette />}
      <RevealObserver />
      <SmoothScroll />
      <ScrollProgress />
      <main
        id="main"
        className="pb-24 pt-[calc(var(--nav-height)+48px)] md:pb-32 md:pt-[calc(var(--nav-height)+72px)] lg:pl-[var(--sidebar-width)] lg:pt-16"
      >
        {container ? (
          <Container size={size}>
            {back && (
              <a
                href={back.href}
                className="group mb-10 inline-flex items-center gap-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-x-0.5" />
                {back.label}
              </a>
            )}
            {children}
          </Container>
        ) : (
          children
        )}
      </main>
      <Footer bordered />
    </>
  );
}
