import { experience } from '@/content/experience';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TagList } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { ArrowUpRight } from '@/components/ui/Icons';
import { profile } from '@/content/profile';

interface ExperienceProps {
  id?: string;
}

export function Experience({ id }: ExperienceProps) {
  return (
    <Section id={id}>
      <SectionHeader
        index={3}
        eyebrow="Experience"
        title="From the research lab to production AI."
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
            data-reveal
            className="grid grid-cols-12 gap-x-[var(--grid-gap)] gap-y-4 border-b border-[var(--color-rule)] py-10 md:py-12"
          >
            <div className="col-span-12 md:col-span-3">
              <p className="font-tabular text-sm text-[var(--color-fg)]">
                {role.period.start} — {role.period.end}
              </p>
              <p className="mt-1 text-[13px] text-[var(--color-muted)]">{role.location}</p>
            </div>

            <div className="col-span-12 md:col-span-9 lg:col-span-8">
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
    </Section>
  );
}
