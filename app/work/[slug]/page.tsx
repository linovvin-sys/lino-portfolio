import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { projects } from '@/content/projects';
import { getCaseStudyBySlug, getCaseStudySlugs } from '@/lib/case-studies';
import { extractToc } from '@/lib/toc';
import { CaseStudySideNav } from '@/components/sections/CaseStudySideNav';
import { caseStudyMdxComponents } from '@/components/sections/CaseStudyMdxComponents';
import { PageShell } from '@/components/ui/PageShell';
import { TagList } from '@/components/ui/Tag';
import { ArrowUpRight } from '@/components/ui/Icons';
import { LiveSitePreview } from '@/components/ui/LiveSitePreview';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);
  if (!caseStudy) return { title: 'Not Found' };

  return {
    title: `${caseStudy.frontmatter.title} | Case Study`,
    description: caseStudy.frontmatter.subtitle,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);
  const project = projects.find((p) => p.slug === slug);

  if (!caseStudy) {
    notFound();
  }

  const { frontmatter, content } = caseStudy;
  const toc = extractToc(content);
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  const facts = [
    { label: 'Role', value: frontmatter.role },
    { label: 'Duration', value: frontmatter.duration },
    { label: 'Team', value: frontmatter.team },
    { label: 'Client', value: frontmatter.client },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  return (
    <PageShell back={{ href: '/work', label: 'All work' }}>
      <header className="max-w-4xl">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-[var(--color-accent)]">{frontmatter.category}</span>
          <span aria-hidden="true" className="h-px w-6 bg-[var(--color-rule)]" />
          <span>{frontmatter.year}</span>
        </p>
        <h1 className="font-display mt-5 text-[clamp(2.75rem,1.8rem+4vw,5rem)] leading-[1] text-[var(--color-fg)]">
          {frontmatter.title}
        </h1>
        <p className="mt-6 max-w-2xl text-[length:var(--text-lg)] leading-relaxed text-[var(--color-muted)]">
          {frontmatter.subtitle}
        </p>
      </header>

      {project?.externalUrl && (
        <LiveSitePreview url={project.externalUrl} screenshot={project.thumbnail} />
      )}

      <dl className="mt-12 grid grid-cols-2 gap-x-[var(--grid-gap)] gap-y-6 border-y border-[var(--color-rule)] py-6 md:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="eyebrow">{fact.label}</dt>
            <dd className="mt-1.5 text-[15px] text-[var(--color-fg)]">{fact.value}</dd>
          </div>
        ))}
      </dl>

      {frontmatter.metrics.length > 0 && (
        <dl
          className="mt-10 grid grid-cols-2 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-rule)] md:grid-cols-4"
          style={{ gap: '1px' }}
        >
          {frontmatter.metrics.map((m) => (
            <div key={m.label} className="flex flex-col justify-between gap-6 bg-[var(--color-surface)] p-6">
              <dt className="eyebrow">{m.label}</dt>
              <dd className="font-display font-tabular text-[length:var(--text-3xl)] leading-none text-[var(--color-fg)]">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-16 grid grid-cols-12 gap-x-[var(--grid-gap)] gap-y-12 md:mt-20">
        <aside className="col-span-12 lg:col-span-3">
          <div className="space-y-10 lg:sticky lg:top-8">
            <CaseStudySideNav toc={[{ id: 'problem', text: 'Problem' }, ...toc, { id: 'outcome', text: 'Outcome' }]} />
            <div>
              <h2 className="eyebrow">Stack</h2>
              <TagList items={frontmatter.stack} className="mt-4" />
            </div>
            {(project?.externalUrl || project?.repoUrl) && (
              <div className="flex flex-col items-start gap-3">
                {project?.externalUrl && (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-fg)]"
                  >
                    View live
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
                {project?.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-fg)]"
                  >
                    View source
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </aside>

        <div className="col-span-12 lg:col-span-8 lg:col-start-5">
          <section>
            <h2 id="problem" className="font-display text-[length:var(--text-2xl)] leading-[1.15] text-[var(--color-fg)] md:text-[2.25rem]">
              Problem
            </h2>
            <p className="mt-5 text-[17px] leading-[1.75] text-[var(--color-muted)]">{frontmatter.problem}</p>

            <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-6">
              <h3 className="eyebrow">Constraints</h3>
              <ul className="mt-4 space-y-2.5">
                {frontmatter.constraints.map((c) => (
                  <li key={c} className="flex gap-3 text-[15px] leading-relaxed text-[var(--color-fg)]">
                    <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <article>
            <MDXRemote
              source={content}
              components={caseStudyMdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </article>

          <section className="mt-16 border-t border-[var(--color-rule)] pt-12">
            <h2 id="outcome" className="font-display text-[length:var(--text-2xl)] leading-[1.15] text-[var(--color-fg)] md:text-[2.25rem]">
              Outcome
            </h2>
            <p className="mt-5 text-[17px] leading-[1.75] text-[var(--color-muted)]">{frontmatter.outcome}</p>
          </section>

          {next && next.slug !== slug && (
            <a
              href={`/work/${next.slug}`}
              className="group mt-16 flex items-center justify-between gap-6 rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 transition-[border-color] duration-300 hover:border-[color-mix(in_oklab,var(--color-fg)_20%,var(--color-rule))] md:p-8"
            >
              <span>
                <span className="eyebrow">Next case study</span>
                <span className="font-display mt-2 block text-[length:var(--text-2xl)] leading-[1.1] text-[var(--color-fg)]">
                  {next.title}
                </span>
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-rule)] text-[var(--color-fg)] transition-[background-color,color,border-color] duration-300 group-hover:border-[var(--color-fg)] group-hover:bg-[var(--color-fg)] group-hover:text-[var(--color-bg)]">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </a>
          )}
        </div>
      </div>
    </PageShell>
  );
}
