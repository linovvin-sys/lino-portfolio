import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { lab } from '@/content/lab';
import { labComponents } from '@/components/lab/registry';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return lab.map((exp) => ({ slug: exp.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const experiment = lab.find((exp) => exp.id === slug);
  if (!experiment) return { title: 'Not Found' };

  return {
    title: `${experiment.title} | Lab`,
    description: experiment.description,
  };
}

export default async function LabExperimentPage({ params }: PageProps) {
  const { slug } = await params;
  const experiment = lab.find((exp) => exp.id === slug);

  if (!experiment) {
    notFound();
  }

  const Component = labComponents[experiment.id];

  return (
    <main className="min-h-screen px-6 pt-32 pb-24">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/#lab"
          className="inline-block mb-8 font-mono text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
        >
          &larr; Back to Lab
        </Link>

        <header className="mb-12 border-b border-[var(--color-rule)] pb-12">
          <div className="flex gap-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] mb-4">
            <span>{experiment.category}</span>
            <span className="text-[var(--color-muted)]">{experiment.status}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display mb-6 leading-tight">{experiment.title}</h1>
          <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl">{experiment.description}</p>

          <ul className="mt-8 flex flex-wrap gap-2 font-mono text-xs">
            {experiment.techStack.map((tech) => (
              <li key={tech} className="px-2 py-1 border border-[var(--color-rule)] text-[var(--color-fg)]">
                {tech}
              </li>
            ))}
          </ul>
        </header>

        <section>
          {Component ? (
            <Component />
          ) : (
            <p className="font-mono text-sm text-[var(--color-muted)]">
              This experiment doesn&apos;t have an implementation registered yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
