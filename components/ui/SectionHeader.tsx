import React from "react";
import { cn, formatIndex } from "@/lib/utils";

interface SectionHeaderProps {
  index: number;
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/**
 * One header pattern for every section: mono eyebrow with the section number,
 * a serif heading, an optional supporting line, and an optional action that
 * aligns to the heading's baseline on wide screens.
 */
export function SectionHeader({ index, eyebrow, title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <header
      data-reveal
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12",
        className,
      )}
    >
      <div className="max-w-2xl">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-[var(--color-accent)]">{formatIndex(index)}</span>
          <span aria-hidden="true" className="h-px w-6 bg-[var(--color-rule)]" />
          <span>{eyebrow}</span>
        </p>
        <h2 className="font-display mt-5 text-[length:var(--text-4xl)] leading-[1.05] text-[var(--color-fg)]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-5 max-w-xl text-[length:var(--text-md)] leading-relaxed text-[var(--color-muted)]">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
