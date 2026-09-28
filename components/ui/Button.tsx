import React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
}

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "group/button inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-body font-medium " +
  "transition-[background-color,border-color,color,transform,box-shadow] duration-[var(--dur-fast)] ease-[var(--ease-out)] " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-fg)] text-[var(--color-bg)] hover:bg-[color-mix(in_oklab,var(--color-fg)_86%,var(--color-bg))]",
  secondary:
    "border border-[var(--color-rule)] bg-[var(--color-surface)] text-[var(--color-fg)] shadow-[var(--shadow-card)] hover:border-[color-mix(in_oklab,var(--color-fg)_25%,var(--color-rule))]",
  ghost:
    "text-[var(--color-fg)] hover:bg-[var(--color-subtle)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const classes = cn(base, variants[variant], sizes[size], className);

    if (typeof props.href === "string") {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    );
  },
);
Button.displayName = "Button";
