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
    <nav aria-label="Project sections" className="hidden lg:block">
      <h2 className="eyebrow">On this page</h2>
      <ul className="mt-4 space-y-0.5 border-l border-[var(--color-rule)]">
        {toc.map((entry) => {
          const active = activeId === entry.id;
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={active ? 'location' : undefined}
                className={cn(
                  '-ml-px block border-l py-1.5 pl-4 text-sm transition-colors duration-200',
                  active
                    ? 'border-[var(--color-fg)] text-[var(--color-fg)]'
                    : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)]',
                )}
              >
                {entry.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
