import { experience } from '@/content/experience';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TagList } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { ArrowUpRight } from '@/components/ui/Icons';
import { profile } from '@/content/profile';
import { TimelineProgress } from '@/components/motion/TimelineProgress';

interface ExperienceProps {
  id?: string;
}

export function Experience({ id }: ExperienceProps) {
  return (
    <Section id={id}>
      <SectionHeader
        index={4}
        eyebrow="Experience"
        title="From the NOC to Network DevOps."
        action={
          profile.links.resume ? (
            <Button href={profile.links.resume} variant="secondary">
              Full résumé
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          ) : undefined
        }
      />

      <ol className="mt-14 border-t border-[var(--color-rule)] md:mt-20">
        {experience.map((role) => (
          <li
            key={role.id}
            data-timeline-item
            data-reveal
            className="group/role grid grid-cols-12 gap-x-[var(--grid-gap)] gap-y-4 border-b border-[var(--color-rule)] py-10 md:border-b-0 md:py-12"
          >
            <div className="col-span-12 md:col-span-3">
              <p className="font-tabular text-sm text-[var(--color-fg)]">
                {role.period.start} — {role.period.end}
              </p>
              <p className="mt-1 text-[13px] text-[var(--color-muted)]">{role.location}</p>
            </div>

            <div className="relative col-span-12 md:col-span-9 md:pl-12 lg:col-span-8">
              {/* scroll-linked timeline rail */}
              <span aria-hidden="true" className="absolute -bottom-12 -top-12 left-0 hidden w-px bg-[var(--color-rule)] md:block" />
              <span
                aria-hidden="true"
                className="absolute -bottom-12 -top-12 left-0 hidden w-px origin-top bg-[var(--color-accent)] md:block"
                style={{ transform: 'scaleY(var(--p, 0))' }}
              />
              <span
                aria-hidden="true"
                className="absolute left-[-5px] top-2.5 hidden h-[11px] w-[11px] rounded-full border-2 border-[var(--color-rule)] bg-[var(--color-bg)] transition-[border-color,background-color,transform] duration-500 ease-[var(--ease-out)] group-data-[active]/role:scale-110 group-data-[active]/role:border-[var(--color-accent)] group-data-[active]/role:bg-[var(--color-accent)] md:block"
              />
              <h3 className="font-display text-[length:var(--text-2xl)] leading-[1.1] text-[var(--color-fg)]">
                {role.role}
                <span className="text-[var(--color-muted)]"> · {role.company}</span>
              </h3>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--color-muted)]">{role.description}</p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {role.impacts.map((item) => (
                  <li
                    key={item.metric}
                    className="rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-4"
                  >
                    <p className="font-mono text-[13px] text-[var(--color-accent)]">{item.metric}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-fg)]">{item.description}</p>
                  </li>
                ))}
              </ul>

              {role.stack && <TagList items={role.stack} className="mt-6" />}
            </div>
          </li>
        ))}
      </ol>
      <TimelineProgress scope="#experience" />
    </Section>
  );
}
