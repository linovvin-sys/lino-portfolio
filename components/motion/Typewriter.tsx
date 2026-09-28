'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterProps {
  /** Phrases to cycle through, in order. The first one is what's in the server HTML. */
  phrases: string[];
  className?: string;
  /** ms per character while typing / deleting */
  typeSpeed?: number;
  deleteSpeed?: number;
  /** ms to hold a finished phrase before deleting it */
  holdFor?: number;
  /** ms before the first phrase starts typing */
  startDelay?: number;
}

/**
 * Types a phrase, holds it, deletes it, then types the next — forever.
 * Screen readers get the first phrase as plain text; the animated copy is
 * hidden from them. Under reduced motion it simply shows the first phrase.
 */
export function Typewriter({
  phrases,
  className,
  typeSpeed = 60,
  deleteSpeed = 32,
  holdFor = 1900,
  startDelay = 900,
}: TypewriterProps) {
  const first = phrases[0] ?? '';
  const [text, setText] = useState(first);

  useEffect(() => {
    if (phrases.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer: ReturnType<typeof setTimeout>;
    let index = 0;
    let shown = 0;
    let deleting = false;

    const tick = () => {
      const phrase = phrases[index] ?? '';
      if (!deleting) {
        shown += 1;
        setText(phrase.slice(0, shown));
        if (shown >= phrase.length) {
          deleting = true;
          timer = setTimeout(tick, holdFor);
          return;
        }
        // tiny jitter so it feels typed by a person, not a metronome
        timer = setTimeout(tick, typeSpeed + Math.random() * 40);
      } else {
        shown -= 1;
        setText(phrase.slice(0, shown));
        if (shown <= 0) {
          deleting = false;
          index = (index + 1) % phrases.length;
          timer = setTimeout(tick, 380);
          return;
        }
        timer = setTimeout(tick, deleteSpeed);
      }
    };

    setText('');
    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
  }, [phrases, typeSpeed, deleteSpeed, holdFor, startDelay]);

  return (
    <span className={cn('inline-flex items-baseline', className)}>
      <span className="sr-only">{first}</span>
      <span aria-hidden="true" className="whitespace-pre">
        {text}
      </span>
      <span
        aria-hidden="true"
        className="animate-caret ml-0.5 inline-block h-[1em] w-[3px] translate-y-[0.12em] rounded-full bg-[var(--color-accent)]"
      />
    </span>
  );
}
