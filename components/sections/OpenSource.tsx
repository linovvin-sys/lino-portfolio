'use client';

import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ClipReveal } from '@/components/motion/ClipReveal';
import { Grid } from '@/components/ui/Grid';
import { cn } from '@/lib/utils';
import { oss } from '@/content/oss';

interface OpenSourceProps {
  id?: string;
}

export function OpenSource({ id }: OpenSourceProps) {
  return (
    <section id={id} className="py-24 md:py-32 bg-[var(--color-bg)] text-[var(--color-fg)]">
      <Container>
        <SectionHeader index={5} title="Selected Open Source" />

        <Grid className="mt-16 gap-6 md:grid-cols-12">
          {oss.map((repo, i) => (
            <div
              key={repo.id}
              className={cn('col-span-12', repo.featured ? 'md:col-span-7' : 'md:col-span-5')}
            >
              <ClipReveal delay={i * 0.1}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full p-8 border border-[var(--color-rule)] hover:border-[var(--color-fg)] transition-colors duration-[var(--dur-fast)]"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-mono text-lg font-bold">{repo.name}</h3>
                    <div className="flex items-center gap-2 font-mono text-sm text-[var(--color-muted)]">
                      <span>★</span>
                      <span className="font-tabular">{repo.stars.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="font-body text-[var(--color-muted)] mb-8 min-h-[3rem]">
                    {repo.description}
                  </p>

                  <div className="flex justify-between items-center text-sm font-mono mt-auto">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] inline-block"></span>
                      <span>{repo.language}</span>
                    </div>
                    <span className="bg-[var(--color-surface)] px-2 py-1 text-[var(--color-muted)]">
                      {repo.purpose}
                    </span>
                  </div>
                </a>
              </ClipReveal>
            </div>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
