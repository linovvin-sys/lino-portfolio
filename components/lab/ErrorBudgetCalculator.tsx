'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { labLabel, labPanel, labRange, labSegment, labSegmented } from './ui';

const TARGETS = [99, 99.5, 99.9, 99.95, 99.99, 99.999];

const PERIODS = [
  { label: 'Per day', seconds: 86_400 },
  { label: 'Per week', seconds: 604_800 },
  { label: 'Per 30 days', seconds: 2_592_000 },
  { label: 'Per quarter', seconds: 7_776_000 },
  { label: 'Per year', seconds: 31_536_000 },
];

function formatDuration(totalSeconds: number) {
  if (totalSeconds < 1) return `${(totalSeconds * 1000).toFixed(0)} ms`;
  const d = Math.floor(totalSeconds / 86_400);
  const h = Math.floor((totalSeconds % 86_400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.round(totalSeconds % 60);
  return [d && `${d}d`, h && `${h}h`, m && `${m}m`, (s || (!d && !h && !m)) && `${s}s`].filter(Boolean).join(' ');
}

export function ErrorBudgetCalculator() {
  const [target, setTarget] = useState(99.9);
  const [downtime, setDowntime] = useState(15);

  const monthBudgetMin = (2_592_000 * (1 - target / 100)) / 60;
  const used = Math.min(1, downtime / monthBudgetMin);
  const remainingMin = Math.max(0, monthBudgetMin - downtime);
  const state = used >= 1 ? 'exhausted' : used >= 0.75 ? 'at risk' : 'healthy';
  const color = used >= 1 ? 'var(--color-accent)' : used >= 0.75 ? '#f59e0b' : '#10b981';

  return (
    <div className="space-y-8">
      <div>
        <p className={labLabel}>Availability target (SLO)</p>
        <div className={cn(labSegmented, 'flex-wrap')}>
          {TARGETS.map((t) => (
            <button key={t} type="button" onClick={() => setTarget(t)} className={labSegment(t === target)}>
              {t}%
            </button>
          ))}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-5">
        {PERIODS.map((p) => (
          <div key={p.label} className="bg-[var(--color-bg)] px-4 py-4">
            <dt className="eyebrow">{p.label}</dt>
            <dd className="font-display font-tabular mt-2 text-[1.625rem] leading-none text-[var(--color-fg)]">
              {formatDuration(p.seconds * (1 - target / 100))}
            </dd>
          </div>
        ))}
      </dl>

      <div className={cn(labPanel, 'p-5 sm:p-6')}>
        <label htmlFor="downtime" className={cn(labLabel, 'flex justify-between')}>
          <span>Downtime so far this month</span>
          <span className="font-tabular text-[var(--color-fg)]">{downtime} min</span>
        </label>
        <input
          id="downtime"
          type="range"
          min={0}
          max={Math.max(60, Math.ceil(monthBudgetMin * 1.5))}
          value={Math.min(downtime, Math.max(60, Math.ceil(monthBudgetMin * 1.5)))}
          onChange={(e) => setDowntime(Number(e.target.value))}
          className={labRange}
        />

        <div className="mt-6 flex items-baseline justify-between text-sm">
          <span className="text-[var(--color-muted)]">Error budget used</span>
          <span className="font-tabular font-medium" style={{ color }}>
            {(used * 100).toFixed(0)}% · {state}
          </span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--color-subtle)]">
          <div
            className="h-full origin-left rounded-full transition-[transform,background-color] duration-500 ease-[var(--ease-out)]"
            style={{ transform: `scaleX(${used})`, backgroundColor: color }}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
          {state === 'exhausted'
            ? 'Budget exhausted: freeze risky changes and focus on reliability until the window resets.'
            : `${formatDuration(remainingMin * 60)} of downtime left this month before the SLO is breached.`}
        </p>
      </div>
    </div>
  );
}
