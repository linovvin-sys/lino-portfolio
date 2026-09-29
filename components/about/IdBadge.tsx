'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { profile } from '@/content/profile';
import { roadmap } from '@/content/roadmap';

/*
 * A lanyard ID badge you can grab and drag anywhere. The strap is a flexible
 * ribbon that stretches and bends; let go and the badge springs back with a
 * bouncy, underdamped wobble. Hovering tilts the card in 3D; clicking flips
 * it to show quick facts on the back.
 */

const STRAP = 112; // resting strap length (px)
const PIVOT_X = 136; // strap hangs from the top center of the 272px-wide badge
const STIFFNESS = 170; // spring pull back to rest: higher = snappier
const DAMPING = 9; // side-to-side: lower = more bounce before it settles
const DAMPING_Y = 15; // up-and-down settles faster, like a weight on a strap
const MIN_Y = -STRAP * 0.55; // it can bounce up, but never above its own hook
const MAX_REACH = STRAP * 2.6; // how far it can be pulled before it resists
const CLICK_SLOP = 6; // px of movement before a press counts as a drag

function initials(name: string) {
  const parts = name.split(' ').filter(Boolean);
  const middle = parts.findIndex((p) => p.endsWith('.'));
  const surname = middle >= 0 ? parts[middle + 1] : parts[parts.length - 1];
  return ((parts[0]?.[0] ?? '') + (surname?.[0] ?? '')).toUpperCase();
}

/** Deterministic barcode bars from a string, purely decorative. */
function barcode(seed: string) {
  let h = 2166136261;
  return Array.from({ length: 34 }, (_, i) => {
    h ^= seed.charCodeAt(i % seed.length) + i;
    h = Math.imul(h, 16777619);
    return 1 + (Math.abs(h) % 3);
  });
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function IdBadge() {
  const rootRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const strapRef = useRef<SVGPathElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const photoRef = useRef<HTMLImageElement>(null);
  const [grabbing, setGrabbing] = useState(false);
  const strapId = useId().replace(/:/g, '');

  // (x, y) = how far the strap's end has been pulled from where it rests
  const sim = useRef({ x: 0, y: 0, vx: 0, vy: 0, dragging: false, frame: 0, last: 0, reduced: false });
  const press = useRef({ x: 0, y: 0, grabX: 0, grabY: 0, moved: false, lastX: 0, lastY: 0, lastTime: 0 });

  const render = () => {
    const { x, y, vx, vy } = sim.current;
    const endX = PIVOT_X + x;
    const endY = STRAP + y;

    // The badge hangs along the strap, plus a little extra lean from its speed
    const lean = clamp(-vx * 0.025, -22, 22);
    const angle = (-Math.atan2(x, Math.max(20, endY)) * 180) / Math.PI + lean;
    if (badgeRef.current) {
      badgeRef.current.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${angle.toFixed(2)}deg)`;
    }

    // Ribbon: trails behind the motion, and bows out when it has slack
    const length = Math.hypot(endX - PIVOT_X, endY);
    const slack = Math.max(0, STRAP - length);
    const bow = slack * 0.9 * (x >= 0 ? -1 : 1);
    const cx = (PIVOT_X + endX) / 2 + clamp(-vx * 0.06, -60, 60) + bow;
    const cy = endY / 2 + clamp(-vy * 0.04, -40, 40);
    strapRef.current?.setAttribute('d', `M${PIVOT_X} 0 Q${cx.toFixed(1)} ${cy.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`);
  };

  const step = (now: number) => {
    const s = sim.current;
    const dt = Math.min(0.032, (now - s.last) / 1000 || 0.016);
    s.last = now;
    if (!s.dragging) {
      // Underdamped spring back to rest: overshoots and wobbles, then settles
      s.vx += (-STIFFNESS * s.x - DAMPING * s.vx) * dt;
      s.vy += (-STIFFNESS * s.y - DAMPING_Y * s.vy) * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.y < MIN_Y) {
        s.y = MIN_Y;
        s.vy = Math.abs(s.vy) * 0.3; // soft bounce off the top
      }
    }
    render();
    const moving = Math.abs(s.x) + Math.abs(s.y) > 0.1 || Math.abs(s.vx) + Math.abs(s.vy) > 0.5;
    if (s.dragging || moving) {
      s.frame = requestAnimationFrame(step);
    } else {
      Object.assign(s, { x: 0, y: 0, vx: 0, vy: 0, frame: 0 });
      render();
    }
  };

  const kick = (vx: number, vy = 0) => {
    const s = sim.current;
    if (s.reduced) return;
    s.vx += vx;
    s.vy += vy;
    if (!s.frame) {
      s.last = performance.now();
      s.frame = requestAnimationFrame(step);
    }
  };

  // The image may finish loading before hydration attaches onLoad
  useEffect(() => {
    const img = photoRef.current;
    if (img?.complete && img.naturalWidth > 0) setPhotoLoaded(true);
  }, []);

  // Drop in with a bounce the first time the badge scrolls into view
  useEffect(() => {
    sim.current.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = rootRef.current;
    if (!el || sim.current.reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          io.disconnect();
          sim.current.x = 36;
          sim.current.y = -70;
          kick(0);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    const state = sim.current;
    return () => {
      io.disconnect();
      cancelAnimationFrame(state.frame);
    };
    // kick/step only touch refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const root = rootRef.current!.getBoundingClientRect();
    const s = sim.current;
    press.current = {
      x: e.clientX,
      y: e.clientY,
      // where on the badge it was grabbed, relative to the strap's end
      grabX: e.clientX - (root.left + PIVOT_X + s.x),
      grabY: e.clientY - (root.top + STRAP + s.y),
      moved: false,
      lastX: s.x,
      lastY: s.y,
      lastTime: performance.now(),
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    // 3D tilt + sheen follow the pointer while hovering
    const card = cardRef.current;
    if (card && !sim.current.dragging) {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--rx', `${(-py * 10).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${(px * 12).toFixed(2)}deg`);
      card.style.setProperty('--gx', `${((px + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty('--gy', `${((py + 0.5) * 100).toFixed(1)}%`);
    }

    if (!e.currentTarget.hasPointerCapture(e.pointerId) || sim.current.reduced) return;
    const p = press.current;
    if (!p.moved && Math.hypot(e.clientX - p.x, e.clientY - p.y) < CLICK_SLOP) return;
    const s = sim.current;
    if (!p.moved) {
      p.moved = true;
      s.dragging = true;
      setGrabbing(true);
      card?.style.setProperty('--rx', '0deg');
      card?.style.setProperty('--ry', '0deg');
      kick(0);
    }

    const root = rootRef.current!.getBoundingClientRect();
    let x = e.clientX - p.grabX - root.left - PIVOT_X;
    let y = e.clientY - p.grabY - root.top - STRAP;
    // Rubber-band: past MAX_REACH from the pivot, the strap resists
    const reach = Math.hypot(x, STRAP + y);
    if (reach > MAX_REACH) {
      const eased = MAX_REACH + (reach - MAX_REACH) * 0.25;
      x *= eased / reach;
      y = (STRAP + y) * (eased / reach) - STRAP;
    }

    const now = performance.now();
    const dt = Math.max(0.008, (now - p.lastTime) / 1000);
    // smoothed velocity so the release fling feels natural
    s.vx = s.vx * 0.5 + ((x - p.lastX) / dt) * 0.5;
    s.vy = s.vy * 0.5 + ((y - p.lastY) / dt) * 0.5;
    s.x = x;
    s.y = y;
    p.lastX = x;
    p.lastY = y;
    p.lastTime = now;
  };

  const release = (e: React.PointerEvent) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    const s = sim.current;
    if (press.current.moved) {
      s.dragging = false;
      s.vx = clamp(s.vx, -2600, 2600);
      s.vy = clamp(s.vy, -2600, 2600);
      setGrabbing(false);
      kick(0);
    } else {
      setFlipped((f) => !f);
      kick(flipped ? -120 : 120, -160);
    }
  };

  const onPointerLeave = () => {
    const card = cardRef.current;
    card?.style.setProperty('--rx', '0deg');
    card?.style.setProperty('--ry', '0deg');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFlipped((f) => !f);
    } else if (e.key === 'ArrowLeft') {
      kick(-700);
    } else if (e.key === 'ArrowRight') {
      kick(700);
    } else if (e.key === 'ArrowUp') {
      kick(0, -700);
    } else if (e.key === 'ArrowDown') {
      kick(0, 700);
    }
  };

  const learning = roadmap
    .filter((s) => s.status === 'in-progress')
    .flatMap((s) => s.items.filter((i) => !i.done).map((i) => i.name))
    .slice(0, 3);
  const bars = barcode(profile.name);

  return (
    <div ref={rootRef} className="relative mx-auto w-[272px]">
      {/* ceiling hook */}
      <span aria-hidden="true" className="absolute -top-1.5 left-1/2 z-20 h-3 w-10 -translate-x-1/2 rounded-full bg-[var(--color-rule)]" />

      {/* flexible lanyard strap, redrawn every frame */}
      <svg aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-0 overflow-visible" width={272} height={STRAP}>
        <path
          id={strapId}
          ref={strapRef}
          d={`M${PIVOT_X} 0 Q${PIVOT_X} ${STRAP / 2} ${PIVOT_X} ${STRAP}`}
          fill="none"
          strokeWidth={22}
          className="stroke-[var(--color-accent)]"
        />
        <text dy={3} className="fill-white/85 font-mono" fontSize={8.5} letterSpacing="2.2">
          <textPath href={`#${strapId}`} startOffset="10">
            NCST · NETDEVOPS · NCST
          </textPath>
        </text>
      </svg>

      <div ref={badgeRef} className="relative z-10 will-change-transform" style={{ marginTop: STRAP, transformOrigin: `${PIVOT_X}px 0px` }}>
        {/* metal clip */}
        <div aria-hidden="true" className="mx-auto -mt-px h-5 w-9 rounded-b-md border-2 border-t-0 border-[var(--color-muted)] bg-[var(--color-subtle)]" />

        <div
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-label={`ID badge for ${profile.name}. Drag it around, arrow keys bounce it, Enter flips it${flipped ? ' back' : ''}.`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={release}
          onPointerCancel={release}
          onPointerLeave={onPointerLeave}
          onKeyDown={onKeyDown}
          className={cn('-mt-1 touch-none [perspective:1000px] outline-none', grabbing ? 'cursor-grabbing' : 'cursor-grab')}
        >
          {/* tilt layer: follows the pointer quickly */}
          <div
            ref={cardRef}
            className="relative h-[392px] w-[272px] transition-transform duration-200 ease-out [transform-style:preserve-3d]"
            style={{ transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))' }}
          >
          {/* flip layer: springy half-turn */}
          <div
            className="relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.34,1.3,0.64,1)] [transform-style:preserve-3d]"
            style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}
          >
            {/* ── Front ── */}
            <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[18px] border border-[var(--color-rule)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-pop)] [backface-visibility:hidden]">
              <span aria-hidden="true" className="mx-auto h-2 w-12 rounded-full bg-[var(--color-bg)] shadow-[inset_0_1px_2px_rgb(0_0_0/0.15)]" />
              <div className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-[0.12em] text-[var(--color-muted)]">
                <span>NETWORK OPS · ACCESS</span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  ONLINE
                </span>
              </div>

              <div className="relative mt-3 aspect-[5/4.4] overflow-hidden rounded-[12px] bg-[var(--color-fg)]">
                {/* Monogram is the fallback while there's no photo (or it hasn't loaded yet);
                    it fades out once the photo is up so it doesn't show through any
                    transparent background in the photo itself. */}
                <div
                  className={cn(
                    'absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--color-accent)_55%,transparent),transparent_60%)] transition-opacity duration-500',
                    photoLoaded ? 'opacity-0' : 'opacity-100',
                  )}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(var(--color-bg)_1px,transparent_1px),linear-gradient(90deg,var(--color-bg)_1px,transparent_1px)] [background-size:18px_18px]"
                  />
                  <span className="font-display relative text-[5.5rem] leading-none text-[var(--color-bg)]">{initials(profile.name)}</span>
                </div>
                {profile.photo && (
                  <Image
                    ref={photoRef}
                    src={profile.photo}
                    alt={`Photo of ${profile.name}`}
                    fill
                    sizes="272px"
                    draggable={false}
                    // The photo is deliberately pixel art: skip Next's built-in image
                    // optimizer (it resizes with smooth resampling, which would blur the
                    // blocks) and force nearest-neighbor scaling in the browser instead.
                    unoptimized
                    style={{ imageRendering: 'pixelated' }}
                    // next/image also calls onLoad for images that failed (they're "complete"
                    // too), so only count it as loaded if it actually has pixels
                    onLoad={(e) => setPhotoLoaded(e.currentTarget.naturalWidth > 0)}
                    onError={() => setPhotoLoaded(false)}
                    className={cn(
                      'pointer-events-none object-cover transition-opacity duration-500',
                      photoLoaded ? 'visible opacity-100' : 'invisible opacity-0',
                    )}
                  />
                )}
              </div>

              <p className="font-display mt-4 text-[1.6rem] leading-[1.05] text-[var(--color-fg)]">{profile.name}</p>
              <p className="mt-1 text-[13px] text-[var(--color-muted)]">{profile.title}</p>

              <div className="mt-auto flex items-end justify-between">
                <dl className="font-mono text-[10px] leading-[1.6] text-[var(--color-muted)]">
                  <div className="flex gap-2">
                    <dt>IP</dt>
                    <dd className="text-[var(--color-fg)]">127.0.0.1</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt>VLAN</dt>
                    <dd className="text-[var(--color-fg)]">3 · BSIT</dd>
                  </div>
                </dl>
                <span aria-hidden="true" className="flex h-7 items-stretch gap-[1.5px]">
                  {bars.map((w, i) => (
                    <span key={i} className={i % 2 ? 'bg-transparent' : 'bg-[var(--color-fg)]'} style={{ width: w }} />
                  ))}
                </span>
              </div>

              {/* soft sheen that moves with the tilt */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[18px] [background:radial-gradient(260px_circle_at_var(--gx,50%)_var(--gy,0%),rgb(255_255_255/0.22),transparent_60%)] dark:[background:radial-gradient(260px_circle_at_var(--gx,50%)_var(--gy,0%),rgb(255_255_255/0.07),transparent_60%)]"
              />
            </div>

            {/* ── Back ── */}
            <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[18px] border border-[var(--color-rule)] bg-[var(--color-fg)] p-5 text-[var(--color-bg)] shadow-[var(--shadow-pop)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <span aria-hidden="true" className="mx-auto h-2 w-12 rounded-full bg-[var(--color-bg)]/15" />
              <p className="mt-3 font-mono text-[10px] tracking-[0.12em] opacity-60">QUICK FACTS</p>
              <dl className="mt-3 space-y-2.5 text-[13px]">
                {[
                  ['Currently', '3rd-year B.S. IT · NCST'],
                  ['Aiming for', profile.title.replace('Aspiring ', '')],
                  ['Based in', profile.location],
                  ['Status', 'Open to OJT / internships'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[10px] tracking-[0.1em] opacity-55">{k?.toUpperCase()}</dt>
                    <dd className="mt-0.5 leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 font-mono text-[10px] tracking-[0.1em] opacity-55">LEARNING NOW</p>
              <ul className="mt-2 flex flex-wrap gap-1">
                {learning.map((item) => (
                  <li key={item} className="rounded-full border border-current/25 px-2 py-0.5 text-[11px] opacity-90">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-3 font-mono text-[10px] opacity-55">there’s no place like 127.0.0.1</p>
            </div>
          </div>
          </div>
        </div>
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-[12px] text-[var(--color-muted)]">
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" className="fill-none stroke-current" strokeWidth="1.4">
          <path d="M6 8.5V3.5a1 1 0 012 0V8m0-1.5a1 1 0 012 0V8.5m0-1a1 1 0 012 0v3c0 2.2-1.8 4-4 4H8.6a4 4 0 01-3-1.4L3.3 10.6a1.1 1.1 0 011.6-1.5L6 10.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Drag it anywhere · click to flip
      </p>
    </div>
  );
}
