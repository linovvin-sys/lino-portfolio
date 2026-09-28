import React from "react";
import { cn } from "@/lib/utils";

interface AvailabilityDotProps {
  status?: "available" | "limited" | "unavailable";
  className?: string;
}

export function AvailabilityDot({ status = "available", className }: AvailabilityDotProps) {
  const colors: Record<NonNullable<AvailabilityDotProps["status"]>, string> = {
    available: "bg-[var(--color-accent)]",
    limited: "bg-[var(--color-muted)]",
    unavailable: "bg-[var(--color-muted)]",
  };

  return (
    <span className={cn("relative flex h-2 w-2", className)}>
      {status === "available" && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            colors[status],
          )}
        />
      )}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", colors[status])} />
    </span>
  );
}
