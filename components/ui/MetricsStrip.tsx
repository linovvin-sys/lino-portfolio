"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Divider } from "./Divider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Metric {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

interface MetricsStripProps {
  metrics: Metric[];
  className?: string;
}

export function MetricsStrip({ metrics, className }: MetricsStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    numbersRef.current.forEach((el, index) => {
      if (!el) return;
      const metric = metrics[index];
      if (!metric) return;

      gsap.fromTo(
        el,
        { innerHTML: 0 },
        {
          innerHTML: metric.value,
          duration: 2,
          ease: "power2.out",
          snap: { innerHTML: 1 },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
    });
  }, { scope: containerRef, dependencies: [metrics] });

  return (
    <div ref={containerRef} className={cn("w-full border-y border-[var(--color-rule)]", className)}>
      <div className="flex flex-col md:flex-row">
        {metrics.map((metric, i) => (
          <React.Fragment key={metric.label}>
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-[var(--text-xs)] uppercase tracking-[var(--tracking-label)] text-[var(--color-muted)] mb-2">
                {metric.label}
              </span>
              <div className="font-mono text-2xl text-[var(--color-fg)]">
                {metric.prefix}
                <span ref={(el) => { numbersRef.current[i] = el; }}>
                  0
                </span>
                {metric.suffix}
              </div>
            </div>
            {i < metrics.length - 1 && (
              <Divider orientation="vertical" className="hidden md:block h-auto" />
            )}
            {i < metrics.length - 1 && (
              <Divider orientation="horizontal" className="block md:hidden" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
