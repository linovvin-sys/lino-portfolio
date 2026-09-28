'use client';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from './useReducedMotion';

interface MagneticProps {
  strength?: number;
  ease?: string;
  disabled?: boolean;
}

export function useMagnetic<T extends HTMLElement = HTMLButtonElement>({
  strength = 50,
  ease = 'power3.out',
  disabled = false,
}: MagneticProps = {}) {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled || reducedMotion) return;

    // Disable on touch devices
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouch) return;

    let xTo: (val: number) => void;
    let yTo: (val: number) => void;

    const ctx = gsap.context(() => {
      xTo = gsap.quickTo(element, 'x', { duration: 1, ease });
      yTo = gsap.quickTo(element, 'y', { duration: 1, ease });
    }, ref);

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = element.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      xTo(x * (strength / 100));
      yTo(y * (strength / 100));
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      ctx.revert();
    };
  }, [strength, ease, disabled, reducedMotion]);

  return ref;
}
