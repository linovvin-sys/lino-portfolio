'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { labLabel, labPanel } from './ui';

type PodState = 'running' | 'starting' | 'terminating';

interface Pod {
  id: number;
  version: 1 | 2;
  state: PodState;
  /** ticks until the current transition completes */
  ttl: number;
}

const TICK_MS = 650;
const START_TICKS = 3;
const STOP_TICKS = 2;

function initialPods(replicas: number): Pod[] {
  return Array.from({ length: replicas }, (_, i) => ({ id: i, version: 1, state: 'running', ttl: 0 }));
}

function Stepper({ label, value, min, max, onChange, disabled }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; disabled: boolean }) {
  const btn =
    'flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-fg)] transition-[background-color,transform] duration-150 hover:bg-[var(--color-subtle)] active:scale-95 disabled:opacity-40';
  return (
    <div>
      <p className={labLabel}>{label}</p>
      <div className="inline-flex items-center gap-1 rounded-full border border-[var(--color-rule)] bg-[var(--color-bg)] p-1">
        <button type="button" className={btn} disabled={disabled || value <= min} onClick={() => onChange(value - 1)} aria-label={`Decrease ${label}`}>
          −
        </button>
        <span className="font-tabular w-8 text-center font-mono text-sm text-[var(--color-fg)]">{value}</span>
        <button type="button" className={btn} disabled={disabled || value >= max} onClick={() => onChange(value + 1)} aria-label={`Increase ${label}`}>
          +
        </button>
      </div>
    </div>
  );
}

export function RolloutSimulator() {
  const [replicas, setReplicas] = useState(6);
  const [maxSurge, setMaxSurge] = useState(1);
  const [maxUnavailable, setMaxUnavailable] = useState(1);
  const [pods, setPods] = useState<Pod[]>(() => initialPods(6));
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [minAvailable, setMinAvailable] = useState(6);
  const nextId = useRef(100);

  const invalid = maxSurge === 0 && maxUnavailable === 0;
  const available = pods.filter((p) => p.state === 'running').length;
  const done = pods.length === replicas && pods.every((p) => p.version === 2 && p.state === 'running');

  const podsRef = useRef(pods);
  podsRef.current = pods;

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const log: string[] = [];
      // advance in-flight transitions
      let next = podsRef.current
        .map((p) => (p.ttl > 0 ? { ...p, ttl: p.ttl - 1 } : p))
        .filter((p) => !(p.state === 'terminating' && p.ttl === 0))
        .map((p) => {
          if (p.state === 'starting' && p.ttl === 0) {
            log.push(`pod/web-v2-${p.id} Ready`);
            return { ...p, state: 'running' as const };
          }
          return p;
        });

      const live = () => next.filter((p) => p.state !== 'terminating').length;
      const avail = () => next.filter((p) => p.state === 'running').length;

      // scale down old pods while availability allows
      for (const pod of next) {
        if (pod.version === 1 && pod.state === 'running' && avail() - 1 >= replicas - maxUnavailable) {
          next = next.map((p) => (p.id === pod.id ? { ...p, state: 'terminating' as const, ttl: STOP_TICKS } : p));
          log.push(`pod/web-v1-${pod.id} Terminating`);
        }
      }
      // scale up new pods within the surge allowance
      while (live() < replicas + maxSurge && next.filter((p) => p.version === 2).length < replicas) {
        const id = nextId.current++;
        next = [...next, { id, version: 2, state: 'starting', ttl: START_TICKS }];
        log.push(`pod/web-v2-${id} Created`);
      }

      const finished = next.length === replicas && next.every((p) => p.version === 2 && p.state === 'running');
      if (finished) {
        log.push('deployment "web" successfully rolled out');
        setRunning(false);
      }
      podsRef.current = next;
      setPods(next);
      setMinAvailable((m) => Math.min(m, avail()));
      if (log.length) setEvents((e) => [...e, ...log].slice(-6));
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [running, replicas, maxSurge, maxUnavailable]);

  const reset = (r = replicas) => {
    setRunning(false);
    setPods(initialPods(r));
    setEvents([]);
    setMinAvailable(r);
  };

  const start = () => {
    if (done) reset();
    setEvents(['kubectl set image deployment/web web=web:v2']);
    setMinAvailable(replicas);
    setTimeout(() => setRunning(true), done ? 50 : 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-6">
        <Stepper label="Replicas" value={replicas} min={2} max={12} disabled={running} onChange={(v) => { setReplicas(v); reset(v); }} />
        <Stepper label="maxSurge" value={maxSurge} min={0} max={6} disabled={running} onChange={setMaxSurge} />
        <Stepper label="maxUnavailable" value={maxUnavailable} min={0} max={6} disabled={running} onChange={setMaxUnavailable} />
        <div className="flex gap-2">
          <Button onClick={start} disabled={running || invalid}>
            {running ? 'Rolling out…' : done ? 'Roll out again' : 'Deploy v2'}
          </Button>
          <Button variant="secondary" onClick={() => reset()} disabled={running}>
            Reset
          </Button>
        </div>
      </div>
      {invalid && <p className="text-[13px] text-[var(--color-accent)]">maxSurge and maxUnavailable can’t both be 0: the rollout could never make progress.</p>}

      <div className={cn(labPanel, 'p-5')}>
        <div className="flex flex-wrap gap-2.5">
          {pods.map((pod) => (
            <div
              key={pod.id}
              title={`web-v${pod.version}-${pod.id} · ${pod.state}`}
              className={cn(
                'flex h-14 w-14 flex-col items-center justify-center rounded-[var(--radius-md)] border font-mono text-[11px] transition-[background-color,border-color,opacity,transform] duration-500 ease-[var(--ease-out)]',
                pod.version === 1 ? 'border-[var(--color-rule)] bg-[var(--color-subtle)] text-[var(--color-muted)]' : 'border-[var(--color-accent)] text-[var(--color-fg)]',
                pod.version === 2 && pod.state === 'running' && 'bg-[color-mix(in_oklab,var(--color-accent)_14%,transparent)]',
                pod.state === 'starting' && 'animate-pulse border-dashed',
                pod.state === 'terminating' && 'scale-90 opacity-35',
              )}
            >
              <span>v{pod.version}</span>
              <span className="text-[9px] opacity-70">{pod.state === 'running' ? 'ready' : pod.state}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-baseline justify-between text-[13px]">
          <span className="text-[var(--color-muted)]">Available replicas</span>
          <span className="font-tabular text-[var(--color-fg)]">
            {available} / {replicas}
            <span className="text-[var(--color-muted)]"> · lowest during rollout {Math.min(minAvailable, available)}</span>
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-subtle)]">
          <div
            className="h-full origin-left rounded-full bg-emerald-500 transition-transform duration-500 ease-[var(--ease-out)]"
            style={{ transform: `scaleX(${Math.min(1, available / replicas)})` }}
          />
        </div>
      </div>

      <div className={cn(labPanel, 'min-h-[9.5rem] p-4 font-mono text-[12px] leading-6')}>
        {events.length === 0 ? (
          <p className="text-[var(--color-muted)]">Deploy v2 to start a rolling update.</p>
        ) : (
          events.map((e, i) => (
            <p key={`${i}-${e}`} className="animate-token-in text-[var(--color-fg)]">
              <span className="text-[var(--color-muted)]">› </span>
              {e}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
