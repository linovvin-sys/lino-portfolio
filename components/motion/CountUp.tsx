"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = DURATION.slow,
  decimals = 0,
  className,
}: CountUpProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setDisplayValue(value.toFixed(decimals));
      return;
    }

    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      
      gsap.to(obj, {
        val: value,
        duration: duration,
        ease: EASE.out,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
        },
        onUpdate: () => {
          setDisplayValue(obj.val.toFixed(decimals));
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [value, duration, decimals]);

  return (
    <span
      ref={containerRef}
      className={cn("font-mono tabular-nums", className)}
    >
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
