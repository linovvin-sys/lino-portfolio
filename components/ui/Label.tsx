import React from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  showDot?: boolean;
}

export function Label({ children, showDot = false, className, ...props }: LabelProps) {
  return (
    <span 
      className={cn(
        "inline-flex items-center uppercase font-mono text-[var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-muted)]",
        className
      )}
      {...props}
    >
      {showDot && (
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mr-2 flex-shrink-0" />
      )}
      {children}
    </span>
  );
}
