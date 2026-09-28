'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

const DAYS = 90;

/** Deterministic (seeded) 90-day history so server and client render the same bars. */
function history(): number[] {
  let seed = 0x1ee7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: DAYS }, (_, i) => {
    if (i === 23) return 99.62; // one real incident, with a postmortem
    const r = rand();
    return r > 0.93 ? 99.9 + rand() * 0.09 : 100;
  });
}

function tone(v: number) {
  if (v >= 99.99) return 'bg-emerald-500';
  if (v >= 99.9) return 'bg-emerald-500/60';
  return 'bg-amber-500';
}

/** Status-page style availability strip. Hover (or focus) a day for its number. */
export function UptimeBars({ className }: { className?: string }) {
  const days = useMemo(history, []);
  const [hover, setHover] = useState<number | null>(null);
  const average = days.reduce((a, b) => a + b, 0) / days.length;

  const label = (i: number) => {
    const d = new Date();
    d.setDate(d.getDate() - (DAYS - 1 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between text-[13px]">
        <span className="text-[var(--color-fg)]">Fabric availability</span>
        <span className="font-tabular text-[var(--color-muted)]">{average.toFixed(3)}% · 90 days</span>
      </div>
      <div className="relative mt-3" onPointerLeave={() => setHover(null)}>
        <div className="flex h-8 items-stretch gap-[2px]" role="img" aria-label={`Availability over the last 90 days: ${average.toFixed(3)}% average`}>
          {days.map((v, i) => (
            <span
              key={i}
              onPointerEnter={() => setHover(i)}
              className={cn(
                'flex-1 rounded-[1.5px] transition-[transform,opacity] duration-200 ease-[var(--ease-out)]',
                tone(v),
                hover !== null && hover !== i && 'opacity-50',
                hover === i && 'scale-y-110',
              )}
            />
          ))}
        </div>
        {hover !== null && (
          <div
            className="pointer-events-none absolute bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded-[var(--radius-sm)] bg-[var(--color-fg)] px-2 py-1 text-[11px] text-[var(--color-bg)] shadow-[var(--shadow-pop)]"
            style={{ left: `${((hover + 0.5) / DAYS) * 100}%` }}
          >
            {label(hover)} · <span className="font-tabular">{days[hover]!.toFixed(2)}%</span>
            {days[hover]! < 99.9 && ' · incident'}
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-[var(--color-muted)]">
        <span>90 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
