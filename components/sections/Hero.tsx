'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { TextReveal } from '@/components/motion/TextReveal';
import { EmbeddingSpaceScene } from '@/components/three/EmbeddingSpaceScene';
import { profile } from '@/content/profile';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  id?: string;
}

export function Hero({ id }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        }
      });

      tl.to(nameRef.current, {
        scale: 0.3,
        y: '-40vh',
        opacity: 0,
        transformOrigin: 'top left',
      }, 0)
      .to(streamRef.current, {
        opacity: 0,
        y: -50,
      }, 0.2);

    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id={id} ref={sectionRef} className="relative min-h-screen flex flex-col justify-center px-6 pt-24 overflow-hidden">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col z-10">
          <div ref={nameRef}>
            <TextReveal as="h1" className="font-display text-[var(--color-fg)] text-7xl md:text-[8rem] leading-none mb-6">
              {profile.name}
            </TextReveal>
          </div>

          <h2 className="font-mono text-sm md:text-base text-[var(--color-muted)] mb-12">
            {profile.title}
          </h2>
          
          <div ref={streamRef} className="font-mono text-xs md:text-sm text-[var(--color-fg)] max-w-lg space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-[var(--color-accent)]">p=0.94</span>
              <span className="typing-effect">Building intelligent systems.</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[var(--color-accent)]">p=0.88</span>
              <span className="typing-effect delay-100">Bridging models and interfaces.</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[var(--color-accent)]">p=0.99</span>
              <span className="typing-effect delay-200">Pushing the boundaries of UX.</span>
            </div>
          </div>
        </div>
        
        <div className="relative h-[400px] w-full border border-[var(--color-rule)] bg-[var(--color-surface)]">
          <EmbeddingSpaceScene />
        </div>
      </div>
    </section>
  );
}
