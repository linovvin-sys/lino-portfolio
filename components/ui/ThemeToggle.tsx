'use client';

import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from './Icons';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={mounted ? `Switch theme to ${theme === 'dark' ? 'light' : 'dark'}` : 'Toggle theme'}
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-muted)]',
        'transition-[color,background-color,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)]',
        'hover:bg-[var(--color-subtle)] hover:text-[var(--color-fg)] active:scale-[0.94]',
        className,
      )}
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="hidden h-4 w-4 dark:block" />
    </button>
  );
}
