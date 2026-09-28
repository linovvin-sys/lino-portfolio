"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface MagneticWrapProps {
  children: React.ReactElement;
  strength?: number;
  disabled?: boolean;
}

export function MagneticWrap({ children, strength = 0.5, disabled = false }: MagneticWrapProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (disabled || !wrapperRef.current) return;

    const element = wrapperRef.current;
    
    const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = element.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) * strength;
      const y = (clientY - (top + height / 2)) * strength;
      xTo(x);
      yTo(y);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, { scope: wrapperRef, dependencies: [disabled, strength] });

  return (
    <div ref={wrapperRef} className="inline-block relative">
      {children}
    </div>
  );
}
