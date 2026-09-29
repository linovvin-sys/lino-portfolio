import { resources } from '@/content/resources';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArrowUpRight } from '@/components/ui/Icons';
import { formatIndex } from '@/lib/utils';

interface ResourcesProps {
  id?: string;
}

export function Resources({ id }: ResourcesProps) {
  return (
    <Section id={id}>
      <SectionHeader
        index={7}
        eyebrow="Resources"
        title="What I keep coming back to."
        subtitle="A hand-picked list of the resources I keep coming back to — for learning to build software, building toward Network DevOps, and staying current. Free or freemium, and genuinely worth your time."
      />

      <div className="mt-14 border-t border-[var(--color-rule)] md:mt-20">
        {resources.map((group) => (
          <div
            key={group.id}
            data-reveal
            className="grid grid-cols-12 gap-x-[var(--grid-gap)] gap-y-6 border-b border-[var(--color-rule)] py-10 md:py-12"
          >
            <div className="col-span-12 md:col-span-5 lg:col-span-4">
              <p className="font-mono font-tabular text-xs text-[var(--color-accent)]">{formatIndex(group.index)}</p>
              <h3 className="font-display mt-3 text-[length:var(--text-2xl)] leading-[1.1] text-[var(--color-fg)]">
                {group.title}
              </h3>
              <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-[var(--color-muted)]">{group.description}</p>
            </div>

            <ul className="col-span-12 md:col-span-7 lg:col-span-7 lg:col-start-6">
              {group.items.map((item) => (
                <li key={item.name} className="border-t border-dashed border-[var(--color-rule)] py-4 first:border-t-0 first:pt-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-4"
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-[15px] font-medium text-[var(--color-fg)]">
                        <span className="link-underline">{item.name}</span>
                        <span className="eyebrow shrink-0 text-[var(--color-muted)]">{item.cost}</span>
                      </span>
                      <span className="mt-0.5 block text-[13px] text-[var(--color-muted)]">{item.description}</span>
                    </span>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--color-muted)] transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-fg)]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
