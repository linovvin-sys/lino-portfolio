"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StackingCardsProps {
  children: React.ReactNode[];
  className?: string;
}

export function StackingCards({ children, className }: StackingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || cardsRef.current.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);

      cards.forEach((card, index) => {
        if (index === cards.length - 1) return; // Last card doesn't scale down

        const nextCard = cards[index + 1];

        gsap.to(card, {
          scale: 0.95,
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: nextCard,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
        
        ScrollTrigger.create({
            trigger: card,
            start: "top top",
            endTrigger: cards[cards.length - 1],
            end: "bottom top",
            pin: true,
            pinSpacing: false
        })
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {children.map((child, index) => (
        <div
          key={index}
          ref={(el) => {
            cardsRef.current[index] = el;
          }}
          className="relative w-full h-screen flex items-center justify-center bg-[var(--color-bg)]"
        >
          {child}
        </div>
      ))}
    </div>
  );
}
