'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface StreamLine {
  /** Model-style confidence shown next to the line */
  p: number;
  text: string;
}

interface TokenStreamProps {
  lines: StreamLine[];
  className?: string;
  /** ms before the first token */
  startDelay?: number;
}

/** Split into word-ish tokens that keep their trailing whitespace, like a tokenizer would. */
function tokenize(text: string) {
  return text.match(/\S+\s*/g) ?? [text];
}

/**
 * Streams each line in token by token, the way an LLM response arrives,
 * then settles with a blinking caret. Plays once when scrolled into view.
 * Server render and reduced motion show the finished text, so nothing is
 * hidden from crawlers or no-JS visitors.
 */
export function TokenStream({ lines, className, startDelay = 700 }: TokenStreamProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tokens = useRef(lines.map((l) => tokenize(l.text)));
  // counts[i] = number of tokens of line i currently visible
  const [counts, setCounts] = useState<number[]>(() => tokens.current.map((t) => t.length));
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setCounts(tokens.current.map(() => 0));
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const run = (line: number, token: number) => {
      if (cancelled) return;
      if (line >= tokens.current.length) {
        setActive(tokens.current.length - 1);
        return;
      }
      setActive(line);
      const lineTokens = tokens.current[line] ?? [];
      if (token > lineTokens.length) {
        timer = setTimeout(() => run(line + 1, 0), 380);
        return;
      }
      setCounts((prev) => prev.map((c, i) => (i === line ? token : c)));
      // Slight jitter so it reads as streamed, not typed by a metronome
      timer = setTimeout(() => run(line, token + 1), 55 + Math.random() * 70);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect();
          timer = setTimeout(() => run(0, 0), startDelay);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(root);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [startDelay]);

  return (
    <div ref={rootRef} className={cn('font-mono text-[13px] leading-relaxed', className)}>
      {lines.map((line, i) => {
        const lineTokens = tokens.current[i] ?? [];
        const shown = counts[i] ?? lineTokens.length;
        const started = shown > 0;
        const done = shown >= lineTokens.length;
        return (
          <div key={line.text} className="flex items-baseline gap-4">
            <span
              className={cn(
                'font-tabular w-[3.25rem] shrink-0 text-[var(--color-accent)] transition-opacity duration-300',
                started ? 'opacity-100' : 'opacity-0',
              )}
            >
              p={line.p.toFixed(2)}
            </span>
            <span className="relative min-w-0 text-[var(--color-fg)]">
              {/* Full text reserves the final width so nothing reflows while streaming */}
              <span aria-hidden="true" className="invisible">
                {line.text}
                {/* room for the caret so the last word never wraps when it appears */}
                <span className="inline-block w-[0.6em]" />
              </span>
              <span className="absolute inset-0">
                <span className="sr-only">{line.text}</span>
                <span aria-hidden="true">
                  {lineTokens.slice(0, shown).map((tok, t) => (
                    <span key={t} className="animate-token-in">
                      {tok}
                    </span>
                  ))}
                  {active === i && (
                    <span
                      className={cn(
                        'ml-px inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] bg-[var(--color-fg)]',
                        done && 'animate-caret',
                      )}
                    />
                  )}
                </span>
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
