"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  intensity?: "subtle" | "medium" | "strong";
  className?: string;
}

export function ParallaxImage({
  src,
  alt,
  width,
  height,
  intensity = "medium",
  className,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      let yPercent = 0;
      switch (intensity) {
        case "subtle":
          yPercent = 10;
          break;
        case "medium":
          yPercent = 20;
          break;
        case "strong":
          yPercent = 30;
          break;
      }

      gsap.to(imageRef.current, {
        yPercent,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover w-full h-[120%] -top-[10%] relative"
        style={{ transformOrigin: "bottom" }}
      />
    </div>
  );
}
