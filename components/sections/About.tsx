import { profile } from '@/content/profile';
import { capabilities } from '@/content/capabilities';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AvailabilityDot } from '@/components/ui/AvailabilityDot';
import { formatIndex } from '@/lib/utils';

interface AboutProps {
  id?: string;
}

export function About({ id }: AboutProps) {
  const facts = [
    { label: 'Role', value: profile.title },
    { label: 'Based in', value: profile.location },
    { label: 'Focus', value: capabilities.slice(0, 3).map((c) => c.title).join(', ') },
  ];

  return (
    <Section id={id} tone="surface">
      <SectionHeader index={8} eyebrow="About" title="Research rigor, product instincts." />

      <div className="mt-14 grid grid-cols-12 gap-x-[var(--grid-gap)] gap-y-14 md:mt-20">
        <div className="col-span-12 lg:col-span-7">
          <p data-reveal className="font-display text-[1.75rem] leading-[1.3] text-[var(--color-fg)] md:text-[2.125rem]">
            {profile.bio}
          </p>

          <div data-reveal className="mt-14">
            <h3 className="eyebrow">Operating principles</h3>
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
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-bg)] p-6 md:p-7 lg:sticky lg:top-[calc(var(--nav-height)+32px)]">
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
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
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
