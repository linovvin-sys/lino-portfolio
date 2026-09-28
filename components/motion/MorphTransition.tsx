"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

interface MorphTransitionProps {
  children: React.ReactNode;
  layoutId?: string;
}

export function MorphTransition({ children, layoutId }: MorphTransitionProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!layoutId || !elRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
        // Implement Flip transition logic here if integrated with a router context
        // This is a simplified wrapper that could be expanded with page transition logic.
        // It provides the base element that would be targeted by Flip.getState().
    }, elRef);

    return () => ctx.revert();
  }, [layoutId]);

  return (
    <div ref={elRef} data-flip-id={layoutId}>
      {children}
    </div>
  );
}
