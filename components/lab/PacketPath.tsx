'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { labPanel } from './ui';

interface Hop {
  id: string;
  name: string;
  ip: string;
  /** Round-trip time to this hop in ms */
  rtt: number;
  x: number;
  y: number;
}

const PRIMARY: Hop[] = [
  { id: 'laptop', name: 'your-laptop', ip: '192.168.1.24', rtt: 0, x: 40, y: 120 },
  { id: 'home', name: 'home-router', ip: '192.168.1.1', rtt: 1.2, x: 150, y: 120 },
  { id: 'isp', name: 'isp-edge.mnl', ip: '100.64.12.1', rtt: 8.4, x: 260, y: 120 },
  { id: 'ix', name: 'ix.manila', ip: '203.190.0.9', rtt: 11.7, x: 370, y: 120 },
  { id: 'transit', name: 'transit.sin', ip: '62.115.40.2', rtt: 38.6, x: 480, y: 70 },
  { id: 'cdn', name: 'edge.sin.cdn', ip: '151.101.1.1', rtt: 41.2, x: 590, y: 120 },
  { id: 'server', name: 'app-server', ip: '10.42.16.37', rtt: 42.0, x: 700, y: 120 },
];

const BACKUP: Hop = { id: 'backup', name: 'transit.hkg', ip: '80.81.192.4', rtt: 52.3, x: 480, y: 175 };

const HOP_MS = 520;

export function PacketPath() {
  const [failed, setFailed] = useState(false);
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [runId, setRunId] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const path = failed ? PRIMARY.map((h) => (h.id === 'transit' ? BACKUP : h)) : PRIMARY;
  const cdnDelta = failed ? BACKUP.rtt - PRIMARY[4]!.rtt : 0;
  const rttFor = (hop: Hop) => (failed && (hop.id === 'cdn' || hop.id === 'server') ? hop.rtt + cdnDelta : hop.rtt);

  useEffect(() => () => clearTimeout(timer.current), []);

  const send = () => {
    clearTimeout(timer.current);
    setTimedOut(false);
    setRunning(true);
    setRunId((r) => r + 1);
    setStep(0);
    let i = 0;
    const next = () => {
      i += 1;
      if (i >= path.length) {
        setRunning(false);
        return;
      }
      setStep(i);
      timer.current = setTimeout(next, HOP_MS);
    };
    timer.current = setTimeout(next, HOP_MS);
  };

  const toggleFailure = () => {
    clearTimeout(timer.current);
    setRunning(false);
    setStep(-1);
    setFailed((f) => !f);
    setTimedOut(!failed);
  };

  const current = step >= 0 ? path[Math.min(step, path.length - 1)] : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={send} disabled={running}>
          {running ? 'Tracing…' : step >= path.length - 1 ? 'Trace again' : 'Send packet'}
        </Button>
        <Button variant="secondary" onClick={toggleFailure}>
          {failed ? 'Restore Singapore transit' : 'Fail Singapore transit'}
        </Button>
        {failed && (
          <span className="text-[13px] text-[var(--color-muted)]">BGP withdrew the route. Traffic now goes via Hong Kong.</span>
        )}
      </div>

      <div className={cn(labPanel, 'overflow-x-auto p-3')}>
        <svg viewBox="0 0 740 210" className="h-auto w-full min-w-[560px]" role="img" aria-label="Network path from your laptop to the app server">
          {/* links */}
          {PRIMARY.slice(1).map((hop, i) => {
            const prev = PRIMARY[i]!;
            const viaTransit = hop.id === 'transit' || prev.id === 'transit';
            return (
              <line
                key={hop.id}
                x1={prev.x}
                y1={prev.y}
                x2={hop.x}
                y2={hop.y}
                strokeWidth={1.5}
                strokeDasharray={viaTransit && failed ? '4 5' : undefined}
                className={cn(
                  'transition-[stroke,opacity] duration-300',
                  viaTransit && failed ? 'stroke-[var(--color-accent)] opacity-60' : 'stroke-[var(--color-rule)]',
                )}
              />
            );
          })}
          {[PRIMARY[3]!, PRIMARY[5]!].map((end, i) => (
            <line
              key={`b${i}`}
              x1={i === 0 ? end.x : BACKUP.x}
              y1={i === 0 ? end.y : BACKUP.y}
              x2={i === 0 ? BACKUP.x : end.x}
              y2={i === 0 ? BACKUP.y : end.y}
              strokeWidth={1.5}
              strokeDasharray={failed ? undefined : '3 5'}
              className={cn('transition-[stroke] duration-300', failed ? 'stroke-[var(--color-fg)]' : 'stroke-[var(--color-rule)]')}
            />
          ))}

          {/* nodes */}
          {[...PRIMARY, BACKUP].map((hop) => {
            const onPath = path.some((h) => h.id === hop.id);
            const reached = onPath && step >= 0 && path.findIndex((h) => h.id === hop.id) <= step;
            const down = failed && hop.id === 'transit';
            return (
              <g key={hop.id} className="transition-opacity duration-300" opacity={onPath || hop.id === 'transit' ? 1 : 0.45}>
                <circle
                  cx={hop.x}
                  cy={hop.y}
                  r={9}
                  className={cn(
                    'transition-[fill,stroke] duration-300',
                    down
                      ? 'fill-[var(--color-bg)] stroke-[var(--color-accent)]'
                      : reached
                        ? 'fill-[var(--color-fg)] stroke-[var(--color-fg)]'
                        : 'fill-[var(--color-bg)] stroke-[var(--color-muted)]',
                  )}
                  strokeWidth={1.5}
                />
                {down && (
                  <path d={`M${hop.x - 4} ${hop.y - 4}l8 8m0-8l-8 8`} className="stroke-[var(--color-accent)]" strokeWidth={1.5} />
                )}
                <text x={hop.x} y={hop.y + (hop.y < 100 ? -18 : 27)} textAnchor="middle" className="fill-[var(--color-fg)] font-mono" fontSize={10}>
                  {hop.name}
                </text>
              </g>
            );
          })}

          {/* the packet */}
          {current && (
            <circle
              key={runId}
              r={5}
              cx={0}
              cy={0}
              className="fill-[var(--color-accent)]"
              style={{
                transform: `translate(${current.x}px, ${current.y}px)`,
                transition: `transform ${HOP_MS}ms var(--ease-in-out)`,
              }}
            />
          )}
        </svg>
      </div>

      <div className={cn(labPanel, 'overflow-x-auto p-4 font-mono text-[13px] leading-6')}>
        <p className="text-[var(--color-muted)]">$ traceroute app-server</p>
        {timedOut && step < 0 && (
          <p className="text-[var(--color-accent)]">%BGP-5-ADJCHANGE: neighbor 62.115.40.2 Down — route withdrawn</p>
        )}
        {path.slice(1).map((hop, i) => {
          const shown = step >= i + 1;
          return (
            <p
              key={hop.id}
              className={cn('grid min-w-max grid-cols-[1.5rem_9rem_8rem_1fr] transition-opacity duration-300', shown ? 'opacity-100' : 'opacity-0')}
            >
              <span className="text-[var(--color-muted)]">{i + 1}</span>
              <span className="text-[var(--color-fg)]">{hop.name}</span>
              <span className="text-[var(--color-muted)]">{hop.ip}</span>
              <span className="font-tabular text-[var(--color-fg)]">{rttFor(hop).toFixed(1)} ms</span>
            </p>
          );
        })}
      </div>
    </div>
  );
}
