import { CLUSTERS, generateEmbeddingPoints } from "./embedding-data";

/**
 * Static, no-JS SVG rendering of the same deterministic cluster layout used
 * by the real R3F scene, projected to 2D. Used when WebGL is unavailable,
 * when the user prefers reduced motion, and as the `loading` placeholder
 * while the 3D bundle is being fetched — so there is never a blank/layout
 * shifting gap. Cheap to render, no animation loop.
 */

const VIEWBOX = 400;
const SCALE = 78;
const CENTER = VIEWBOX / 2;

/** Simple orthographic-ish projection: x/y placed directly, z nudges size/opacity for a subtle depth cue. */
function project(position: readonly [number, number, number]): { cx: number; cy: number; r: number; opacity: number } {
  const [x, y, z] = position;
  const cx = CENTER + x * SCALE;
  const cy = CENTER - y * SCALE;
  const depth = (z + 1.5) / 3; // roughly 0..1
  const r = 1.6 + depth * 1.4;
  const opacity = 0.35 + depth * 0.4;
  // Rounded so server- and client-rendered markup match exactly (raw floats
  // differ in the last digit between engines and cause hydration errors).
  const round = (n: number) => Math.round(n * 100) / 100;
  return { cx: round(cx), cy: round(cy), r: round(r), opacity: round(opacity) };
}

export function EmbeddingSpaceFallback() {
  const points = generateEmbeddingPoints();

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      className="h-full w-full"
      role="img"
      aria-label="Static preview of an embedding-space visualization: labeled clusters of points representing reasoning, retrieval, alignment, and latency."
    >
      {points.map((point, i) => {
        const { cx, cy, r, opacity } = project(point.position);
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="var(--color-fg)"
            opacity={opacity}
          />
        );
      })}

      {CLUSTERS.map((cluster) => {
        const { cx, cy } = project(cluster.center);
        return (
          <circle
            key={`${cluster.id}-core`}
            cx={cx}
            cy={cy}
            r={2.4}
            fill="var(--color-accent)"
            opacity={0.9}
          />
        );
      })}

      {CLUSTERS.map((cluster) => {
        const { cx, cy } = project(cluster.center);
        return (
          <text
            key={`${cluster.id}-label`}
            x={cx}
            y={cy - 12}
            textAnchor="middle"
            className="font-mono"
            fontSize={9}
            letterSpacing="0.08em"
            fill="var(--color-muted)"
          >
            {cluster.label}
          </text>
        );
      })}
    </svg>
  );
}
