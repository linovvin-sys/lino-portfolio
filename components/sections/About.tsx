import { profile } from '@/content/profile';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { formatIndex } from '@/lib/utils';
import { NetworkLab } from '@/components/network/NetworkLab';

interface AboutProps {
  id?: string;
}

export function About({ id }: AboutProps) {
  return (
    <Section id={id} tone="surface">
      <SectionHeader index={1} eyebrow="About" title="Curious about how it all connects." />

      <div className="mt-14 grid grid-cols-12 gap-x-[var(--grid-gap)] gap-y-14 md:mt-20">
        <div className="col-span-12 lg:col-span-6">
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

        <aside data-reveal className="col-span-12 lg:col-span-5 lg:col-start-8">
          <div className="lg:sticky lg:top-10">
            <NetworkLab />
          </div>
        </aside>
      </div>
    </Section>
  );
}
