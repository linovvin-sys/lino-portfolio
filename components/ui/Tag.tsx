import React from "react";
import { cn } from "@/lib/utils";

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full border border-[var(--color-rule)] px-2.5 font-mono text-[11px] leading-none text-[var(--color-muted)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TagList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
