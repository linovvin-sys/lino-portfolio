/**
 * Shared, deterministic layout data for the hero "embedding space"
 * visualization. Both the real R3F scene (EmbeddingSpace) and the static
 * SVG fallback (EmbeddingSpaceFallback) read from this module so the two
 * visually rhyme — same clusters, same seed, same point count.
 *
 * No Math.random() anywhere: positions are derived from a seeded mulberry32
 * PRNG, matching the deterministic-pseudo-randomness pattern used by the
 * Lab experiments (see lib/lab-math.ts).
 */

export interface EmbeddingCluster {
  id: string;
  label: string;
  /** World-space center, roughly within [-2, 2] on each axis. */
  center: readonly [number, number, number];
}

export interface EmbeddingPoint {
  position: readonly [number, number, number];
  clusterIndex: number;
}

/** Domain-relevant terms for a GenAI engineer's embedding space. */
export const CLUSTERS: readonly EmbeddingCluster[] = [
  { id: "reasoning", label: "reasoning", center: [-1.6, 0.85, 0.35] },
  { id: "retrieval", label: "retrieval", center: [1.5, 0.55, -0.55] },
  { id: "alignment", label: "alignment", center: [-1.15, -1.05, -0.25] },
  { id: "latency", label: "latency", center: [1.35, -0.9, 0.65] },
] as const;

const POINTS_PER_CLUSTER = 55;
const CLUSTER_SPREAD = 0.55;
const SEED = 0x5eed1e5;

function mulberry32(seed: number): () => number {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Standard-normal-ish sample via Box-Muller, fed by the seeded PRNG. */
function seededGaussian(rand: () => number): number {
  const u1 = Math.max(rand(), 1e-6);
  const u2 = rand();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

let cachedPoints: EmbeddingPoint[] | null = null;

/** Deterministic point cloud: same output every call, every render, every theme. */
export function generateEmbeddingPoints(): EmbeddingPoint[] {
  if (cachedPoints) return cachedPoints;

  const rand = mulberry32(SEED);
  const points: EmbeddingPoint[] = [];

  for (const [clusterIndex, cluster] of CLUSTERS.entries()) {
    for (let i = 0; i < POINTS_PER_CLUSTER; i++) {
      const [cx, cy, cz] = cluster.center;
      const x = cx + seededGaussian(rand) * CLUSTER_SPREAD;
      const y = cy + seededGaussian(rand) * CLUSTER_SPREAD;
      const z = cz + seededGaussian(rand) * CLUSTER_SPREAD;
      points.push({ position: [x, y, z], clusterIndex });
    }
  }

  cachedPoints = points;
  return points;
}
