import { profile } from '@/content/profile';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AvailabilityDot } from '@/components/ui/AvailabilityDot';
import { formatIndex } from '@/lib/utils';
import { roadmap } from '@/content/roadmap';

interface AboutProps {
  id?: string;
}

export function About({ id }: AboutProps) {
  const facts = [
    { label: 'Currently', value: '3rd-year B.S. Information Technology' },
    { label: 'Aiming for', value: profile.title.replace('Aspiring ', '') },
    { label: 'Based in', value: profile.location },
    { label: 'Focus', value: 'Networking, DevOps and full-stack development' },
  ];

  return (
    <Section id={id}>
      <SectionHeader index={8} eyebrow="About" title="Curious about how it all connects." />

      <div className="mt-14 grid grid-cols-12 gap-x-[var(--grid-gap)] gap-y-14 md:mt-20">
        <div className="col-span-12 lg:col-span-7">
          <p data-reveal className="font-display text-[1.75rem] leading-[1.3] text-[var(--color-fg)] md:text-[2.125rem]">
            {profile.bio}
          </p>

          <div data-reveal className="mt-14">
            <h3 className="eyebrow">How I work</h3>
            <ol className="mt-5 border-t border-[var(--color-rule)]">
              {profile.principles.map((principle, i) => (
                <li
                  key={principle.title}
                  className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-[var(--color-rule)] py-5"
                >
                  <span className="font-mono font-tabular pt-0.5 text-xs text-[var(--color-accent)]">
                    {formatIndex(i + 1)}
                  </span>
                  <div>
                    <p className="text-[15px] font-medium text-[var(--color-fg)]">{principle.title}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-[var(--color-muted)]">{principle.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside data-reveal className="col-span-12 lg:col-span-4 lg:col-start-9">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] md:p-7 lg:sticky lg:top-[calc(var(--nav-height)+32px)]">
            <div className="flex items-center gap-2.5 text-sm text-[var(--color-fg)]">
              <AvailabilityDot status={profile.availability.status} />
              {profile.availability.message}
            </div>
            <dl className="mt-6 border-t border-[var(--color-rule)]">
              {facts.map((fact) => (
                <div key={fact.label} className="border-b border-[var(--color-rule)] py-4">
                  <dt className="eyebrow">{fact.label}</dt>
                  <dd className="mt-1.5 text-[15px] text-[var(--color-fg)]">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <p className="eyebrow">Learning right now</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {roadmap
                  .filter((stage) => stage.status === 'in-progress')
                  .flatMap((stage) => stage.items.filter((item) => !item.done))
                  .slice(0, 5)
                  .map((item) => (
                    <li
                      key={item.name}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-rule)] bg-[var(--color-bg)] px-2.5 py-1 text-[12px] text-[var(--color-fg)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                      {item.name}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--color-rule)] pt-5 text-sm">
              {[
                { label: 'GitHub', href: profile.links.github },
                { label: 'LinkedIn', href: profile.links.linkedin },
                { label: 'X', href: profile.links.x },
              ]
                .filter((l): l is { label: string; href: string } => Boolean(l.href))
                .map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-[var(--color-fg)]"
                  >
                    {l.label}
                  </a>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}
