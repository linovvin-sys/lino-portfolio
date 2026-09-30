'use client';

import { useEffect, useRef } from 'react';
import { isHoverSoundEnabled, playKeyClick, primeHoverSound } from '@/lib/hoverSound';

const HOVERABLE_SELECTOR = 'a, button, [role="button"]';

/** Plays a synthesized keycap click when the pointer enters a link/button, sitewide. */
export function HoverSoundProvider() {
  const lastTarget = useRef<Element | null>(null);
  const lastPlayedAt = useRef(0);

  useEffect(() => {
    function unlock() {
      primeHoverSound();
    }
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    function onPointerOver(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return;
      const target = (e.target as Element | null)?.closest(HOVERABLE_SELECTOR);
      if (!target || target === lastTarget.current) return;
      lastTarget.current = target;

      if (!isHoverSoundEnabled()) return;
      const now = performance.now();
      if (now - lastPlayedAt.current < 40) return;
      lastPlayedAt.current = now;
      playKeyClick();
    }

    function onPointerOut(e: PointerEvent) {
      const related = e.relatedTarget as Element | null;
      if (!related || !related.closest?.(HOVERABLE_SELECTOR)) {
        lastTarget.current = null;
      }
    }

    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointerout', onPointerOut);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
    };
  }, []);

  return null;
}
