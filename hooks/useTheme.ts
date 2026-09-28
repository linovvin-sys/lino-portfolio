'use client';
import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  // Suppress every transition for the one frame the palette swaps, so
  // borders/backgrounds don't animate out of sync with each other.
  root.classList.add('theme-switching');
  root.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* storage unavailable — theme still applies for this visit */
  }
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'dark' : 'light');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, toggleTheme, mounted };
}
