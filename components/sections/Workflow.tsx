'use client';

import { useEffect, useRef, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';

interface Stage {
  id: string;
  title: string;
  summary: string;
  detail: string;
  command: string;
  output: { text: string; tone?: 'ok' | 'muted' }[];
}

const STAGES: Stage[] = [
  {
    id: 'plan',
    title: 'Plan',
    summary: 'Model the change',
    detail: 'Every change starts in the source of truth. I update NetBox (new interfaces, IPs, BGP peers) and open a merge request, so intent is reviewed before anything is rendered.',
    command: 'git switch -c change/add-spine-03',
    output: [{ text: 'netbox: +1 device  +6 interfaces  +6 prefixes', tone: 'muted' }, { text: 'merge request !482 opened for review', tone: 'ok' }],
  },
  {
    id: 'build',
    title: 'Build',
    summary: 'Render configs',
    detail: 'Templates turn source-of-truth data into full device configs. The pipeline renders every affected device and posts a line-by-line diff on the merge request.',
    command: 'nornir render --changed --site mnl1',
    output: [{ text: 'rendered 7 configs (spine-03, leaf-01..04, edge-01..02)', tone: 'muted' }, { text: 'diff: +42 −3 lines posted to !482', tone: 'ok' }],
  },
  {
    id: 'validate',
    title: 'Validate',
    summary: 'Prove it is safe',
    detail: 'Linting, policy checks and Batfish analysis run against the candidate configs, catching routing loops, ACL mistakes and unreachable prefixes before a device is touched.',
    command: 'batfish verify --reachability --bgp-sessions',
    output: [{ text: 'reachability: 1,284/1,284 flows ok', tone: 'muted' }, { text: '✓ 0 loops · 0 blackholes · 8/8 BGP sessions', tone: 'ok' }],
  },
  {
    id: 'deploy',
    title: 'Deploy',
    summary: 'Roll out in waves',
    detail: 'A canary first, then waves of 10%, each wrapped in pre- and post-checks. If a check fails, that wave rolls back automatically and the pipeline stops.',
    command: 'ansible-playbook deploy.yml --limit wave_1',
    output: [{ text: 'canary spine-03 ✓  wave_1 (4 hosts) ✓', tone: 'muted' }, { text: 'PLAY RECAP ok=96 changed=7 failed=0', tone: 'ok' }],
  },
  {
    id: 'observe',
    title: 'Observe',
    summary: 'Confirm with data',
    detail: 'Streaming telemetry and SLO dashboards confirm the change did what it should. Alerts watch error budgets for the next hour before the change is closed.',
    command: 'promql: sum(bgp_session_up{fabric="mnl1"})',
    output: [{ text: '14 → 16 sessions up · p95 latency 0.42 ms (−3%)', tone: 'muted' }, { text: '✓ SLO healthy · change !482 closed', tone: 'ok' }],
  },
];

const STAGE_MS = 4200;

interface WorkflowProps {
  id?: string;
}

export function Workflow({ id }: WorkflowProps) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const autoplay = playing && inView && !reduced;

  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(() => setActive((a) => (a + 1) % STAGES.length), STAGE_MS);
    return () => clearTimeout(timer);
  }, [autoplay, active]);

  const select = (i: number) => {
    setActive(i);
    setPlaying(false);
  };

  const stage = STAGES[active]!;

  return (
    <Section id={id} tone="inverse">
      <SectionHeader
        index={3}
        eyebrow="Workflow"
        title="How a network change ships."
        subtitle="The same pipeline I build for teams: every change is modelled, rendered, validated, rolled out in waves and verified with data."
        action={
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--color-rule)] px-4 text-sm text-[var(--color-fg)] transition-[border-color,transform] duration-150 hover:border-[var(--color-muted)] active:scale-[0.97]"
          >
            {playing ? (
              <>
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="fill-current">
                  <rect x="1.5" y="1" width="2.5" height="8" rx="0.5" />
                  <rect x="6" y="1" width="2.5" height="8" rx="0.5" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="fill-current">
                  <path d="M2 1.2v7.6a.5.5 0 00.77.42l6-3.8a.5.5 0 000-.84l-6-3.8A.5.5 0 002 1.2z" />
                </svg>
                Play
              </>
            )}
          </button>
        }
      />

      <div ref={rootRef} data-reveal className="mt-14 md:mt-20">
        {/* Stage rail */}
        <ol role="tablist" aria-label="Pipeline stages" className="relative grid grid-cols-5 gap-2 sm:gap-4">
          <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-[19px] h-px bg-[var(--color-rule)]" />
          <span
            aria-hidden="true"
            className="absolute left-[10%] top-[19px] h-px origin-left bg-[var(--color-accent)] transition-transform duration-700 ease-[var(--ease-out)]"
            style={{ width: '80%', transform: `scaleX(${active / (STAGES.length - 1)})` }}
          />
          {STAGES.map((s, i) => {
            const isActive = i === active;
            const done = i < active;
            return (
              <li key={s.id} role="presentation" className="relative">
                <button
                  type="button"
                  role="tab"
                  id={`stage-${s.id}`}
                  aria-selected={isActive}
                  aria-controls="stage-panel"
                  onClick={() => select(i)}
                  className="group flex w-full flex-col items-center text-center"
                >
                  <span
                    className={cn(
                      'relative flex h-10 w-10 items-center justify-center rounded-full border font-mono text-xs transition-[background-color,border-color,color,transform] duration-300 ease-[var(--ease-out)] group-active:scale-95',
                      isActive
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                        : done
                          ? 'border-[var(--color-accent)] bg-[var(--color-bg)] text-[var(--color-accent)]'
                          : 'border-[var(--color-rule)] bg-[var(--color-bg)] text-[var(--color-muted)] group-hover:border-[var(--color-muted)] group-hover:text-[var(--color-fg)]',
                    )}
                  >
                    {isActive && autoplay && (
                      <span aria-hidden="true" className="absolute inset-[-5px] rounded-full border border-[var(--color-accent)] animate-breathe" />
                    )}
                    {done ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="fill-none stroke-current" strokeWidth="1.75">
                        <path d="M2.5 6.5l2.5 2.5 4.5-5.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      String(i + 1).padStart(2, '0')
                    )}
                  </span>
                  <span className={cn('mt-3 text-sm font-medium transition-colors duration-300 sm:text-[15px]', isActive ? 'text-[var(--color-fg)]' : 'text-[var(--color-muted)]')}>
                    {s.title}
                  </span>
                  <span className="mt-0.5 hidden text-[13px] text-[var(--color-muted)] md:block">{s.summary}</span>
                  {/* per-stage autoplay progress */}
                  <span aria-hidden="true" className="mt-3 block h-0.5 w-12 overflow-hidden rounded-full bg-[var(--color-rule)]">
                    {isActive && (
                      <span
                        key={`${active}-${autoplay}`}
                        className={cn('block h-full origin-left bg-[var(--color-fg)]', autoplay ? 'animate-stage-progress' : 'scale-x-100')}
                        style={{ animationDuration: `${STAGE_MS}ms` }}
                      />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Stage detail */}
        <div
          id="stage-panel"
          role="tabpanel"
          aria-labelledby={`stage-${stage.id}`}
          className="mt-10 grid gap-6 rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 md:grid-cols-[1fr_1.15fr] md:gap-10 md:p-8"
        >
          <div key={stage.id} className="animate-dialog-in">
            <p className="eyebrow text-[var(--color-accent)]">
              Stage {String(active + 1).padStart(2, '0')} / {String(STAGES.length).padStart(2, '0')}
            </p>
            <h3 className="font-display mt-3 text-[length:var(--text-2xl)] leading-[1.1] text-[var(--color-fg)]">{stage.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted)]">{stage.detail}</p>
          </div>
          <div key={`${stage.id}-cli`} className="animate-dialog-in overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[#0d0d0c] font-mono text-[12px] leading-[1.8]" style={{ animationDelay: '60ms' }}>
            <div className="border-b border-white/10 px-4 py-2 text-[10.5px] text-[#8f8c85]">ci / {stage.id}</div>
            <div className="px-4 py-3">
              <p className="break-words text-[#e9e7e1]">
                <span className="text-emerald-400">❯ </span>
                {stage.command}
              </p>
              {stage.output.map((line, i) => (
                <p
                  key={line.text}
                  className={cn('animate-token-in break-words', line.tone === 'ok' ? 'text-emerald-400' : 'text-[#8f8c85]')}
                  style={{ animationDelay: `${250 + i * 220}ms` }}
                >
                  {line.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
