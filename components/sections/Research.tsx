import { writing } from '@/content/writing';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArrowUpRight } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import type { Writing } from '@/content/schemas';

interface ResearchProps {
  id?: string;
}

const TYPE_LABEL: Record<Writing['type'], string> = {
  blog: 'Essay',
  talk: 'Talk',
  workshop: 'Workshop',
  paper: 'Paper',
  podcast: 'Podcast',
};

function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function Research({ id }: ResearchProps) {
  return (
    <Section id={id} tone="surface">
      <SectionHeader
        index={5}
        eyebrow="Writing & talks"
        title="Notes from the network."
        subtitle="Posts, talks and workshops on network automation, observability and reliability."
      />

      <ul className="mt-14 grid grid-cols-1 gap-[var(--grid-gap)] md:mt-20 md:grid-cols-2 lg:grid-cols-3">
        {writing.map((item, i) => (
          <li key={item.id} data-reveal style={{ ['--reveal-delay' as string]: `${(i % 3) * 60}ms` }}>
            <WritingCard item={item} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function WritingCard({ item }: { item: Writing }) {
  const href = item.url && item.url !== '#' ? item.url : undefined;
  const Tag = href ? 'a' : 'div';

  return (
    <Tag
      {...(href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'spotlight group flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-bg)] p-6 md:p-7',
        href &&
          'transition-[border-color,transform] duration-300 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--color-fg)_20%,var(--color-rule))]',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="eyebrow text-[var(--color-accent)]">{TYPE_LABEL[item.type]}</span>
        <span className="font-tabular text-[13px] text-[var(--color-muted)]">{formatDate(item.date)}</span>
      </div>
      <h3 className="font-display mt-8 text-[1.625rem] leading-[1.15] text-[var(--color-fg)]">{item.title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted)]">{item.description}</p>
      <div className="mt-auto pt-8">
        <div className="flex items-center justify-between gap-4 border-t border-[var(--color-rule)] pt-5">
        <span className="text-[13px] text-[var(--color-fg)]">{item.venue}</span>
        {href && (
          <ArrowUpRight className="h-4 w-4 text-[var(--color-muted)] transition-[color,transform] duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-fg)]" />
        )}
        </div>
      </div>
    </Tag>
  );
}
