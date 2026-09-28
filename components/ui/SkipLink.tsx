import React from "react";
import { cn } from "@/lib/utils";

export function SkipLink() {
  return (
    <a
      href="#main"
      className={cn(
        "fixed top-0 left-0 z-[999] p-4 m-4 font-mono text-sm uppercase bg-[var(--color-bg)] text-[var(--color-fg)] border border-[var(--color-fg)]",
        "transition-transform -translate-y-full focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      )}
    >
      Skip to main content
    </a>
  );
}
