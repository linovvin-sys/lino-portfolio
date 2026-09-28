import { projects } from '@/content/projects';
import { formatIndex } from '@/lib/utils';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TagList } from '@/components/ui/Tag';
import { ArrowUpRight } from '@/components/ui/Icons';

interface SelectedWorkProps {
  id?: string;
}

export function SelectedWork({ id }: SelectedWorkProps) {
  return (
    <Section id={id}>
      <SectionHeader
        index={2}
        eyebrow="Projects"
        title="Things I’ve built."
        subtitle="From my first C++ program to my AR + AI capstone, with web and desktop systems in PHP, Java and Python along the way. Each one taught me something new."
      />

      <ul className="group/list mt-14 border-t border-[var(--color-rule)] md:mt-20">
        {projects.map((project, i) => (
          <li
            key={project.slug}
            data-reveal
            style={{ ['--reveal-delay' as string]: `${i * 60}ms` }}
            className="border-b border-[var(--color-rule)]"
          >
            <a
              href={`/work/${project.slug}`}
              data-cursor="view"
              className="group relative isolate grid grid-cols-12 transition-opacity duration-500 ease-[var(--ease-out)] group-hover/list:opacity-45 hover:!opacity-100 gap-x-[var(--grid-gap)] gap-y-5 py-8 md:py-10"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 -inset-x-4 -z-10 rounded-[var(--radius-md)] bg-[var(--color-surface)] opacity-0 transition-opacity duration-300 ease-[var(--ease-out)] group-hover:opacity-100 md:-inset-x-6"
              />

              <span className="sr-only">Read the case study: </span>
              <div className="col-span-12 flex items-baseline gap-5 md:col-span-7">
                <span className="font-mono font-tabular w-6 shrink-0 text-xs text-[var(--color-muted)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                  {formatIndex(i + 1)}
                </span>
                <div className="min-w-0">
                  <p className="eyebrow">
                    {project.category} · {project.year}
                  </p>
                  <h3 className="font-display mt-3 text-[length:var(--text-2xl)] transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1.5 leading-[1.1] text-[var(--color-fg)] md:text-[2.5rem]">
                    {project.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--color-muted)]">
                    {project.subtitle}
                  </p>
                  <TagList items={project.stack.slice(0, 4)} className="mt-5" />
                </div>
              </div>

              <dl className="col-span-12 grid grid-cols-2 gap-5 pl-11 md:col-span-4 md:pl-0 md:pt-8">
                {(project.metrics ?? []).slice(0, 2).map((m) => (
                  <div key={m.label}>
                    <dt className="eyebrow">{m.label}</dt>
                    <dd className="font-display font-tabular mt-2 text-[length:var(--text-2xl)] leading-none text-[var(--color-fg)]">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="hidden justify-end md:col-span-1 md:flex md:pt-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-rule)] bg-[var(--color-bg)] text-[var(--color-fg)] transition-[background-color,color,border-color] duration-300 ease-[var(--ease-out)] group-hover:border-[var(--color-fg)] group-hover:bg-[var(--color-fg)] group-hover:text-[var(--color-bg)]">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-out)] group-hover:rotate-45" />
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
