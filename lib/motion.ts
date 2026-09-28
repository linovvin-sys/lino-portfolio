/**
 * Motion Configuration — Single source of truth for all animation parameters.
 *
 * Import from here. Never hard-code durations, easings, or stagger values.
 * All GSAP timelines, ScrollTrigger configs, and Framer Motion variants
 * should reference these constants.
 */

import { gsap } from "gsap";

/* ── Durations ────────────────────────────────────── */
export const DURATION = {
  fast: 0.4,
  base: 0.7,
  slow: 1.1,
  preloader: 1.6,
} as const;

/* ── Easings ──────────────────────────────────────── */

/**
 * Signature custom ease: aggressive initial acceleration with a soft,
 * slightly overshooting landing. Think of a precision instrument needle
 * settling into place.
 */
export const EASE_SIGNATURE = "signature";

// Register custom ease on module load
if (typeof window !== "undefined") {
  try {
    gsap.registerEase?.(EASE_SIGNATURE, (progress: number) => {
      // Custom cubic bezier approximation: aggressive out with 2% overshoot
      const t = progress;
      const overshoot = 1.02;
      return t === 1
        ? 1
        : overshoot * (-Math.pow(2, -12 * t) + 1) -
            (overshoot - 1) * Math.pow(1 - t, 3);
    });
  } catch {
    // CustomEase plugin may handle this differently
  }
}

export const EASE = {
  /** Snappy entrance — elements appearing */
  out: "expo.out",
  /** Elegant traversal — elements moving between states */
  inOut: "quart.inOut",
  /** Portfolio fingerprint — signature feel */
  signature: EASE_SIGNATURE,
  /** Linear for scrubbed scroll animations */
  linear: "none",
  /** Soft exit */
  inQuart: "quart.in",
} as const;

/* ── Stagger ──────────────────────────────────────── */
export const STAGGER = {
  char: 0.02,
  word: 0.04,
  line: 0.08,
  item: 0.06,
  grid: 0.08,
} as const;

/* ── ScrollTrigger Defaults ───────────────────────── */
export const SCROLL_DEFAULTS = {
  /** Standard reveal: starts when element top hits 85% of viewport */
  reveal: {
    start: "top 85%",
    end: "bottom 20%",
    toggleActions: "play none none none" as const,
  },
  /** Scrubbed: animation progress tied to scroll position */
  scrub: {
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
  },
  /** Pinned section defaults */
  pin: {
    pin: true,
    scrub: 1,
    anticipatePin: 1,
  },
} as const;

/* ── Framer Motion Variants ───────────────────────── */
export const VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: DURATION.base, ease: [0.16, 1, 0.3, 1] },
  },
  slideUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: DURATION.base, ease: [0.16, 1, 0.3, 1] },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: DURATION.fast, ease: [0.16, 1, 0.3, 1] },
  },
  /** For clip-path reveals */
  clipReveal: {
    initial: { clipPath: "inset(100% 0% 0% 0%)" },
    animate: { clipPath: "inset(0% 0% 0% 0%)" },
    transition: { duration: DURATION.slow, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

/* ── Framer Motion cubic bezier easings ──────────── */
export const MOTION_EASE = {
  /** Matches expo.out */
  out: [0.16, 1, 0.3, 1] as const,
  /** Matches quart.inOut */
  inOut: [0.76, 0, 0.24, 1] as const,
  /** Signature ease for Framer Motion */
  signature: [0.22, 1.15, 0.36, 1] as const,
} as const;

/* ── Breakpoints (match Tailwind) ─────────────────── */
export const BREAKPOINT = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/* ── Parallax Intensity ───────────────────────────── */
export const PARALLAX = {
  subtle: 30,
  medium: 60,
  strong: 100,
} as const;

/* ── Pin Lengths (in viewport heights) ────────────── */
export const PIN_LENGTH = {
  hero: 150,
  capabilities: 120,
  experience: 100,
  horizontal: 100,
  stacking: 80,
} as const;

/* ── Utility: Reduced Motion Check ────────────────── */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ── Utility: WebGL Support Check ─────────────────── */
export function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

/* ── Utility: Touch Device Check ──────────────────── */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
