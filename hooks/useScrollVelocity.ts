'use client';
import { useState, useEffect } from 'react';
import { useLenis } from './useLenis';

export function useScrollVelocity() {
  const [velocity, setVelocity] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onScroll = (e: { velocity: number }) => {
      setVelocity(e.velocity);
    };

    lenis.on('scroll', onScroll);

    return () => {
      lenis.off('scroll', onScroll);
    };
  }, [lenis]);

  return velocity;
}
