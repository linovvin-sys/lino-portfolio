'use client';

import { CountUp } from '@/components/motion/CountUp';
import { metricsStrip } from '@/content/metrics';

export function MetricsBanner() {
  return (
    <div className="w-full overflow-hidden border-y border-[var(--color-rule)] bg-[var(--color-surface)] py-6">
      <div className="flex flex-wrap md:flex-nowrap justify-around items-center gap-8 px-6 max-w-7xl mx-auto">
        {metricsStrip.map((metric) => (
          <div key={metric.label} className="flex flex-col items-center justify-center text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-2">
              {metric.label}
            </span>
            <div className="font-mono text-3xl md:text-4xl text-[var(--color-fg)] flex items-baseline">
              {metric.numericValue !== undefined ? (
                <CountUp value={metric.numericValue} duration={2} decimals={Number.isInteger(metric.numericValue) ? 0 : 1} />
              ) : (
                metric.value
              )}
              {metric.suffix && <span className="text-xl md:text-2xl ml-1 text-[var(--color-accent)]">{metric.suffix}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
