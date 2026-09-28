import React from "react";
import { cn } from "@/lib/utils";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Divider({ orientation = "horizontal", className }: DividerProps) {
  return (
    <div
      role="separator"
      className={cn(
        "bg-[var(--color-rule)]",
        orientation === "horizontal" ? "w-full h-[1px]" : "h-full w-[1px]",
        className
      )}
    />
  );
}
