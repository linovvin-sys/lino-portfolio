/** Shared class strings so every lab experiment looks like part of the same site. */

export const labLabel = 'eyebrow block mb-2.5';

export const labInput =
  'w-full rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-bg)] px-4 py-2.5 font-mono text-sm text-[var(--color-fg)] ' +
  'transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-fg)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_oklab,var(--color-fg)_8%,transparent)] ' +
  'aria-[invalid=true]:border-[var(--color-accent)]';

export const labPanel = 'rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-bg)]';

export const labSegmented = 'inline-flex rounded-full border border-[var(--color-rule)] bg-[var(--color-bg)] p-1';

export const labSegment = (active: boolean) =>
  'rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-[background-color,color] duration-200 ' +
  (active ? 'bg-[var(--color-fg)] text-[var(--color-bg)]' : 'text-[var(--color-muted)] hover:text-[var(--color-fg)]');

export const labRange = 'w-full accent-[var(--color-accent)]';
