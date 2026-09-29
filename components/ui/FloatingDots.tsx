'use client';

import { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  angle: number;
  speed: number;
  wobble: number;
  r: number;
}

function hexWithAlpha(hex: string, alpha: number) {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** A drifting field of dots (like algae) that gently scatter away from the cursor. */
export function FloatingDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let dots: Dot[] = [];
    let fillColor = 'rgba(21, 21, 19, 0.35)';

    const mouse = { x: -9999, y: -9999 };

    function readColor() {
      const fg = getComputedStyle(document.documentElement).getPropertyValue('--color-fg').trim();
      fillColor = hexWithAlpha(fg || '#151513', 0.35);
    }

    function resize() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(28, Math.min(70, Math.round((width * height) / 24000)));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        angle: Math.random() * Math.PI * 2,
        speed: 0.12 + Math.random() * 0.16,
        wobble: 0.015 + Math.random() * 0.02,
        r: 1.1 + Math.random() * 1.6,
      }));
    }

    function onMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    readColor();
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);

    const themeObserver = new MutationObserver(readColor);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    let raf = 0;
    const repelRadius = 90;

    function tick() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (const d of dots) {
        // organic wander: the heading drifts randomly instead of a straight line
        d.angle += (Math.random() - 0.5) * d.wobble;
        d.x += Math.cos(d.angle) * d.speed;
        d.y += Math.sin(d.angle) * d.speed;

        // gently scatter away from the cursor, like algae disturbed in water
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < repelRadius) {
          const force = (1 - dist / repelRadius) * 1.1;
          d.x += (dx / (dist || 1)) * force;
          d.y += (dy / (dist || 1)) * force;
        }

        if (d.x < -12) d.x = width + 12;
        if (d.x > width + 12) d.x = -12;
        if (d.y < -12) d.y = height + 12;
        if (d.y > height + 12) d.y = -12;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    function drawStatic() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
    }

    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!prefersReducedMotion) {
        raf = requestAnimationFrame(tick);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    if (prefersReducedMotion) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" />;
}
