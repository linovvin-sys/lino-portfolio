import { oss } from '@/content/oss';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArrowUpRight, Star } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

interface OpenSourceProps {
  id?: string;
}

const LANGUAGE_COLOR: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178C6',
  Rust: '#DEA584',
  Go: '#00ADD8',
};

export function OpenSource({ id }: OpenSourceProps) {
  const oddCount = oss.length % 2 === 1;

  return (
    <Section id={id}>
      <SectionHeader index={5} eyebrow="Open source" title="Tools I maintain in the open." />

      <ul className="mt-14 grid grid-cols-1 gap-[var(--grid-gap)] md:mt-20 md:grid-cols-2 lg:grid-cols-6">
        {oss.map((repo, i) => (
          <li
            key={repo.id}
            data-reveal
            style={{ ['--reveal-delay' as string]: `${(i % 3) * 60}ms` }}
            className={cn(
              repo.featured ? 'lg:col-span-3' : 'lg:col-span-2',
              oddCount && i === oss.length - 1 && 'md:col-span-2 lg:col-span-2',
            )}
          >
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] transition-[border-color,transform] duration-300 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--color-fg)_20%,var(--color-rule))] md:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-mono break-all text-[15px] font-medium text-[var(--color-fg)]">{repo.name}</h3>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--color-muted)] transition-[color,transform] duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-fg)]" />
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted)]">{repo.description}</p>
              <div className="mt-auto flex items-center gap-5 pt-8 text-[13px] text-[var(--color-muted)]">
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: LANGUAGE_COLOR[repo.language] ?? 'var(--color-muted)' }}
                    aria-hidden="true"
                  />
                  {repo.language}
                </span>
                <span className="font-tabular flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5" />
                  {repo.stars.toLocaleString('en-US')}
                  <span className="sr-only">stars</span>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
