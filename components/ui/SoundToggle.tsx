'use client';

import { useEffect, useState } from 'react';
import { HOVER_SOUND_EVENT, isHoverSoundEnabled, primeHoverSound, setHoverSoundEnabled } from '@/lib/hoverSound';
import { SpeakerOff, SpeakerOn } from './Icons';
import { cn } from '@/lib/utils';

export function SoundToggle({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEnabled(isHoverSoundEnabled());
    const onToggle = (e: Event) => setEnabled(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener(HOVER_SOUND_EVENT, onToggle);
    return () => window.removeEventListener(HOVER_SOUND_EVENT, onToggle);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        primeHoverSound();
        setHoverSoundEnabled(!enabled);
      }}
      aria-label={mounted ? `Turn hover sound ${enabled ? 'off' : 'on'}` : 'Toggle hover sound'}
      aria-pressed={enabled}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-muted)]',
        'transition-[color,background-color,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)]',
        'hover:bg-[var(--color-subtle)] hover:text-[var(--color-fg)] active:scale-[0.9]',
        className,
      )}
    >
      {enabled ? <SpeakerOn className="h-4 w-4" /> : <SpeakerOff className="h-4 w-4" />}
    </button>
  );
}
