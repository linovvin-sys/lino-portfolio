'use client';

import { useEffect } from 'react';

/**
 * Drives scroll-linked timeline rails: for every [data-timeline-item] inside
 * `scope`, sets --p (0..1, how far the viewport's middle has travelled through
 * the item) and data-active once it has been reached.
 */
export function TimelineProgress({ scope }: { scope: string }) {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>(`${scope} [data-timeline-item]`));
    if (items.length === 0) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const mid = window.innerHeight * 0.55;
      for (const el of items) {
        const rect = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (mid - rect.top) / rect.height));
        el.style.setProperty('--p', p.toFixed(3));
        el.toggleAttribute('data-active', p > 0);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [scope]);

  return null;
}
