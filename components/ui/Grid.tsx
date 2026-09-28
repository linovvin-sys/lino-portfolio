import React from "react";
import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function Grid({ children, className, as: Component = "div" }: GridProps) {
  return React.createElement(
    Component,
    { className: cn("grid grid-cols-12 gap-x-[var(--grid-gap)]", className) },
    children,
  );
}
