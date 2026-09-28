import type { ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import { slugifyHeading } from '@/lib/toc';

function headingText(children: ReactNode): string {
  return typeof children === 'string' ? children : '';
}

export const caseStudyMdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2 id={slugifyHeading(headingText(children))} className="font-display text-3xl md:text-4xl mt-16 mb-6 scroll-mt-32" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="font-display text-xl md:text-2xl mt-10 mb-4" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="font-body text-[var(--color-muted)] leading-relaxed mb-6" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-outside pl-5 space-y-2 text-[var(--color-muted)] mb-6" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-outside pl-5 space-y-2 text-[var(--color-muted)] mb-6" {...props}>
      {children}
    </ol>
  ),
  strong: ({ children, ...props }) => (
    <strong className="text-[var(--color-fg)] font-semibold" {...props}>
      {children}
    </strong>
  ),
  code: ({ children, ...props }) => (
    <code className="font-mono text-sm bg-[var(--color-code-bg)] px-1.5 py-0.5 rounded-sm" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre className="font-mono text-sm bg-[var(--color-code-bg)] border border-[var(--color-rule)] p-4 overflow-x-auto mb-6" {...props}>
      {children}
    </pre>
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-sm font-mono border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th className="text-left border-b border-[var(--color-rule)] py-2 pr-4 text-[var(--color-fg)]" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-b border-[var(--color-rule)] py-2 pr-4 text-[var(--color-muted)]" {...props}>
      {children}
    </td>
  ),
};
