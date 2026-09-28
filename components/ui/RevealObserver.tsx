"use client";

import { useEffect } from "react";

/**
 * Mounted once per page. Two small, delegated effects:
 *
 * 1. Scroll reveal: [data-reveal] elements fade/slide in the first time they
 *    enter the viewport. Pure CSS transition; the observer only toggles a class.
 *    Siblings can stagger via the --reveal-delay custom property.
 * 2. Cursor spotlight: any `.spotlight` card gets --mx/--my set to the pointer
 *    position so its ::before glow follows the cursor.
 */
export function RevealObserver() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let observer: IntersectionObserver | undefined;

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-revealed"));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              observer?.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
      );
      elements.forEach((el) => observer?.observe(el));
    }

    const onPointerMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest?.<HTMLElement>(".spotlight");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine) document.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      observer?.disconnect();
      if (fine) document.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return null;
}
