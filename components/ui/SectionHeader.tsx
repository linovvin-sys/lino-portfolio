import React from "react";
import { cn, formatIndex } from "@/lib/utils";

interface SectionHeaderProps {
  index: number;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ index, title, subtitle, className }: SectionHeaderProps) {
  return (
    <header className={cn("relative mb-8 pb-4 border-b border-[var(--color-rule)]", className)}>
      <div className="flex flex-col md:flex-row md:items-baseline">
        <span className="font-mono text-[var(--color-muted)] text-sm mb-2 md:mb-0 md:absolute md:-left-12 md:top-2">
          {formatIndex(index)}
        </span>
        <h2 className="font-display text-4xl md:text-5xl text-[var(--color-fg)]">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-4 font-body text-[var(--color-muted)] max-w-2xl">
          {subtitle}
        </p>
      )}
    </header>
  );
}
