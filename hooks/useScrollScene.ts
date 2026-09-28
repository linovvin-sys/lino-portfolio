'use client';
import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from './useGsap';
import { useReducedMotion } from './useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollSceneProps {
  trigger?: React.RefObject<HTMLElement | null>;
  pin?: boolean;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  onUpdate?: (self: ScrollTrigger) => void;
  markers?: boolean;
  enabled?: boolean;
}

export function useScrollScene<T extends HTMLElement = HTMLDivElement>({
  trigger,
  pin = false,
  start = 'top top',
  end = 'bottom top',
  scrub = true,
  onUpdate,
  markers = false,
  enabled = true,
}: ScrollSceneProps = {}) {
  const reducedMotion = useReducedMotion();
  const innerRef = useRef<T>(null);
  const triggerRef = trigger || innerRef;
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useGsap(() => {
    if (!enabled || !triggerRef.current) return;

    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      pin: reducedMotion ? false : pin,
      start,
      end,
      scrub,
      markers,
      onToggle: (self) => setIsActive(self.isActive),
      onUpdate: (self) => {
        setProgress(self.progress);
        if (onUpdate) onUpdate(self);
      },
    });

    ScrollTrigger.refresh();

    return () => {
      st.kill();
    };
  }, [reducedMotion, enabled, pin, start, end, scrub, markers]); // onUpdate excluded to avoid unnecessary rebuilds if it's not memoized

  return { ref: innerRef, progress, isActive };
}
