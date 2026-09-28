'use client';

import { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Label } from '@/components/ui/Label';
import { HorizontalScroll } from '@/components/motion/HorizontalScroll';
import { cn } from '@/lib/utils';
import { writing } from '@/content/writing';
import type { Writing } from '@/content/schemas';

interface ResearchProps {
  id?: string;
}

export function Research({ id }: ResearchProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id={id} ref={containerRef} className="py-24 md:py-32 bg-[var(--color-bg)] text-[var(--color-fg)] overflow-hidden">
      <Container>
        <SectionHeader index={4} title="Research, Writing & Talks" />
      </Container>

      <div className="mt-16 hidden md:block">
        <HorizontalScroll>
          <div className="flex gap-8 px-[var(--space-16)] h-[50vh] items-center">
            {writing.map((item) => (
              <ResearchCard key={item.id} item={item} />
            ))}
          </div>
        </HorizontalScroll>
      </div>

      <div className="mt-16 flex flex-col gap-8 px-6 md:hidden">
        {writing.map((item) => (
          <ResearchCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function ResearchCard({ item }: { item: Writing }) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between shrink-0 bg-[var(--color-surface)] border border-[var(--color-rule)] p-8 h-full min-h-[300px]',
        item.featured ? 'w-[80vw] md:w-[600px]' : 'w-[80vw] md:w-[400px]',
      )}
    >
      <div className="flex justify-between items-start mb-8">
        <Label className="uppercase text-[var(--color-accent)]">{item.type}</Label>
        <span className="font-mono text-sm text-[var(--color-muted)]">{item.date}</span>
      </div>
      <div>
        <h3 className="font-display text-2xl md:text-3xl mb-4">{item.title}</h3>
        <p className="font-body text-[var(--color-muted)] mb-6">{item.description}</p>
        {item.venue && (
          <div className="font-mono text-sm bg-[var(--color-code-bg)] inline-block px-3 py-1 rounded-sm">
            {item.venue}
          </div>
        )}
      </div>
    </div>
  );
}
