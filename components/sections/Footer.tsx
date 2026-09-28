'use client';

import { Container } from '@/components/ui/Container';
import { Grid } from '@/components/ui/Grid';
import { navigation } from '@/content/navigation';
import { profile } from '@/content/profile';

const SOCIALS = [
  { label: 'GitHub', href: profile.links.github },
  { label: 'LinkedIn', href: profile.links.linkedin },
  { label: 'X', href: profile.links.x },
].filter((s): s is { label: string; href: string } => Boolean(s.href));

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--color-bg)] text-[var(--color-fg)] border-t border-[var(--color-rule)] pt-16 pb-8">
      <Container>
        <Grid className="gap-12 mb-16">
          <div className="col-span-6 md:col-span-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-6">Sitemap</h4>
            <ul className="space-y-3 font-mono text-sm">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-[var(--color-accent)] transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 md:col-span-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-6">Connect</h4>
            <ul className="space-y-3 font-mono text-sm">
              {SOCIALS.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent)] transition-colors">{item.label}</a>
                </li>
              ))}
              <li>
                <a href={`mailto:${profile.links.email}`} className="hover:text-[var(--color-accent)] transition-colors">Email</a>
              </li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-6 flex flex-col md:items-end justify-between">
            <button
              onClick={scrollToTop}
              className="font-mono text-sm w-fit border border-[var(--color-rule)] px-4 py-2 hover:bg-[var(--color-surface)] transition-colors"
            >
              ↑ Back to top
            </button>
          </div>
        </Grid>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-8 border-t border-[var(--color-rule)] gap-4 font-mono text-xs text-[var(--color-muted)]">
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p>
            Built with Next.js, TypeScript, GSAP. Set in Instrument Serif & General Sans.
          </p>
        </div>
      </Container>
    </footer>
  );
}
