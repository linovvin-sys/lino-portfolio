'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { TocEntry } from '@/lib/toc';

interface CaseStudySideNavProps {
  toc: TocEntry[];
}

export function CaseStudySideNav({ toc }: CaseStudySideNavProps) {
  const [activeId, setActiveId] = useState<string | null>(toc[0]?.id ?? null);

  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );

    for (const { id } of toc) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav aria-label="Case study sections" className="sticky top-32 hidden lg:block">
      <ul className="space-y-3 border-l border-[var(--color-rule)] pl-4">
        {toc.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className={cn(
                'font-mono text-xs uppercase tracking-wider transition-colors',
                activeId === entry.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)] hover:text-[var(--color-fg)]',
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
