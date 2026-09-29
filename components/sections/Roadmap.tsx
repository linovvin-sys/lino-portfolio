'use client';

import { useState } from 'react';
import { roadmap } from '@/content/roadmap';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AnimatedNumber } from '@/components/motion/AnimatedNumber';
import { cn } from '@/lib/utils';
import type { RoadmapStage } from '@/content/schemas';

interface RoadmapProps {
  id?: string;
}

const STATUS_LABEL: Record<RoadmapStage['status'], string> = {
  done: 'Done',
  'in-progress': 'In progress',
  next: 'Up next',
};

const allItems = roadmap.flatMap((s) => s.items);
const doneCount = allItems.filter((i) => i.done).length;
const percent = Math.round((doneCount / allItems.length) * 100);
const learningNow = roadmap
  .filter((s) => s.status === 'in-progress')
  .flatMap((s) => s.items.filter((i) => !i.done).map((i) => i.name))
  .slice(0, 4);

function StatusIcon({ status }: { status: RoadmapStage['status'] }) {
  if (status === 'done') {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="fill-none stroke-current" strokeWidth="1.75">
          <path d="M2.5 6.5l2.5 2.5 4.5-5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (status === 'in-progress') {
    return (
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-bg)]">
        <span className="absolute inset-[-4px] rounded-full border border-[var(--color-accent)] animate-breathe" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
      </span>
    );
  }
  return <span className="block h-7 w-7 rounded-full border-2 border-dashed border-[var(--color-rule)] bg-[var(--color-bg)]" />;
}

export function Roadmap({ id }: RoadmapProps) {
  const [open, setOpen] = useState<string | null>(roadmap.find((s) => s.status === 'in-progress')?.id ?? roadmap[0]?.id ?? null);

  return (
    <Section id={id}>
      <SectionHeader
        index={6}
        eyebrow="Roadmap"
        title="My path to Network DevOps."
        subtitle="What I’ve learned, what I’m working on now, and what comes next. I update it as I go."
      />

      <div className="mt-14 grid grid-cols-12 gap-x-[var(--grid-gap)] gap-y-10 md:mt-20">
        {/* Summary */}
        <aside data-reveal className="col-span-12 lg:col-span-4">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-bg)] p-6 md:p-7 lg:sticky lg:top-8">
            <p className="eyebrow">Overall progress</p>
            <p className="font-display font-tabular mt-3 text-[3.5rem] leading-none text-[var(--color-fg)]">
              <AnimatedNumber value={percent} />
              <span className="ml-1 font-body text-xl tracking-normal text-[var(--color-muted)]">%</span>
            </p>
            <p className="mt-2 text-[13px] text-[var(--color-muted)]">
              {doneCount} of {allItems.length} skills checked off
            </p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--color-subtle)]">
              <div className="reveal-bar h-full origin-left rounded-full bg-[var(--color-accent)]" style={{ ['--v' as string]: percent / 100 }} />
            </div>

            <div className="mt-7 border-t border-[var(--color-rule)] pt-5">
              <p className="eyebrow">Learning right now</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {learningNow.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-rule)] px-2.5 py-1 text-[12px] text-[var(--color-fg)]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Stages */}
        <ol className="relative col-span-12 lg:col-span-8">
          <span aria-hidden="true" className="absolute bottom-6 left-[13.5px] top-6 w-px bg-[var(--color-rule)]" />
          {roadmap.map((stage, i) => {
            const isOpen = open === stage.id;
            const done = stage.items.filter((it) => it.done).length;
            return (
              <li key={stage.id} data-reveal style={{ ['--reveal-delay' as string]: `${i * 50}ms` }} className="relative pb-3">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`roadmap-${stage.id}`}
                  onClick={() => setOpen(isOpen ? null : stage.id)}
                  className="group flex w-full items-start gap-5 rounded-[var(--radius-md)] py-3 pr-2 text-left"
                >
                  <span className="relative z-10 shrink-0 transition-transform duration-300 ease-[var(--ease-out)] group-active:scale-95">
                    <StatusIcon status={stage.status} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-[length:var(--text-md)] font-medium text-[var(--color-fg)]">{stage.title}</span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[11px] font-medium',
                          stage.status === 'done' && 'bg-[color-mix(in_oklab,var(--color-accent)_12%,transparent)] text-[var(--color-accent)]',
                          stage.status === 'in-progress' && 'bg-[var(--color-fg)] text-[var(--color-bg)]',
                          stage.status === 'next' && 'border border-[var(--color-rule)] text-[var(--color-muted)]',
                        )}
                      >
                        {STATUS_LABEL[stage.status]}
                      </span>
                    </span>
                    <span className="mt-1 block text-[14px] text-[var(--color-muted)]">{stage.summary}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3 pt-1">
                    <span className="font-tabular text-[13px] text-[var(--color-muted)]">
                      {done}/{stage.items.length}
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      aria-hidden="true"
                      className={cn('fill-none stroke-[var(--color-muted)] transition-transform duration-300 ease-[var(--ease-out)]', isOpen && 'rotate-180')}
                      strokeWidth="1.5"
                    >
                      <path d="M3.5 5.5L7 9l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>

                {/* grid-rows trick animates height without measuring */}
                <div
                  id={`roadmap-${stage.id}`}
                  className={cn(
                    'grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out)]',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <ul className="ml-12 mt-1 grid gap-2 pb-4 sm:grid-cols-2">
                      {stage.items.map((item, j) => (
                        <li
                          key={item.name}
                          style={{ transitionDelay: isOpen ? `${120 + j * 50}ms` : '0ms' }}
                          className={cn(
                            'flex items-center gap-2.5 rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-bg)] px-3 py-2.5 text-[14px] transition-[opacity,transform] duration-500 ease-[var(--ease-out)]',
                            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
                          )}
                        >
                          <span
                            className={cn(
                              'flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border',
                              item.done ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white' : 'border-[var(--color-rule)]',
                            )}
                            aria-hidden="true"
                          >
                            {item.done && (
                              <svg width="9" height="9" viewBox="0 0 12 12" className="fill-none stroke-current" strokeWidth="2">
                                <path d="M2.5 6.5l2.5 2.5 4.5-5.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                          <span className={item.done ? 'text-[var(--color-fg)]' : 'text-[var(--color-muted)]'}>{item.name}</span>
                          <span className="sr-only">{item.done ? '(done)' : '(not yet)'}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
