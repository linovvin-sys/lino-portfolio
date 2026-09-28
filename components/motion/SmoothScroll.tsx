'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Inertial smooth scrolling (Lenis) for wheel/trackpad input. Touch devices
 * keep native scrolling. In-page anchor links (#work, /#work) are routed
 * through Lenis so they glide instead of jumping, offset by the fixed nav.
 * Disabled entirely under prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
      if (!link) return;
      const url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = url.hash === '#' ? null : document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (url.hash !== '#' && !target) return;
      e.preventDefault();
      // Lenis already honours the scroll-padding-top set on <html>, so no extra offset
      lenis.scrollTo(target ?? 0);
      history.pushState(null, '', url.hash);
    };

    document.addEventListener('click', onClick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('click', onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
