import React from "react";

export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-[999] -translate-y-24 rounded-full bg-[var(--color-fg)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] transition-transform duration-200 focus:translate-y-0"
    >
      Skip to main content
    </a>
  );
}
