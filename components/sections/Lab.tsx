import { lab } from '@/content/lab';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArrowRight } from '@/components/ui/Icons';

interface LabProps {
  id?: string;
}

export function Lab({ id }: LabProps) {
  return (
    <Section id={id} tone="surface">
      <SectionHeader
        index={6}
        eyebrow="Lab"
        title="Small, interactive experiments."
        subtitle="Everything runs in your browser: no server round-trips and no model calls."
      />

      <ul className="mt-14 grid grid-cols-1 gap-[var(--grid-gap)] md:mt-20 md:grid-cols-2 lg:grid-cols-3">
        {lab.map((exp, i) => (
          <li key={exp.id} data-reveal style={{ ['--reveal-delay' as string]: `${(i % 3) * 60}ms` }}>
            <a
              href={`/lab/${exp.id}`}
              className="spotlight group flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-bg)] p-6 transition-[border-color,transform] duration-300 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--color-fg)_20%,var(--color-rule))] md:p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="eyebrow">{exp.category}</span>
                <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-muted)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  {exp.status}
                </span>
              </div>
              <h3 className="font-display mt-8 text-[1.625rem] leading-[1.15] text-[var(--color-fg)]">{exp.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted)]">{exp.description}</p>
              <div className="mt-auto pt-8">
                <div className="flex items-center justify-between gap-4 border-t border-[var(--color-rule)] pt-5 text-[13px]">
                  <span className="text-[var(--color-muted)]">{exp.techStack.join(' · ')}</span>
                  <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-[var(--color-fg)]">
                    Open
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
