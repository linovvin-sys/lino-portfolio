"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<"dot" | "view" | "drag" | "play">("dot");
  const [isTouchDevice, setIsTouchDevice] = useState(true); // Default true, update on client

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  useGSAP(() => {
    if (isTouchDevice || !cursorRef.current) return;

    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.2, ease: "power3" });

    let lastX = 0;
    let lastY = 0;

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      
      // Calculate velocity for stretch effect
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      const scale = Math.min(velocity * 0.01 + 1, 1.5);
      
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          rotation: angle,
          scaleX: scale,
          scaleY: 1 + (1 - scale) * 0.5,
          duration: 0.1,
          ease: "none"
        });
      }

      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorType = target.closest("[data-cursor]")?.getAttribute("data-cursor");
      
      if (cursorType === "view") setCursorState("view");
      else if (cursorType === "drag") setCursorState("drag");
      else if (cursorType === "play") setCursorState("play");
      else setCursorState("dot");
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className={cn(
        "fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center -translate-x-1/2 -translate-y-1/2",
        "transition-[width,height,background-color] duration-300 ease-out"
      )}
      style={{
        width: cursorState === "dot" ? "12px" : "64px",
        height: cursorState === "dot" ? "12px" : "64px",
        backgroundColor: cursorState === "dot" ? "var(--color-fg)" : "var(--color-surface)",
        borderRadius: "999px",
        mixBlendMode: cursorState === "dot" ? "difference" : "normal",
        border: cursorState !== "dot" ? "1px solid var(--color-rule)" : "none",
      }}
    >
      <span 
        className={cn(
          "font-mono text-xs uppercase tracking-widest text-[var(--color-fg)] transition-opacity duration-300",
          cursorState !== "dot" ? "opacity-100" : "opacity-0"
        )}
      >
        {cursorState !== "dot" && cursorState}
      </span>
    </div>
  );
}
