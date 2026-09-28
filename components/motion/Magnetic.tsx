'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MagneticProps {
  children: React.ReactNode;
  /** Fraction of the pointer's offset from center the element follows. Keep it small. */
  strength?: number;
  className?: string;
}

/**
 * Pulls its child a few pixels toward the cursor while hovered, then eases
 * back on leave. Only on fine pointers; a no-op for touch and reduced motion.
 */
export function Magnetic({ children, strength = 0.22, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
      el.style.transition = 'transform 0.15s var(--ease-out)';
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onLeave = () => {
      el.style.transition = 'transform 0.6s var(--ease-out)';
      el.style.transform = 'translate3d(0, 0, 0)';
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={cn('inline-flex will-change-transform', className)}>
      {children}
    </span>
  );
}
