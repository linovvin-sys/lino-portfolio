"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface ScrollFillProps {
  children: string;
  className?: string;
}

export function ScrollFill({ children, className }: ScrollFillProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      try {
        const split = new SplitText(containerRef.current, {
          type: "words,chars",
          wordsClass: "split-word",
          charsClass: "split-char",
        });

        gsap.set(split.chars, { opacity: 0.2, color: "var(--color-muted)" });

        gsap.to(split.chars, {
          opacity: 1,
          color: "var(--color-fg)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 50%",
            scrub: 1,
          },
        });
      } catch (e) {
        console.warn("SplitText error", e);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <p ref={containerRef} className={cn("", className)}>
      {children}
    </p>
  );
}
