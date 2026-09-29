import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { lab } from '@/content/lab';
import { labComponents } from '@/components/lab/registry';
import { PageShell } from '@/components/ui/PageShell';
import { TagList } from '@/components/ui/Tag';

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
    title: experiment.title,
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
    <PageShell back={{ href: '/#lab', label: 'All experiments' }}>
      <header className="max-w-3xl">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-[var(--color-accent)]">Lab</span>
          <span aria-hidden="true" className="h-px w-6 bg-[var(--color-rule)]" />
          <span>{experiment.category}</span>
        </p>
        <h1 className="font-display mt-5 text-[clamp(2.5rem,1.8rem+3vw,4.25rem)] leading-[1.02] text-[var(--color-fg)]">
          {experiment.title}
        </h1>
        <p className="mt-6 max-w-2xl text-[length:var(--text-lg)] leading-relaxed text-[var(--color-muted)]">
          {experiment.description}
        </p>
        <TagList items={experiment.techStack} className="mt-6" />
      </header>

      <section className="mt-12 rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] sm:p-8">
        {Component ? (
          <Component />
        ) : (
          <p className="text-sm text-[var(--color-muted)]">This experiment doesn&apos;t have an implementation registered yet.</p>
        )}
      </section>
    </PageShell>
  );
}
