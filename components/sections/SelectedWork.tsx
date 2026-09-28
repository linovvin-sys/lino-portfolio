'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/content/projects';
import { formatIndex, cn } from '@/lib/utils';
import { SectionHeader } from '@/components/ui/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

interface SelectedWorkProps {
  id?: string;
}

export function SelectedWork({ id }: SelectedWorkProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>('.project-row');
      
      rows.forEach((row, index) => {
        ScrollTrigger.create({
          trigger: row,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section id={id} ref={containerRef} className="py-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SectionHeader index={1} title="Selected Work" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 relative">
          <div className="flex flex-col border-t border-[var(--color-rule)]">
            {projects?.map((project, index) => (
              <a 
                key={project.slug} 
                href={`/work/${project.slug}`}
                className={cn(
                  "project-row group flex items-center justify-between py-8 border-b border-[var(--color-rule)] transition-colors duration-500",
                  activeIndex === index ? "text-[var(--color-fg)]" : "text-[var(--color-muted)] hover:text-[var(--color-fg)]"
                )}
                onMouseEnter={() => setActiveIndex(index)}
                data-cursor="view"
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-mono text-xs">{formatIndex(index + 1)}</span>
                  <h3 className="font-display text-3xl md:text-5xl">{project.title}</h3>
                </div>
                <div className="text-right font-mono text-xs hidden sm:block">
                  <p>{project.category}</p>
                  <p className="mt-1 opacity-50">{project.year}</p>
                </div>
              </a>
            ))}
          </div>
          
          <div className="hidden md:block sticky top-32 h-[60vh]">
            <div className="relative w-full h-full bg-[var(--color-surface)] border border-[var(--color-rule)] overflow-hidden">
              {projects?.map((project, index) => (
                <div 
                  key={project.slug}
                  className={cn(
                    "absolute inset-0 flex flex-col p-6 transition-opacity duration-700 ease-in-out",
                    activeIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
                  )}
                >
                  <div className="flex-grow bg-[var(--color-bg)] flex items-center justify-center border border-[var(--color-rule)]">
                    <span className="font-mono text-xs text-[var(--color-muted)]">Preview Thumbnail: {project.title}</span>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.stack?.map(tech => (
                      <span key={tech} className="font-mono text-[10px] px-2 py-1 border border-[var(--color-rule)] rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
