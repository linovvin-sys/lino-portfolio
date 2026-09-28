/**
 * Utility functions — pure helpers, no side effects.
 */

import { type ClassValue, clsx } from "clsx";

/** Merge class names with clsx (Tailwind-safe) */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Format index number with zero-padding: 1 → "01" */
export function formatIndex(n: number, pad = 2): string {
  return String(n).padStart(pad, "0");
}

/** Format date string to readable: "2024-03" → "Mar 2024" */
export function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  if (!year) return dateStr;
  if (!month) return year;
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** Get current local time string */
export function getLocalTime(timezone: string): string {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/** Map a value from one range to another */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/** Generate a unique ID */
export function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Debounce function */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/** Throttle function using requestAnimationFrame */
export function rafThrottle<T extends (...args: Parameters<T>) => void>(
  fn: T,
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  return (...args: Parameters<T>) => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      fn(...args);
      rafId = null;
    });
  };
}

/** Check if we're on the server */
export const isServer = typeof window === "undefined";

/** Truncate text with ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + "…";
}
