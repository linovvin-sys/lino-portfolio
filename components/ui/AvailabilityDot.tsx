import React from "react";
import { cn } from "@/lib/utils";

interface AvailabilityDotProps {
  status?: "available" | "limited" | "unavailable";
  className?: string;
}

export function AvailabilityDot({ status = "available", className }: AvailabilityDotProps) {
  const color = status === "available" ? "bg-emerald-500" : status === "limited" ? "bg-amber-500" : "bg-[var(--color-muted)]";

  return (
    <span className={cn("relative inline-flex h-2 w-2 shrink-0", className)} aria-hidden="true">
      {status === "available" && <span className={cn("animate-pulse-ring absolute inset-0 rounded-full", color)} />}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", color)} />
    </span>
  );
}
