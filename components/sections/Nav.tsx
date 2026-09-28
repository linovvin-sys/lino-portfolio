'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

interface NavProps {
  /** Show the "Ask AI" button (only when the chat has an API key configured) */
  chatEnabled?: boolean;
}

export function Nav({ chatEnabled = false }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Track which section is under the middle of the viewport
  useEffect(() => {
    const ids = navigation.map((item) => item.href.split('#')[1]).filter((id): id is string => Boolean(id));
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((el) => observer.observe(el));
    const onTop = () => window.scrollY < window.innerHeight * 0.5 && setActive(null);
    window.addEventListener('scroll', onTop, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onTop);
    };
  }, []);

  // Slide the highlight pill under the active link
  useLayoutEffect(() => {
    const measure = () => {
      const link = active ? listRef.current?.querySelector<HTMLElement>(`a[href$="#${active}"]`) : null;
      const item = link?.parentElement; // the <li>, whose offsetParent is the list
      setPill(item ? { left: item.offsetLeft, width: item.offsetWidth } : null);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

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

          <ul ref={listRef} className="relative hidden items-center gap-1 lg:flex">
            <li
              aria-hidden="true"
              className="absolute left-0 top-1/2 h-8 rounded-full bg-[var(--color-subtle)] transition-[transform,width,opacity] duration-500 ease-[var(--ease-out)]"
              style={{
                width: pill?.width ?? 0,
                transform: `translate(${pill?.left ?? 0}px, -50%)`,
                opacity: pill ? 1 : 0,
              }}
            />
            {navigation.map((item) => (
              <li key={item.href} className="relative">
                <a
                  href={item.href}
                  aria-current={active && item.href.endsWith(`#${active}`) ? 'location' : undefined}
                  className="block rounded-full px-3 py-2 text-sm text-[var(--color-muted)] transition-colors duration-[var(--dur-fast)] hover:text-[var(--color-fg)] aria-[current=location]:text-[var(--color-fg)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            {chatEnabled && (
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
            )}
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
  );
}
