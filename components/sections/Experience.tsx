'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { experience } from '@/content/experience';
import { SectionHeader } from '@/components/ui/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceProps {
  id?: string;
}

export function Experience({ id }: ExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Draw line animation
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
        
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: true,
          }
        });
      }

      // Pin roles briefly
      const roles = gsap.utils.toArray<HTMLElement>('.role-item');
      roles.forEach(role => {
        ScrollTrigger.create({
          trigger: role,
          start: 'center center',
          end: '+=200',
          pin: true,
          pinSpacing: false,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id={id} ref={sectionRef} className="py-24 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <SectionHeader index={3} title="Experience" />
        
        <div className="relative mt-24 pl-8 md:pl-16">
          <svg className="absolute left-0 top-0 w-4 h-full hidden md:block" preserveAspectRatio="none">
            <path 
              ref={lineRef}
              d="M 2 0 L 2 10000" 
              className="stroke-[var(--color-rule)] stroke-[2px] fill-none" 
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="space-y-32">
            {experience.map((role) => (
              <div key={role.id} className="role-item relative">
                <div className="absolute -left-10 md:-left-18 top-2 w-4 h-4 rounded-full bg-[var(--color-bg)] border-2 border-[var(--color-accent)] z-10" />

                <div className="mb-4 flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                  <h3 className="font-display text-3xl md:text-4xl text-[var(--color-fg)]">
                    {role.role}
                  </h3>
                  <div className="font-mono text-xs text-[var(--color-muted)]">
                    {role.period.start} — {role.period.end} · {role.location}
                  </div>
                </div>

                <div className="font-mono text-sm text-[var(--color-fg)] mb-8">
                  {role.company}
                </div>

                <p className="font-body text-[var(--color-muted)] mb-6">{role.description}</p>

                <ul className="space-y-4 font-body text-[var(--color-muted)]">
                  {role.impacts.map((item) => (
                    <li key={item.metric} className="flex items-start gap-4">
                      <span className="mt-1.5 font-mono text-xs text-[var(--color-accent)] whitespace-nowrap">{item.metric}</span>
                      <span>{item.description}</span>
                    </li>
                  ))}
                </ul>
                
                {role.stack && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {role.stack.map(tech => (
                      <span key={tech} className="font-mono text-[10px] px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-rule)] rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
