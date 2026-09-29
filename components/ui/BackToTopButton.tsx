'use client';

import { ArrowUp } from './Icons';

/** Scrolls the current page to the top — each section now lives on its own route,
 *  so this can no longer be a plain `href="#hero"` anchor back to the homepage. */
export function BackToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="group inline-flex w-fit items-center gap-1.5 text-[13px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
    >
      Back to top
      <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5" />
    </button>
  );
}
