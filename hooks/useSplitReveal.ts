'use client';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGsap } from './useGsap';
import { useReducedMotion } from './useReducedMotion';
import { DURATION, EASE, STAGGER } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface SplitRevealProps {
  type?: 'chars' | 'words' | 'lines';
  trigger?: 'scroll' | 'immediate';
  delay?: number;
  stagger?: number;
}

export function useSplitReveal<T extends HTMLElement = HTMLHeadingElement>({
  type = 'lines',
  trigger = 'scroll',
  delay = 0,
  stagger = STAGGER.line,
}: SplitRevealProps = {}) {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useGsap(() => {
    const element = ref.current;
    if (!element) return;

    if (reducedMotion) {
      // Fallback to simple fade
      gsap.fromTo(
        element,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: DURATION.base,
          ease: EASE.out,
          delay,
          scrollTrigger: trigger === 'scroll' ? {
            trigger: element,
            start: 'top 85%',
          } : undefined,
        }
      );
      return;
    }

    const split = new SplitText(element, { type });
    const targets = split[type as keyof typeof split] as HTMLElement[];

    gsap.fromTo(
      targets,
      { 
        y: '100%', 
        autoAlpha: 0,
        rotateZ: type === 'chars' ? 5 : 0 
      },
      {
        y: '0%',
        autoAlpha: 1,
        rotateZ: 0,
        duration: DURATION.base,
        ease: EASE.out,
        stagger,
        delay,
        scrollTrigger: trigger === 'scroll' ? {
          trigger: element,
          start: 'top 85%',
        } : undefined,
      }
    );

    return () => {
      split.revert();
    };
  }, [type, trigger, delay, stagger, reducedMotion]);

  return ref;
}
