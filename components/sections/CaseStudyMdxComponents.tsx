import type { ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import { slugifyHeading } from '@/lib/toc';

function headingText(children: ReactNode): string {
  return typeof children === 'string' ? children : '';
}

export const caseStudyMdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2
      id={slugifyHeading(headingText(children))}
      className="font-display mt-16 mb-5 text-[length:var(--text-2xl)] leading-[1.15] text-[var(--color-fg)] md:text-[2.25rem]"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-10 mb-3 text-[length:var(--text-lg)] font-medium text-[var(--color-fg)]" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-6 text-[17px] leading-[1.75] text-[var(--color-muted)]" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="mb-6 list-outside list-disc space-y-2 pl-5 text-[17px] leading-[1.7] text-[var(--color-muted)] marker:text-[var(--color-accent)]"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="mb-6 list-outside list-decimal space-y-2 pl-5 text-[17px] leading-[1.7] text-[var(--color-muted)] marker:font-mono marker:text-[13px] marker:text-[var(--color-accent)]"
      {...props}
    >
      {children}
    </ol>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-medium text-[var(--color-fg)]" {...props}>
      {children}
    </strong>
  ),
  a: ({ children, ...props }) => (
    <a className="text-[var(--color-fg)] underline decoration-[var(--color-rule)] underline-offset-4 transition-colors hover:decoration-[var(--color-fg)]" {...props}>
      {children}
    </a>
  ),
  code: ({ children, ...props }) => (
    <code className="rounded-[4px] bg-[var(--color-code-bg)] px-1.5 py-0.5 font-mono text-[0.875em] text-[var(--color-fg)]" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre
      className="mb-6 overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-code-bg)] p-5 font-mono text-sm leading-relaxed [&>code]:bg-transparent [&>code]:p-0"
      {...props}
    >
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="mb-6 border-l-2 border-[var(--color-accent)] pl-5 [&>p]:text-[var(--color-fg)]" {...props}>
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }) => (
    <div className="mb-8 overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-rule)]">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border-b border-[var(--color-rule)] bg-[var(--color-surface)] px-4 py-3 text-left font-medium text-[var(--color-fg)]"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-b border-[var(--color-rule)] px-4 py-3 text-[var(--color-muted)] [tr:last-child_&]:border-b-0" {...props}>
      {children}
    </td>
  ),
};
