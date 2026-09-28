'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AvailabilityDot } from '@/components/ui/AvailabilityDot';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useLocalTime } from '@/hooks/useLocalTime';
import { profile } from '@/content/profile';

gsap.registerPlugin(ScrollTrigger);

export function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const time = useLocalTime(profile.timezone);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(navRef.current, {
        scrollTrigger: {
          start: 'top -50',
          end: 'top -100',
          toggleActions: 'play none none reverse',
          scrub: true,
        },
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-rule)',
        duration: 0.3,
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 transition-colors opacity-0 animate-fade-in" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
      <div className="flex items-center space-x-4">
        <a href="#top" className="font-display text-2xl tracking-wide text-[var(--color-fg)]">
          {profile.name}
        </a>
      </div>
      <div className="flex items-center space-x-6 font-mono text-xs text-[var(--color-muted)]">
        <span className="hidden md:inline-block">{time}</span>
        <div className="group relative flex items-center cursor-help">
          <AvailabilityDot status={profile.availability.status} />
          <span className="absolute right-0 top-full mt-2 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--color-surface)] border border-[var(--color-rule)] p-2 rounded pointer-events-none">
            {profile.availability.message}
          </span>
        </div>
        <ThemeToggle />
        <span className="hidden md:inline-block border border-[var(--color-rule)] rounded px-2 py-1">Cmd+K</span>
      </div>
    </nav>
  );
}
