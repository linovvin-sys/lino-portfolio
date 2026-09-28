import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  wide?: boolean;
}

export function Container({
  children,
  className,
  as: Component = "div",
  wide = false,
}: ContainerProps) {
  return React.createElement(
    Component,
    {
      className: cn(
        "mx-auto px-[var(--grid-margin)] w-full",
        !wide && "max-w-[var(--grid-max-width)]",
        className
      ),
    },
    children
  );
}
