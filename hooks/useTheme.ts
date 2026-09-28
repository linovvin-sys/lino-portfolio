'use client';
import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

function setThemeAttribute(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* storage unavailable — theme still applies for this visit */
  }
}

/** Instant swap with every transition suppressed for one frame, so colors don't animate out of sync. */
function swapInstantly(theme: Theme) {
  const root = document.documentElement;
  root.classList.add('theme-switching');
  setThemeAttribute(theme);
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
}

/**
 * Circular reveal from (x, y): the new theme grows out of the toggle button.
 * Uses the View Transitions API; browsers without it (or with reduced motion)
 * fall back to the instant swap.
 */
function swapWithReveal(theme: Theme, x: number, y: number) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || typeof document.startViewTransition !== 'function') {
    swapInstantly(theme);
    return;
  }

  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const root = document.documentElement;
  root.classList.add('theme-switching');

  const transition = document.startViewTransition(() => setThemeAttribute(theme));
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 620, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => {
      /* transition skipped — the theme is already applied */
    });
  transition.finished.finally(() => root.classList.remove('theme-switching'));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'dark' : 'light');
  }, []);

  /** Pass the click (or the button element) so the reveal starts from the toggle. */
  const toggleTheme = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = theme === 'light' ? 'dark' : 'light';
      setTheme(next);
      swapWithReveal(next, origin?.x ?? window.innerWidth - 48, origin?.y ?? 32);
    },
    [theme],
  );

  return { theme, toggleTheme, mounted };
}
