'use client';

import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from './Icons';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Keyboard activation reports 0,0 — start the reveal from the button's center instead
    const rect = e.currentTarget.getBoundingClientRect();
    const fromPointer = e.clientX !== 0 || e.clientY !== 0;
    toggleTheme({
      x: fromPointer ? e.clientX : rect.left + rect.width / 2,
      y: fromPointer ? e.clientY : rect.top + rect.height / 2,
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={mounted ? `Switch theme to ${theme === 'dark' ? 'light' : 'dark'}` : 'Toggle theme'}
      className={cn(
        'group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-[var(--color-muted)]',
        'transition-[color,background-color,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)]',
        'hover:bg-[var(--color-subtle)] hover:text-[var(--color-fg)] active:scale-[0.9]',
        className,
      )}
    >
      {/* Sun spins out and the moon rises in; both stay mounted so they can animate */}
      <Sun
        className={cn(
          'theme-icon absolute h-4 w-4 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          'rotate-0 scale-100 opacity-100 group-hover:rotate-45',
          'dark:-rotate-90 dark:scale-0 dark:opacity-0',
        )}
      />
      <Moon
        className={cn(
          'theme-icon absolute h-4 w-4 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          'translate-y-3 rotate-90 scale-50 opacity-0',
          'dark:translate-y-0 dark:rotate-0 dark:scale-100 dark:opacity-100 dark:group-hover:-rotate-12',
        )}
      />
    </button>
  );
}
