import React from "react";
import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  showRules?: boolean;
}

export function Grid({
  children,
  className,
  as: Component = "div",
  showRules = false,
}: GridProps) {
  return (
    <Component
      className={cn(
        "grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-[var(--grid-gutter)]",
        showRules && "relative before:absolute before:inset-0 before:pointer-events-none before:bg-[length:calc(100%/12)_100%] before:bg-repeat-x before:bg-[linear-gradient(to_right,var(--color-rule)_1px,transparent_1px)]",
        className
      )}
    >
      {children}
    </Component>
  );
}
