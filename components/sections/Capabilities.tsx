'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { capabilities } from '@/content/capabilities';
import { SectionHeader } from '@/components/ui/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

interface CapabilitiesProps {
  id?: string;
}

export function Capabilities({ id }: CapabilitiesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !capabilities || capabilities.length === 0) return;

    const ctx = gsap.context(() => {
      const groups = gsap.utils.toArray<HTMLElement>('.capability-group');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${groups.length * 100}%`,
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const index = Math.min(
              Math.floor(progress * groups.length),
              groups.length - 1
            );
            setActiveIndex(index);
          }
        }
      });

      // Basic scrub animation logic for groups
      groups.forEach((group, i) => {
        if (i > 0) {
          tl.fromTo(group, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1 },
            i * 1
          );
        }
        if (i < groups.length - 1) {
          tl.to(group, {
            opacity: 0,
            y: -50,
            scale: 0.95,
            duration: 1
          }, (i * 1) + 0.8);
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id={id} ref={sectionRef} className="py-24 px-6 min-h-screen flex flex-col bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
        <SectionHeader index={2} title="Capabilities" />
        
        <div className="flex items-center justify-between font-mono text-xs text-[var(--color-muted)] mt-12 mb-24 border-b border-[var(--color-rule)] pb-4">
          <span>Areas of Expertise</span>
          <span>{activeIndex + 1} / {capabilities.length}</span>
        </div>
        
        <div className="relative flex-grow">
          {capabilities.map((group, index) => (
            <div 
              key={group.title} 
              className={`capability-group absolute inset-0 flex flex-col md:flex-row gap-12 ${prefersReducedMotion ? 'relative opacity-100 mb-24' : ''}`}
              style={{ opacity: prefersReducedMotion ? 1 : index === 0 ? 1 : 0 }}
            >
              <div className="md:w-1/2">
                <h3 className="font-display text-4xl md:text-6xl text-[var(--color-fg)]">
                  {group.title}
                </h3>
                <p className="mt-6 font-mono text-sm text-[var(--color-muted)] max-w-sm">
                  {group.description}
                </p>
              </div>
              <div className="md:w-1/2">
                <ul className="space-y-6">
                  {group.items?.map(item => (
                    <li key={item.name} className="border-b border-[var(--color-rule)] pb-6 last:border-0">
                      <div className="font-body text-xl text-[var(--color-fg)]">{item.name}</div>
                      {item.detail && (
                        <div className="mt-2 font-mono text-xs text-[var(--color-muted)]">{item.detail}</div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
