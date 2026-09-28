import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  /** Tinted background band to separate adjacent sections */
  tone?: "default" | "surface";
}

export function Section({ id, children, className, tone = "default" }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full py-20 md:py-28",
        tone === "surface" && "border-y border-[var(--color-rule)] bg-[var(--color-surface)]",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}
