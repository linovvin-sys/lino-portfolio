"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DURATION, EASE, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Make sure to register plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface TextRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  type?: "chars" | "words" | "lines";
  trigger?: "scroll" | "inView";
  delay?: number;
  className?: string;
}

export function TextReveal({
  children,
  as: Component = "p",
  type = "lines",
  trigger = "scroll",
  delay = 0,
  className,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Assuming SplitText is available in your setup, otherwise you might need a custom implementation
      // or to import it correctly depending on your GSAP license.
      try {
        const split = new SplitText(containerRef.current, {
          type: type,
          linesClass: "split-line",
          wordsClass: "split-word",
          charsClass: "split-char",
        });

        if (type === "lines" || type === "words") {
           const elementsToWrap = type === 'lines' ? split.lines : split.words;
           elementsToWrap.forEach((el: Element) => {
               const wrapper = document.createElement('div');
               wrapper.style.overflow = 'hidden';
               wrapper.style.display = 'inline-block';
               el.parentNode?.insertBefore(wrapper, el);
               wrapper.appendChild(el);
           });
        }

        const elements = type === "chars" ? split.chars : type === "words" ? split.words : split.lines;

        gsap.set(elements, { y: "100%", opacity: 0 });

        gsap.to(elements, {
          y: "0%",
          opacity: 1,
          duration: DURATION.base,
          ease: EASE.out,
          stagger: STAGGER.line,
          delay: delay,
          scrollTrigger:
            trigger === "scroll"
              ? {
                  trigger: containerRef.current,
                  start: "top 85%",
                }
              : undefined,
        });
      } catch (e) {
        console.warn("SplitText plugin not found or failed. Ensure it is installed.", e);
      }
    }, containerRef);

    return () => ctx.revert();
  }, [type, trigger, delay]);

  return (
    <Component ref={containerRef as React.Ref<HTMLElement>} className={cn("", className)}>
      {children}
    </Component>
  );
}
