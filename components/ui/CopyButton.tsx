"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "./Icons";

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
}

export function CopyButton({ textToCopy, label = "Copy", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the address is still visible to select */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : `${label} ${textToCopy}`}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 text-xs font-medium text-[var(--color-muted)]",
        "transition-[color,border-color,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:text-[var(--color-fg)] active:scale-[0.96]",
        className,
      )}
    >
      <span className="relative h-3.5 w-3.5">
        <Copy
          className={cn(
            "absolute inset-0 h-3.5 w-3.5 transition-[opacity,transform] duration-200 ease-[var(--ease-out)]",
            copied ? "scale-50 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <Check
          className={cn(
            "absolute inset-0 h-3.5 w-3.5 text-[var(--color-accent)] transition-[opacity,transform] duration-200 ease-[var(--ease-out)]",
            copied ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
      </span>
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
