"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ClipRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export function ClipReveal({
  children,
  direction = "up",
  className,
}: ClipRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !innerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      let clipPath = "";
      switch (direction) {
        case "up":
          clipPath = "inset(100% 0% 0% 0%)";
          break;
        case "down":
          clipPath = "inset(0% 0% 100% 0%)";
          break;
        case "left":
          clipPath = "inset(0% 0% 0% 100%)";
          break;
        case "right":
          clipPath = "inset(0% 100% 0% 0%)";
          break;
      }

      gsap.set(containerRef.current, { clipPath });
      gsap.set(innerRef.current, { scale: 1.1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });

      tl.to(containerRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: DURATION.slow,
        ease: EASE.out,
      }).to(
        innerRef.current,
        {
          scale: 1,
          duration: DURATION.slow,
          ease: EASE.out,
        },
        "<"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [direction]);

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)}>
      <div ref={innerRef} className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
