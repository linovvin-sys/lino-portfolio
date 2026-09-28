import { capabilities } from '@/content/capabilities';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { formatIndex } from '@/lib/utils';

interface CapabilitiesProps {
  id?: string;
}

export function Capabilities({ id }: CapabilitiesProps) {
  return (
    <Section id={id} tone="surface">
      <SectionHeader
        index={3}
        eyebrow="Skills"
        title="What I work with."
        subtitle="The languages, frameworks and tools I’ve used in real projects, and the networking skills I’m building next."
      />

      <div className="mt-14 border-t border-[var(--color-rule)] md:mt-20">
        {capabilities.map((group) => (
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

            <ul className="col-span-12 grid grid-cols-1 gap-x-[var(--grid-gap)] sm:grid-cols-2 md:col-span-7 lg:col-span-7 lg:col-start-6">
              {group.items.map((item) => (
                <li
                  key={item.name}
                  className="border-t border-dashed border-[var(--color-rule)] py-3.5 first:border-t-0 first:pt-0 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(2)]:pt-0"
                >
                  <p className="text-[15px] font-medium text-[var(--color-fg)]">{item.name}</p>
                  {item.detail && <p className="mt-0.5 text-[13px] text-[var(--color-muted)]">{item.detail}</p>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
