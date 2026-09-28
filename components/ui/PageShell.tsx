import React from 'react';
import { Nav } from '@/components/sections/Nav';
import { env } from '@/lib/env';
import { Footer } from '@/components/sections/Footer';
import { CommandPalette } from '@/components/sections/CommandPalette';
import { SkipLink } from '@/components/ui/SkipLink';
import { Container } from '@/components/ui/Container';
import { ArrowLeft } from '@/components/ui/Icons';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { ScrollProgress } from '@/components/motion/ScrollProgress';

interface PageShellProps {
  children: React.ReactNode;
  back?: { href: string; label: string };
  size?: 'default' | 'narrow';
}

/** Shared chrome for secondary pages: same nav, back link, container and footer as the home page. */
export function PageShell({ children, back, size = 'default' }: PageShellProps) {
  const chatEnabled = Boolean(env.GEMINI_API_KEY);
  return (
    <>
      <SkipLink />
      <Nav chatEnabled={chatEnabled} />
      {chatEnabled && <CommandPalette />}
      <SmoothScroll />
      <ScrollProgress />
      <main id="main" className="pb-24 pt-[calc(var(--nav-height)+48px)] md:pb-32 md:pt-[calc(var(--nav-height)+72px)]">
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
      </main>
      <Footer bordered />
    </>
  );
}
