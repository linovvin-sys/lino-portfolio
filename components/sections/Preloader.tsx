'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { DURATION, EASE, STAGGER } from '@/lib/motion';
import { profile } from '@/content/profile';

interface PreloaderProps {
  onComplete?: () => void;
}

export function Preloader({ onComplete = () => {} }: PreloaderProps) {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader');
    if (hasSeenPreloader || prefersReducedMotion) {
      setIsVisible(false);
      onComplete();
      return;
    }

    let tl: gsap.core.Timeline;

    const ctx = gsap.context(() => {
      tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('hasSeenPreloader', 'true');
          setIsVisible(false);
          onComplete();
        }
      });

      tl.fromTo('.char', 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATION.base,
          ease: EASE.out,
          stagger: STAGGER.char,
        }
      )
      .to('.char', {
        y: -50,
        opacity: 0,
        duration: DURATION.fast,
        ease: EASE.inQuart,
        stagger: STAGGER.char,
      }, '+=0.8')
      .to(container.current, {
        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
        duration: DURATION.base,
        ease: EASE.inOut,
      });
    }, container);

    const handleSkip = () => {
      tl.progress(1);
    };

    window.addEventListener('keydown', handleSkip);
    window.addEventListener('click', handleSkip);

    return () => {
      ctx.revert();
      window.removeEventListener('keydown', handleSkip);
      window.removeEventListener('click', handleSkip);
    };
  }, [onComplete, prefersReducedMotion]);

  if (!isVisible) return null;

  return (
    <div 
      ref={container}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-fg)]"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
    >
      <div ref={textRef} className="flex flex-col items-center text-center">
        <h1 className="overflow-hidden font-display text-5xl md:text-8xl">
          {profile?.name?.split('').map((char, i) => (
            <span key={i} className="char inline-block">{char === ' ' ? '\u00A0' : char}</span>
          )) || <span className="char inline-block">Portfolio</span>}
        </h1>
        <p className="overflow-hidden font-mono text-sm text-[var(--color-muted)] mt-4">
          <span className="char inline-block">Generative AI Engineer</span>
        </p>
      </div>
      <div className="absolute bottom-8 right-8 font-mono text-xs text-[var(--color-muted)] opacity-50">
        [Click or press any key to skip]
      </div>
    </div>
  );
}
