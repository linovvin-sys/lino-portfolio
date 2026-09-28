'use client';
import { useRef, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useGsap<T extends HTMLElement = HTMLDivElement>(
  callback: (ctx: gsap.Context) => void,
  deps: React.DependencyList = []
) {
  const containerRef = useRef<T>(null);
  
  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context((context) => {
      callback(context);
    }, containerRef);
    
    return () => ctx.revert();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  
  return containerRef;
}
