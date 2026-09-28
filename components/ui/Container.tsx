import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  size?: "default" | "narrow";
}

export function Container({ children, className, as: Component = "div", size = "default" }: ContainerProps) {
  return React.createElement(
    Component,
    {
      className: cn(
        "mx-auto w-full px-[var(--grid-margin)]",
        size === "default" ? "max-w-[calc(var(--grid-max-width)+var(--grid-margin)*2)]" : "max-w-[calc(760px+var(--grid-margin)*2)]",
        className,
      ),
    },
    children,
  );
}
