"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface DrawLineProps {
  d: string;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export function DrawLine({
  d,
  className,
  color = "var(--color-fg)",
  strokeWidth = 2,
}: DrawLineProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
       gsap.set(pathRef.current, { strokeDashoffset: 0 });
       return;
    }

    const ctx = gsap.context(() => {
      const length = pathRef.current!.getTotalLength();

      gsap.set(pathRef.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: pathRef.current,
          start: "top 80%",
          end: "bottom 50%",
          scrub: true,
        },
      });
    }, pathRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      className={cn("w-full h-full overflow-visible", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        ref={pathRef}
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
