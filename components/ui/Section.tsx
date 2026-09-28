import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  /**
   * "surface": tinted band to separate adjacent sections.
   * "inverse": a dark band (scopes the dark theme tokens to this section).
   */
  tone?: "default" | "surface" | "inverse";
}

export function Section({ id, children, className, tone = "default" }: SectionProps) {
  return (
    <section
      id={id}
      data-theme={tone === "inverse" ? "dark" : undefined}
      className={cn(
        "w-full py-20 md:py-28",
        tone === "surface" && "border-y border-[var(--color-rule)] bg-[var(--color-surface)]",
        tone === "inverse" && "border-y border-[var(--color-rule)] bg-[var(--color-bg)] text-[var(--color-fg)]",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}
