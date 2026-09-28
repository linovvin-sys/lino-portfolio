'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TerminalLine {
  id: number;
  text: string;
  tone?: 'default' | 'ok' | 'warn' | 'error' | 'muted' | 'command';
}

const TONE: Record<NonNullable<TerminalLine['tone']>, string> = {
  default: 'text-[#e9e7e1]',
  command: 'text-[#e9e7e1]',
  muted: 'text-[#8f8c85]',
  ok: 'text-emerald-400',
  warn: 'text-amber-300',
  error: 'text-[#ff7a57]',
};

/** A command line types itself out; everything else fades in. */
function Line({ line, animate }: { line: TerminalLine; animate: boolean }) {
  const typed = line.tone === 'command' && animate;
  const [shown, setShown] = useState(typed ? 0 : line.text.length);

  useEffect(() => {
    if (!typed) return;
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= line.text.length) clearInterval(timer);
    }, 22);
    return () => clearInterval(timer);
  }, [typed, line.text]);

  return (
    <p className={cn('whitespace-pre-wrap break-words', TONE[line.tone ?? 'default'], animate && !typed && 'animate-token-in')}>
      {line.tone === 'command' && <span className="text-emerald-400">❯ </span>}
      {line.text.slice(0, shown)}
    </p>
  );
}

interface TerminalProps {
  lines: TerminalLine[];
  title?: string;
  /** how many lines stay visible */
  rows?: number;
  className?: string;
}

/**
 * Always-dark terminal pane. Append lines to the array and they animate in;
 * the pane keeps the last `rows` lines, so height never changes.
 */
export function Terminal({ lines, title = 'noc@lino — zsh', rows = 6, className }: TerminalProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const visible = lines.slice(-rows);

  return (
    <div className={cn('bg-[#0d0d0c] font-mono text-[11.5px] leading-[1.7] sm:text-[12px]', className)}>
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </span>
        <span className="text-[10.5px] text-[#8f8c85]">{title}</span>
        <span className="w-8" />
      </div>
      {/* Fixed height, bottom-anchored: new lines push old ones up and out */}
      <div
        className="flex flex-col justify-end overflow-hidden px-4 py-3"
        style={{ height: `calc(${rows + 1} * 1.7em + 1.5rem)` }}
        role="log"
        aria-live="polite"
      >
        {visible.map((line) => (
          <Line key={line.id} line={line} animate={animate} />
        ))}
        <span aria-hidden="true" className="animate-caret mt-0.5 block h-[1.1em] w-[0.55em] shrink-0 bg-[#e9e7e1]/80" />
      </div>
    </div>
  );
}
