'use client';

import { useTheme } from '@/hooks/useTheme';
import { Button } from './Button';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 rounded-full p-0"
      onClick={toggleTheme}
      aria-label={mounted ? `Switch theme to ${theme === 'dark' ? 'light' : 'dark'}` : 'Toggle theme'}
    >
      <svg
        className="h-4 w-4 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <svg
        className="hidden h-4 w-4 dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </Button>
  );
}
