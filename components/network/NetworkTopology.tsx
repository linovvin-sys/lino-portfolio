'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  LINKS,
  NODES,
  NODE_BY_ID,
  ROLE,
  VIEW_H,
  VIEW_W,
  linkKey,
  randomPath,
  type TopologyNode,
} from './topology';

export type TopologyEvent = { text: string; tone?: 'default' | 'ok' | 'warn' | 'error' };

interface NetworkTopologyProps {
  onEvent?: (event: TopologyEvent) => void;
  onHealthChange?: (upLinks: number, totalLinks: number) => void;
  className?: string;
}

interface Packet {
  el: SVGCircleElement;
  points: { x: number; y: number }[];
  /** cumulative segment lengths */
  lengths: number[];
  total: number;
  travelled: number;
  speed: number;
  dropped: boolean;
  fade: number;
}

const FAILABLE = new Set(['edge-01', 'edge-02', 'spine-01', 'spine-02']);

function makePacket(layer: SVGGElement, path: string[], dropped: boolean, accent: boolean, reverse: boolean): Packet {
  const nodes = path.map((id) => NODE_BY_ID[id]!);
  if (dropped) {
    // head toward the dead hop and stop halfway down the link
    const from = nodes[nodes.length - 1]!;
    nodes.push({ ...from, x: from.x, y: from.y + 36 } as TopologyNode);
  }
  const points = (reverse && !dropped ? [...nodes].reverse() : nodes).map((n) => ({ x: n.x, y: n.y }));
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    lengths.push(lengths[i - 1]! + Math.hypot(b.x - a.x, b.y - a.y));
  }
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  el.setAttribute('r', accent ? '3' : '2.25');
  el.style.fill = dropped ? 'var(--color-accent)' : accent ? 'var(--color-accent)' : 'var(--color-fg)';
  layer.appendChild(el);
  return {
    el,
    points,
    lengths,
    total: lengths[lengths.length - 1]!,
    travelled: 0,
    speed: 120 + Math.random() * 60,
    dropped,
    fade: 1,
  };
}

function positionAt(p: Packet) {
  const d = Math.min(p.travelled, p.total);
  let i = 1;
  while (i < p.lengths.length - 1 && p.lengths[i]! < d) i++;
  const a = p.points[i - 1]!;
  const b = p.points[i]!;
  const seg = p.lengths[i]! - p.lengths[i - 1]! || 1;
  const t = (d - p.lengths[i - 1]!) / seg;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/**
 * Live spine-leaf fabric. Packets stream from the internet to servers and
 * back; click an edge router or spine to fail it and traffic reroutes around
 * it (fail both spines and packets start dropping). Click a server to ping it.
 */
export function NetworkTopology({ onEvent, onHealthChange, className }: NetworkTopologyProps) {
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinged, setPinged] = useState<string | null>(null);
  const layerRef = useRef<SVGGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const failedRef = useRef(failed);
  failedRef.current = failed;
  const burst = useRef<string[]>([]);
  const seq = useRef(1);

  const isLinkDown = (a: string, b: string) => failed.has(a) || failed.has(b);
  const upLinks = LINKS.filter(([a, b]) => !isLinkDown(a, b)).length;

  useEffect(() => {
    onHealthChange?.(upLinks, LINKS.length);
  }, [upLinks, onHealthChange]);

  // Packet simulation: plain DOM writes inside rAF, no React re-renders per frame
  useEffect(() => {
    const layer = layerRef.current;
    const root = rootRef.current;
    if (!layer || !root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let packets: Packet[] = [];
    let frame = 0;
    let last = performance.now();
    let spawnClock = 0;
    let visible = true;
    let count = 0;

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    });
    io.observe(root);

    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      spawnClock += dt;
      const target = burst.current.shift();
      if (target || spawnClock > 0.16) {
        spawnClock = 0;
        count++;
        const { path, dropped } = randomPath(failedRef.current, target);
        packets.push(makePacket(layer!, path, dropped, Boolean(target) || count % 7 === 0, !target && count % 3 === 0));
      }

      packets = packets.filter((p) => {
        p.travelled += p.speed * dt;
        if (p.travelled >= p.total) {
          p.fade -= dt * (p.dropped ? 2.5 : 6);
          if (p.fade <= 0) {
            p.el.remove();
            return false;
          }
        }
        const { x, y } = positionAt(p);
        p.el.setAttribute('cx', x.toFixed(1));
        p.el.setAttribute('cy', y.toFixed(1));
        p.el.style.opacity = String(Math.max(0, p.fade));
        return true;
      });

      if (visible) frame = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      packets.forEach((p) => p.el.remove());
    };
  }, []);

  const toggleNode = (node: TopologyNode) => {
    if (node.kind === 'server') {
      burst.current.push(node.id, node.id, node.id);
      setPinged(node.id);
      setTimeout(() => setPinged((p) => (p === node.id ? null : p)), 900);
      const spineUp = [...failedRef.current].filter((id) => id.startsWith('spine')).length < 2;
      const edgeUp = [...failedRef.current].filter((id) => id.startsWith('edge')).length < 2;
      if (spineUp && edgeUp) {
        const time = (0.3 + Math.random() * 0.4).toFixed(2);
        onEvent?.({ text: `64 bytes from ${node.ip}: icmp_seq=${seq.current++} ttl=61 time=${time} ms`, tone: 'ok' });
      } else {
        onEvent?.({ text: `Request timeout for icmp_seq ${seq.current++} (${node.ip})`, tone: 'error' });
      }
      return;
    }
    if (!FAILABLE.has(node.id)) return;

    const next = new Set(failed);
    const goingDown = !next.has(node.id);
    if (goingDown) next.add(node.id);
    else next.delete(node.id);
    setFailed(next);

    const peers = node.kind === 'spine' ? 'leaf-01..04' : 'transit';
    if (goingDown) {
      onEvent?.({ text: `%LINK-3-UPDOWN: ${node.label} Ethernet1-6, changed state to down`, tone: 'error' });
      const kind = node.kind;
      const survivors = [...(kind === 'spine' ? ['spine-01', 'spine-02'] : ['edge-01', 'edge-02'])].filter((id) => !next.has(id));
      onEvent?.(
        survivors.length
          ? { text: `%BGP-5-ADJCHANGE: ${peers} → ${node.label} Down · ECMP rerouted via ${survivors.join(', ')}`, tone: 'warn' }
          : { text: `%ROUTING-1-NOPATH: no healthy ${kind} left · traffic blackholed`, tone: 'error' },
      );
    } else {
      onEvent?.({ text: `%LINK-3-UPDOWN: ${node.label} Ethernet1-6, changed state to up`, tone: 'ok' });
      onEvent?.({ text: `%BGP-5-ADJCHANGE: ${peers} → ${node.label} Up · ECMP restored`, tone: 'ok' });
    }
  };

  const hoverNode = hovered ? NODE_BY_ID[hovered] : undefined;
  const connected = new Set(hovered ? LINKS.filter(([a, b]) => a === hovered || b === hovered).map(([a, b]) => linkKey(a, b)) : []);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-full w-full"
        role="group"
        aria-label="Interactive network topology: an internet uplink, two edge routers, two spine switches, four leaf switches and eight servers"
      >
        {LINKS.map(([a, b]) => {
          const na = NODE_BY_ID[a]!;
          const nb = NODE_BY_ID[b]!;
          const down = isLinkDown(a, b);
          const lit = connected.has(linkKey(a, b));
          return (
            <line
              key={linkKey(a, b)}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              strokeWidth={lit ? 1.5 : 1}
              strokeDasharray={down ? '3 4' : undefined}
              className={cn(
                'transition-[stroke,opacity] duration-300',
                down ? 'stroke-[var(--color-accent)] opacity-50' : lit ? 'stroke-[var(--color-fg)]' : 'stroke-[var(--color-rule)]',
              )}
            />
          );
        })}

        <g ref={layerRef} aria-hidden="true" />

        {NODES.map((node) => {
          const down = failed.has(node.id);
          const interactive = node.kind === 'server' || FAILABLE.has(node.id);
          const isHovered = hovered === node.id;
          const label =
            node.kind === 'server'
              ? `${node.label}, ${node.ip}. Press to ping.`
              : FAILABLE.has(node.id)
                ? `${node.label}, ${down ? 'down. Press to restore.' : 'up. Press to fail it.'}`
                : `${node.label}`;
          return (
            <g
              key={node.id}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : undefined}
              aria-label={label}
              aria-pressed={FAILABLE.has(node.id) ? down : undefined}
              onPointerEnter={() => setHovered(node.id)}
              onPointerLeave={() => setHovered((h) => (h === node.id ? null : h))}
              onFocus={() => setHovered(node.id)}
              onBlur={() => setHovered((h) => (h === node.id ? null : h))}
              onClick={() => toggleNode(node)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleNode(node);
                }
              }}
              className={cn('outline-none', interactive && 'cursor-pointer')}
            >
              {/* generous invisible hit area */}
              <circle cx={node.x} cy={node.y} r={node.kind === 'server' ? 12 : 20} fill="transparent" />
              {pinged === node.id && (
                <circle cx={node.x} cy={node.y} r={8} className="animate-ping-ring fill-none stroke-[var(--color-accent)]" strokeWidth={1.5} />
              )}
              <NodeShape node={node} down={down} active={isHovered} />
              {node.kind !== 'server' && (
                <text
                  x={node.x + (node.kind === 'internet' ? 30 : 0)}
                  y={node.kind === 'internet' ? node.y + 4 : node.y - 16}
                  textAnchor={node.kind === 'internet' ? 'start' : 'middle'}
                  fontSize={10}
                  className={cn('font-mono transition-[fill] duration-200', down ? 'fill-[var(--color-accent)]' : 'fill-[var(--color-muted)]')}
                >
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hoverNode && (
        <div
          aria-hidden="true"
          className="animate-dialog-in pointer-events-none absolute z-10 min-w-[10.5rem] -translate-x-1/2 rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-bg)] px-3 py-2 text-[12px] shadow-[var(--shadow-pop)]"
          style={{
            left: `${(hoverNode.x / VIEW_W) * 100}%`,
            top: `${(hoverNode.y / VIEW_H) * 100}%`,
            transform: hoverNode.y > VIEW_H * 0.6 ? 'translate(-50%, calc(-100% - 18px))' : 'translate(-50%, 18px)',
          }}
        >
          <p className="font-mono text-[var(--color-fg)]">{hoverNode.label}</p>
          <p className="text-[var(--color-muted)]">{ROLE[hoverNode.kind]}</p>
          <p className="mt-1 flex items-center justify-between gap-3 font-mono text-[11px]">
            <span className="text-[var(--color-muted)]">{hoverNode.ip}</span>
            <span className={failed.has(hoverNode.id) ? 'text-[var(--color-accent)]' : 'text-emerald-600 dark:text-emerald-400'}>
              {failed.has(hoverNode.id) ? 'down' : 'up'}
            </span>
          </p>
          {(hoverNode.kind === 'server' || FAILABLE.has(hoverNode.id)) && (
            <p className="mt-1.5 border-t border-[var(--color-rule)] pt-1.5 text-[11px] text-[var(--color-muted)]">
              {hoverNode.kind === 'server' ? 'Click to ping' : failed.has(hoverNode.id) ? 'Click to restore' : 'Click to fail it'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function NodeShape({ node, down, active }: { node: TopologyNode; down: boolean; active: boolean }) {
  const stroke = down ? 'stroke-[var(--color-accent)]' : active ? 'stroke-[var(--color-fg)]' : 'stroke-[var(--color-muted)]';
  const base = cn('transition-[fill,stroke] duration-200', stroke);

  if (node.kind === 'internet') {
    return (
      <path
        d={`M${node.x - 18} ${node.y + 8}h36a9 9 0 0 0 0-18a12 12 0 0 0-22-4a9 9 0 0 0-14 22z`}
        strokeWidth={1.25}
        className={cn(base, 'fill-[var(--color-surface)]')}
      />
    );
  }
  if (node.kind === 'server') {
    return (
      <rect
        x={node.x - 7}
        y={node.y - 8}
        width={14}
        height={16}
        rx={2.5}
        strokeWidth={1.25}
        className={cn(base, active ? 'fill-[var(--color-fg)]' : 'fill-[var(--color-surface)]')}
      />
    );
  }
  const w = node.kind === 'leaf' ? 30 : 34;
  const h = 16;
  return (
    <g>
      {node.kind === 'edge' ? (
        <circle cx={node.x} cy={node.y} r={10} strokeWidth={1.25} className={cn(base, down ? 'fill-[var(--color-bg)]' : 'fill-[var(--color-fg)]')} />
      ) : (
        <rect
          x={node.x - w / 2}
          y={node.y - h / 2}
          width={w}
          height={h}
          rx={4}
          strokeWidth={1.25}
          className={cn(base, down ? 'fill-[var(--color-bg)]' : node.kind === 'spine' ? 'fill-[var(--color-fg)]' : 'fill-[var(--color-surface)]')}
        />
      )}
      {down ? (
        <path d={`M${node.x - 4} ${node.y - 4}l8 8m0-8l-8 8`} strokeWidth={1.5} className="stroke-[var(--color-accent)]" />
      ) : node.kind === 'edge' ? (
        <path d={`M${node.x - 5} ${node.y}h10M${node.x} ${node.y - 5}v10`} strokeWidth={1.25} className="stroke-[var(--color-bg)]" />
      ) : (
        <g className={node.kind === 'spine' ? 'fill-[var(--color-bg)]' : 'fill-[var(--color-muted)]'}>
          {[-8, -3, 2, 7].map((dx) => (
            <rect key={dx} x={node.x + dx - 1} y={node.y - 1} width={2.5} height={2.5} rx={0.5} />
          ))}
        </g>
      )}
    </g>
  );
}
