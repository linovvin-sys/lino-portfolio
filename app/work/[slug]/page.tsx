import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { projects } from '@/content/projects';
import { getCaseStudyBySlug, getCaseStudySlugs } from '@/lib/case-studies';
import { extractToc } from '@/lib/toc';
import { CaseStudySideNav } from '@/components/sections/CaseStudySideNav';
import { caseStudyMdxComponents } from '@/components/sections/CaseStudyMdxComponents';
import { MetricsStrip } from '@/components/ui/MetricsStrip';

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

  return (
    <main className="min-h-screen px-6 pt-32 pb-24">
      <div className="max-w-4xl mx-auto">
        <Link href="/#work" className="inline-block mb-8 font-mono text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
          &larr; Back to Selected Work
        </Link>

        <header className="mb-12 border-b border-[var(--color-rule)] pb-12">
          <div className="flex gap-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] mb-4">
            <span>{frontmatter.category}</span>
            <span>{frontmatter.year}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display mb-6 leading-tight">{frontmatter.title}</h1>
          <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl">{frontmatter.subtitle}</p>

          <dl className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs">
            <div>
              <dt className="text-[var(--color-muted)] uppercase tracking-wider mb-1">Role</dt>
              <dd className="text-[var(--color-fg)]">{frontmatter.role}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted)] uppercase tracking-wider mb-1">Duration</dt>
              <dd className="text-[var(--color-fg)]">{frontmatter.duration}</dd>
            </div>
            {frontmatter.team && (
              <div>
                <dt className="text-[var(--color-muted)] uppercase tracking-wider mb-1">Team</dt>
                <dd className="text-[var(--color-fg)]">{frontmatter.team}</dd>
              </div>
            )}
            {frontmatter.client && (
              <div>
                <dt className="text-[var(--color-muted)] uppercase tracking-wider mb-1">Client</dt>
                <dd className="text-[var(--color-fg)]">{frontmatter.client}</dd>
              </div>
            )}
          </dl>
        </header>

        <MetricsStrip
          className="mb-16 border-x-0"
          metrics={frontmatter.metrics.map((m) => ({ label: m.label, value: m.numericValue ?? 0, prefix: m.prefix, suffix: m.suffix }))}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-16">
          <div>
            <section className="mb-16">
              <h2 id="problem" className="font-display text-3xl md:text-4xl mb-6 scroll-mt-32">Problem</h2>
              <p className="font-body text-[var(--color-muted)] leading-relaxed mb-8">{frontmatter.problem}</p>

              <h3 className="font-mono text-sm uppercase tracking-widest text-[var(--color-fg)] mb-4">Constraints</h3>
              <ul className="space-y-2">
                {frontmatter.constraints.map((c) => (
                  <li key={c} className="flex items-start gap-3 font-body text-[var(--color-muted)]">
                    <span className="mt-1.5 text-[var(--color-accent)]">·</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </section>

            <article>
              <MDXRemote source={content} components={caseStudyMdxComponents} />
            </article>

            <section className="mt-16 pt-12 border-t border-[var(--color-rule)]">
              <h2 className="font-display text-3xl md:text-4xl mb-6">Outcome</h2>
              <p className="font-body text-[var(--color-muted)] leading-relaxed">{frontmatter.outcome}</p>
            </section>
          </div>

          <aside className="space-y-8">
            <CaseStudySideNav toc={[{ id: 'problem', text: 'Problem' }, ...toc]} />
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest mb-3 text-[var(--color-muted)]">Stack</h4>
              <ul className="space-y-1 font-mono text-sm text-[var(--color-fg)]">
                {frontmatter.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>
            {project?.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-mono text-sm border-b border-[var(--color-rule)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                View live →
              </a>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
