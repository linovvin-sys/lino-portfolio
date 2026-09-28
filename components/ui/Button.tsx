import React from "react";
import { cn } from "@/lib/utils";
import { MagneticWrap } from "./MagneticWrap";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  as?: React.ElementType;
  href?: string;
  magnetic?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", as: Component = "button", magnetic = false, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-mono text-sm tracking-wide uppercase transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]";
    
    const variants = {
      primary: "bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-fg)]",
      secondary: "border border-[var(--color-fg)] bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-surface)]",
      ghost: "bg-transparent text-[var(--color-fg)] hover:underline decoration-[var(--color-accent)] underline-offset-4",
    };

    const sizes = {
      sm: "h-8 px-4",
      md: "h-12 px-6",
      lg: "h-16 px-8 text-base",
    };

    const classes = cn(baseClasses, variants[variant], sizes[size], className);

    const button = (
      <Component ref={ref} className={classes} {...props} />
    );

    if (magnetic) {
      return <MagneticWrap>{button}</MagneticWrap>;
    }

    return button;
  }
);
Button.displayName = "Button";
