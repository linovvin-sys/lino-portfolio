"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
}

export function HorizontalScroll({
  children,
  className,
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !scrollWrapperRef.current || isMobile) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const scrollWidth =
        scrollWrapperRef.current!.scrollWidth - window.innerWidth;

      const tl = gsap.to(scrollWrapperRef.current, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${scrollWidth}`,
        },
      });

      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${scrollWidth}`,
            scrub: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className={cn("overflow-x-auto w-full", className)}>
        <div className="flex w-max">{children}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden w-full h-screen", className)}>
      <div ref={scrollWrapperRef} className="flex h-full items-center">
        {children}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-muted)]">
        <div
          ref={progressBarRef}
          className="h-full bg-[var(--color-accent)] origin-left scale-x-0"
        />
      </div>
    </div>
  );
}
