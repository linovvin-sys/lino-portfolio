'use client';

import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ClipReveal } from '@/components/motion/ClipReveal';
import { cn } from '@/lib/utils';
import { lab } from '@/content/lab';

interface LabProps {
  id?: string;
}

export function Lab({ id }: LabProps) {
  return (
    <section id={id} className="py-24 md:py-32 bg-[var(--color-surface)] text-[var(--color-fg)]">
      <Container>
        <SectionHeader index={6} title="Lab" subtitle="Functional client-side experiments — no server round-trip, no model calls." />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
          {lab.map((exp, i) => (
            <div
              key={exp.id}
              className={cn(
                'relative group overflow-hidden border border-[var(--color-rule)] p-6 bg-[var(--color-bg)] flex flex-col hover:bg-[var(--color-surface)] transition-colors',
                i === 0 ? 'md:col-span-2 md:row-span-2 p-10' : 'md:col-span-1 md:row-span-1',
              )}
            >
              <ClipReveal delay={i * 0.1} className="h-full flex flex-col">
                <a href={`/lab/${exp.id}`} className="absolute inset-0 z-10 block" aria-label={`Open ${exp.title}`} />

                <div className="flex justify-between items-start mb-4 relative z-20">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)]">{exp.category}</span>
                  <span className="font-mono text-xs px-2 py-1 bg-[var(--color-code-bg)]">{exp.status}</span>
                </div>

                <h3 className={cn('font-display mb-2 mt-auto', i === 0 ? 'text-4xl' : 'text-xl')}>
                  {exp.title}
                </h3>

                <p className={cn('font-body text-[var(--color-muted)]', i === 0 ? 'text-lg mb-8' : 'text-sm mb-4 line-clamp-2')}>
                  {exp.description}
                </p>

                <div className="font-mono text-xs text-[var(--color-muted)] mt-auto pt-4 border-t border-[var(--color-rule)]">
                  {exp.techStack.join(' · ')}
                </div>
              </ClipReveal>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
