'use client';

import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Container } from '@/components/ui/Container';
import { Close, Menu, Sparkle } from '@/components/ui/Icons';
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

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);

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

  const openPalette = () => {
    setMenuOpen(false);
    window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[var(--z-nav)] transition-[background-color,border-color,backdrop-filter] duration-300 ease-[var(--ease-out)]',
        menuOpen
          ? 'border-b border-[var(--color-rule)] bg-[var(--color-bg)] shadow-[var(--shadow-pop)]'
          : scrolled
            ? 'border-b border-[var(--color-rule)] bg-[color-mix(in_oklab,var(--color-bg)_82%,transparent)] backdrop-blur-xl'
            : 'border-b border-transparent',
      )}
    >
      <Container>
        <nav aria-label="Primary" className="flex h-[var(--nav-height)] items-center justify-between gap-6">
          <a href="#hero" className="group flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <span className="font-display flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-fg)] text-[15px] tracking-normal text-[var(--color-bg)] transition-transform duration-300 ease-[var(--ease-out)] group-hover:rotate-[-8deg]">
              {initials(profile.name)}
            </span>
            <span className="hidden text-sm font-medium text-[var(--color-fg)] sm:block lg:hidden xl:block">{profile.name}</span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3 py-2 text-sm text-[var(--color-muted)] transition-colors duration-[var(--dur-fast)] hover:text-[var(--color-fg)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={openPalette}
              className="hidden h-9 items-center gap-2 rounded-full border border-[var(--color-rule)] bg-[var(--color-surface)] pl-3 pr-1.5 text-sm text-[var(--color-fg)] shadow-[var(--shadow-card)] transition-[border-color,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:border-[color-mix(in_oklab,var(--color-fg)_25%,var(--color-rule))] active:scale-[0.97] md:inline-flex"
            >
              <Sparkle className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              Ask AI
              <kbd className="ml-1 rounded-full bg-[var(--color-subtle)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-muted)]">
                {isMac ? '⌘K' : 'Ctrl K'}
              </kbd>
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-fg)] transition-[background-color,transform] duration-[var(--dur-fast)] hover:bg-[var(--color-subtle)] active:scale-[0.94] lg:hidden"
            >
              {menuOpen ? <Close className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </Container>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-[var(--color-rule)] lg:hidden"
      >
        <Container className="py-4">
          <ul className="flex flex-col">
            {navigation.map((item, i) => (
              <li key={item.href} className="animate-dialog-in" style={{ animationDelay: `${i * 25}ms` }}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-[var(--color-rule)] py-3.5 text-[length:var(--text-lg)] text-[var(--color-fg)]"
                >
                  {item.label}
                  <span className="font-mono text-xs text-[var(--color-muted)]">{item.index}</span>
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={openPalette}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[var(--color-rule)] bg-[var(--color-surface)] text-sm font-medium text-[var(--color-fg)] active:scale-[0.98]"
          >
            <Sparkle className="h-3.5 w-3.5 text-[var(--color-accent)]" />
            Ask my AI assistant
          </button>
        </Container>
      </div>
    </header>
  );
}
