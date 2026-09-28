'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { labLabel, labPanel, labRange, labSegment, labSegmented } from './ui';

type Algorithm = 'round-robin' | 'least-connections' | 'weighted';

interface Backend {
  id: string;
  name: string;
  weight: number;
  up: boolean;
  active: number;
  served: number;
}

interface Flight {
  id: number;
  backend: number;
  dropped: boolean;
}

const INITIAL: Backend[] = [
  { id: 'a', name: 'web-01', weight: 3, up: true, active: 0, served: 0 },
  { id: 'b', name: 'web-02', weight: 2, up: true, active: 0, served: 0 },
  { id: 'c', name: 'web-03', weight: 1, up: true, active: 0, served: 0 },
  { id: 'd', name: 'web-04', weight: 1, up: true, active: 0, served: 0 },
];

const LB = { x: 120, y: 130 };
const backendY = (i: number) => 40 + i * 60;
const BACKEND_X = 486;
const FLIGHT_MS = 650;

export function LoadBalancerSimulator() {
  const [algorithm, setAlgorithm] = useState<Algorithm>('round-robin');
  const [rate, setRate] = useState(6);
  const [backends, setBackends] = useState(INITIAL);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [dropped, setDropped] = useState(0);

  const state = useRef({ backends: INITIAL, rr: 0, wrr: 0, flightId: 0, algorithm, reduced: false });
  state.current.algorithm = algorithm;

  useEffect(() => {
    state.current.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const s = state.current;
      const healthy = s.backends.map((b, i) => ({ b, i })).filter(({ b }) => b.up);

      let pick = -1;
      if (healthy.length > 0) {
        if (s.algorithm === 'round-robin') {
          pick = healthy[s.rr % healthy.length]!.i;
          s.rr += 1;
        } else if (s.algorithm === 'least-connections') {
          pick = healthy.reduce((best, cur) => (cur.b.active < best.b.active ? cur : best)).i;
        } else {
          // Smooth weighted round robin over the healthy set
          const expanded = healthy.flatMap(({ b, i }) => Array.from({ length: b.weight }, () => i));
          pick = expanded[s.wrr % expanded.length]!;
          s.wrr += 1;
        }
      }

      const id = ++s.flightId;
      if (pick === -1) {
        setDropped((d) => d + 1);
      } else {
        // Requests take a random amount of time; web-01 is also the fastest box
        const duration = (1200 + Math.random() * 2600) / (pick === 0 ? 1.4 : 1);
        s.backends = s.backends.map((b, i) => (i === pick ? { ...b, active: b.active + 1, served: b.served + 1 } : b));
        setBackends(s.backends);
        setTimeout(() => {
          s.backends = s.backends.map((b, i) => (i === pick ? { ...b, active: Math.max(0, b.active - 1) } : b));
          setBackends(s.backends);
        }, duration);
      }

      if (!s.reduced) {
        setFlights((f) => [...f.slice(-40), { id, backend: pick === -1 ? 0 : pick, dropped: pick === -1 }]);
        setTimeout(() => setFlights((f) => f.filter((x) => x.id !== id)), FLIGHT_MS);
      }
    }, 1000 / rate);

    return () => clearInterval(interval);
  }, [rate]);

  const toggle = (i: number) => {
    state.current.backends = state.current.backends.map((b, j) => (j === i ? { ...b, up: !b.up } : b));
    setBackends(state.current.backends);
  };

  const reset = () => {
    state.current.backends = state.current.backends.map((b) => ({ ...b, served: 0 }));
    setBackends(state.current.backends);
    setDropped(0);
  };

  const maxActive = Math.max(6, ...backends.map((b) => b.active));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className={labLabel}>Algorithm</p>
          <div className={labSegmented}>
            {(['round-robin', 'least-connections', 'weighted'] as const).map((a) => (
              <button key={a} type="button" onClick={() => setAlgorithm(a)} className={labSegment(algorithm === a)}>
                {a.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full max-w-[220px]">
          <label htmlFor="rate" className={cn(labLabel, 'flex justify-between')}>
            <span>Requests / sec</span>
            <span className="font-tabular text-[var(--color-fg)]">{rate}</span>
          </label>
          <input id="rate" type="range" min={1} max={20} value={rate} onChange={(e) => setRate(Number(e.target.value))} className={labRange} />
        </div>
      </div>

      <div className={cn(labPanel, 'overflow-x-auto p-3')}>
        <svg viewBox="0 0 700 260" className="h-auto w-full min-w-[520px]" role="img" aria-label="Load balancer distributing requests to four web servers">
          <text x={20} y={LB.y + 4} className="fill-[var(--color-muted)] font-mono" fontSize={10}>
            clients
          </text>
          <line x1={62} y1={LB.y} x2={LB.x - 26} y2={LB.y} className="stroke-[var(--color-rule)]" strokeWidth={1.5} />

          {backends.map((b, i) => (
            <line
              key={b.id}
              x1={LB.x + 26}
              y1={LB.y}
              x2={BACKEND_X - 12}
              y2={backendY(i) + 20}
              strokeWidth={1.5}
              strokeDasharray={b.up ? undefined : '4 5'}
              className={cn('transition-[stroke] duration-300', b.up ? 'stroke-[var(--color-rule)]' : 'stroke-[var(--color-accent)] opacity-50')}
            />
          ))}

          <rect x={LB.x - 26} y={LB.y - 22} width={52} height={44} rx={10} className="fill-[var(--color-fg)]" />
          <text x={LB.x} y={LB.y + 4} textAnchor="middle" className="fill-[var(--color-bg)] font-mono" fontSize={11}>
            LB
          </text>

          {flights.map((f) => {
            const to = f.dropped ? { x: LB.x + 60, y: LB.y + 40 } : { x: BACKEND_X - 12, y: backendY(f.backend) + 20 };
            return (
              <circle
                key={f.id}
                r={4}
                className={cn('animate-lb-flight', f.dropped ? 'fill-[var(--color-accent)]' : 'fill-[var(--color-fg)]')}
                style={
                  {
                    '--x0': `${LB.x + 26}px`,
                    '--y0': `${LB.y}px`,
                    '--x1': `${to.x}px`,
                    '--y1': `${to.y}px`,
                    animationDuration: `${FLIGHT_MS}ms`,
                  } as React.CSSProperties
                }
              />
            );
          })}

          {backends.map((b, i) => (
            <g
              key={b.id}
              role="button"
              tabIndex={0}
              aria-label={`${b.name}: ${b.up ? 'healthy, click to take down' : 'down, click to restore'}`}
              aria-pressed={!b.up}
              onClick={() => toggle(i)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(i))}
              className="cursor-pointer outline-none [&:focus-visible>rect:first-child]:stroke-[var(--color-accent)]"
            >
              <rect
                x={BACKEND_X - 12}
                y={backendY(i)}
                width={200}
                height={40}
                rx={8}
                strokeWidth={1.5}
                className={cn(
                  'transition-[fill,stroke] duration-300',
                  b.up ? 'fill-[var(--color-surface)] stroke-[var(--color-rule)] hover:stroke-[var(--color-fg)]' : 'fill-[var(--color-bg)] stroke-[var(--color-accent)]',
                )}
              />
              <circle cx={BACKEND_X + 4} cy={backendY(i) + 20} r={3.5} className={b.up ? 'fill-emerald-500' : 'fill-[var(--color-accent)]'} />
              <text x={BACKEND_X + 16} y={backendY(i) + 17} className="fill-[var(--color-fg)] font-mono" fontSize={11}>
                {b.name}
                {algorithm === 'weighted' && <tspan className="fill-[var(--color-muted)]"> w={b.weight}</tspan>}
              </text>
              <text x={BACKEND_X + 16} y={backendY(i) + 31} className="fill-[var(--color-muted)] font-mono" fontSize={9}>
                {b.up ? `${b.active} active · ${b.served} served` : 'health check failed'}
              </text>
              <rect x={BACKEND_X + 150} y={backendY(i) + 14} width={32} height={12} rx={3} className="fill-[var(--color-subtle)]" />
              <rect
                x={BACKEND_X + 150}
                y={backendY(i) + 14}
                width={32 * Math.min(1, b.active / maxActive)}
                height={12}
                rx={3}
                className="fill-[var(--color-accent)] transition-[width] duration-300"
              />
            </g>
          ))}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 text-[13px] text-[var(--color-muted)]">
        <p>Click a server to fail its health check. Traffic shifts to the healthy ones.</p>
        <p className="font-tabular flex items-center gap-4">
          <span>
            Served <span className="text-[var(--color-fg)]">{backends.reduce((n, b) => n + b.served, 0)}</span>
          </span>
          <span>
            Dropped <span className="text-[var(--color-accent)]">{dropped}</span>
          </span>
          <button type="button" onClick={reset} className="link-underline text-[var(--color-fg)]">
            Reset
          </button>
        </p>
      </div>
    </div>
  );
}
