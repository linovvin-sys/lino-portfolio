'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NetworkTopology, type TopologyEvent } from './NetworkTopology';
import { Terminal, type TerminalLine } from './Terminal';
import { cn } from '@/lib/utils';

/** Plays once when the lab scrolls into view: a ping, a health check, then a hint to interact. */
const BOOT: Omit<TerminalLine, 'id'>[] = [
  { text: 'ping -c 3 10.42.1.10', tone: 'command' },
  { text: '3 packets transmitted, 3 received, 0% packet loss', tone: 'ok' },
  { text: 'show ip interface brief | include up', tone: 'command' },
  { text: '8 interfaces up/up · network healthy', tone: 'ok' },
  { text: '# hover the map · click a spine or edge to fail it · click a server to ping', tone: 'muted' },
];

/**
 * The interactive network simulation: live topology, link-health badge and a
 * terminal that narrates what happens. Self-contained so it can sit anywhere.
 */
export function NetworkLab({ className }: { className?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const nextId = useRef(BOOT.length);
  const [lines, setLines] = useState<TerminalLine[]>(() => BOOT.map((l, i) => ({ ...l, id: i })));
  const [health, setHealth] = useState({ up: 0, total: 0 });

  // Replay the boot sequence line by line once visible (server HTML already holds the final text)
  useEffect(() => {
    const el = rootRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setLines([]);
    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        let at = 500;
        BOOT.forEach((line, i) => {
          timers.push(setTimeout(() => setLines((prev) => [...prev, { ...line, id: i }]), at));
          // commands type at ~22ms/char (see Terminal); give output a beat after that
          at += line.tone === 'command' ? line.text.length * 22 + 450 : 700;
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const onEvent = useCallback((event: TopologyEvent) => {
    setLines((prev) => [...prev.slice(-20), { id: nextId.current++, text: event.text, tone: event.tone }]);
  }, []);
  const onHealthChange = useCallback((up: number, total: number) => setHealth({ up, total }), []);
  const degraded = health.total > 0 && health.up < health.total;

  return (
    <figure ref={rootRef} className={className}>
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between border-b border-[var(--color-rule)] px-5 py-3">
          <span className="eyebrow">Network lab</span>
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors duration-300',
              degraded
                ? 'bg-[color-mix(in_oklab,var(--color-accent)_12%,transparent)] text-[var(--color-accent)]'
                : 'bg-[color-mix(in_oklab,#10b981_12%,transparent)] text-emerald-700 dark:text-emerald-400',
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', degraded ? 'bg-[var(--color-accent)]' : 'bg-emerald-500')} />
            <span className="font-tabular">{health.total ? `${health.up}/${health.total} links up` : 'all links up'}</span>
          </span>
        </div>
        <NetworkTopology className="aspect-[480/330] w-full px-2 pt-2" onEvent={onEvent} onHealthChange={onHealthChange} />
        <Terminal lines={lines} rows={5} />
      </div>
      <figcaption className="mt-3 text-[13px] text-[var(--color-muted)]">
        A small data-center network like the ones I’m learning to build. Break something and watch it route around the failure.
      </figcaption>
    </figure>
  );
}
