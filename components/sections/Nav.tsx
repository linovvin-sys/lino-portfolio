'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { Container } from '@/components/ui/Container';
import { ArrowRight, Close, Mail, Menu, Sparkle } from '@/components/ui/Icons';
import { navigation } from '@/content/navigation';
import { profile } from '@/content/profile';
import { cn } from '@/lib/utils';

export const OPEN_PALETTE_EVENT = 'open-command-palette';

function initials(name: string) {
  // "Lino Vincent G. Dela Cruz" → "LD": first name + first word of the surname,
  // which follows the middle initial when there is one.
  const parts = name.split(' ').filter(Boolean);
  const middle = parts.findIndex((p) => p.endsWith('.'));
  const surname = middle >= 0 ? parts[middle + 1] : parts[parts.length - 1];
  return ((parts[0]?.[0] ?? '') + (surname?.[0] ?? '')).toUpperCase();
}

interface NavProps {
  /** Show the "Ask AI" trigger (only when the chat has an API key configured) */
  chatEnabled?: boolean;
}

export function Nav({ chatEnabled = false }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMac, setIsMac] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  // Each section now lives on its own route, so close the mobile drawer on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const openPalette = () => {
    setMenuOpen(false);
    window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile / tablet: slim fixed topbar + drawer. Replaced by the sidebar at lg+. */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[var(--z-nav)] transition-[background-color,border-color,backdrop-filter] duration-300 ease-[var(--ease-out)] lg:hidden',
          menuOpen
            ? 'border-b border-[var(--color-rule)] bg-[var(--color-bg)] shadow-[var(--shadow-pop)]'
            : scrolled
              ? 'border-b border-[var(--color-rule)] bg-[color-mix(in_oklab,var(--color-bg)_82%,transparent)] backdrop-blur-xl'
              : 'border-b border-transparent',
        )}
      >
        <Container>
          <nav aria-label="Primary" className="flex h-[var(--nav-height)] items-center justify-between gap-6">
            <Link href="/" className="group flex items-center gap-3" onClick={() => setMenuOpen(false)}>
              <span className="font-display flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-fg)] text-[15px] tracking-normal text-[var(--color-bg)] transition-transform duration-300 ease-[var(--ease-out)] group-hover:rotate-[-8deg]">
                {initials(profile.name)}
              </span>
              <span className="text-sm font-medium text-[var(--color-fg)]">{profile.name}</span>
            </Link>

            <div className="flex items-center gap-1">
              <SoundToggle />
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-fg)] transition-[background-color,transform] duration-[var(--dur-fast)] hover:bg-[var(--color-subtle)] active:scale-[0.94]"
              >
                {menuOpen ? <Close className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </nav>
        </Container>

        <div id="mobile-menu" hidden={!menuOpen} className="border-t border-[var(--color-rule)]">
          <Container className="py-4">
            <ul className="flex flex-col">
              {navigation.map((item, i) => (
                <li key={item.href} className="animate-dialog-in" style={{ animationDelay: `${i * 25}ms` }}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'location' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between border-b border-[var(--color-rule)] py-3.5 text-[length:var(--text-lg)] text-[var(--color-fg)] aria-[current=location]:text-[var(--color-accent)]"
                  >
                    {item.label}
                    <span className="font-mono text-xs text-[var(--color-muted)]">{item.index}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {chatEnabled && (
              <button
                type="button"
                onClick={openPalette}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[var(--color-rule)] bg-[var(--color-surface)] text-sm font-medium text-[var(--color-fg)] active:scale-[0.98]"
              >
                <Sparkle className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                Ask my AI assistant
              </button>
            )}
          </Container>
        </div>
      </header>

      {/* Desktop: fixed left sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-[var(--z-nav)] hidden w-[var(--sidebar-width)] flex-col border-r border-[var(--color-rule)] bg-[var(--color-bg)] lg:flex"
        aria-label="Primary"
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 py-8">
          <Link href="/" className="group flex items-center gap-3">
            <span className="font-display flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-fg)] text-[15px] tracking-normal text-[var(--color-bg)] transition-transform duration-300 ease-[var(--ease-out)] group-hover:rotate-[-8deg]">
              {initials(profile.name)}
            </span>
            <span className="text-sm font-medium text-[var(--color-fg)]">{profile.name}</span>
          </Link>

          <ul className="mt-10 flex flex-col gap-0.5">
            {navigation.map((item) => {
              const current = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? 'location' : undefined}
                    className={cn(
                      'flex items-center justify-between gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm transition-[background-color,color] duration-[var(--dur-fast)]',
                      current
                        ? 'bg-[var(--color-subtle)] text-[var(--color-fg)]'
                        : 'text-[var(--color-muted)] hover:bg-[var(--color-subtle)] hover:text-[var(--color-fg)]',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <ArrowRight
                        className={cn(
                          'h-3 w-3 shrink-0 text-[var(--color-accent)] transition-opacity duration-[var(--dur-fast)]',
                          current ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {item.label}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--color-muted)]">{item.index}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {chatEnabled && (
            <button
              type="button"
              onClick={openPalette}
              className="mt-4 flex items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-fg)] shadow-[var(--shadow-card)] transition-[border-color,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:border-[color-mix(in_oklab,var(--color-fg)_25%,var(--color-rule))] active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <Sparkle className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                Ask anything
              </span>
              <kbd className="rounded-full bg-[var(--color-subtle)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-muted)]">
                {isMac ? '⌘K' : 'Ctrl K'}
              </kbd>
            </button>
          )}

          <div className="mt-auto pt-8">
            <div className="flex items-center justify-between border-t border-[var(--color-rule)] pt-4">
              <span className="text-xs text-[var(--color-muted)]">Theme</span>
              <div className="flex items-center gap-1">
                <SoundToggle />
                <ThemeToggle />
              </div>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-[var(--color-muted)]">
              For OJT, collabs and everything else, reach me at
            </p>
            <a
              href={`mailto:${profile.links.email}`}
              className="link-underline mt-1 inline-flex items-start gap-1.5 break-all text-[13px] text-[var(--color-fg)]"
            >
              <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {profile.links.email}
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
