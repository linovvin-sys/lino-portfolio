"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export function Marquee({
  children,
  speed = 1,
  direction = "left",
  className,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      let xPercent = 0;
      let lastScrollY = window.scrollY;
      const dirMultiplier = direction === "left" ? -1 : 1;

      const animate = () => {
        const currentScrollY = window.scrollY;
        // Simple velocity approximation
        const velocity = Math.abs(currentScrollY - lastScrollY);
        lastScrollY = currentScrollY;

        // Base speed + extra speed based on scroll velocity
        const currentSpeed = speed + velocity * 0.05;
        
        if (xPercent <= -100) {
          xPercent = 0;
        } else if (xPercent >= 0 && direction === "right") {
          xPercent = -100;
        }
        
        xPercent += currentSpeed * 0.1 * dirMultiplier;
        
        gsap.set(trackRef.current, { xPercent });
        
        requestAnimationFrame(animate);
      };

      const req = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(req);
    }, containerRef);

    return () => ctx.revert();
  }, [speed, direction]);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden w-full relative flex", className)}
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform"
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </div>
    </div>
  );
}
