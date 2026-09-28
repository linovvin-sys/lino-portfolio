/**
 * Static model of the hero's spine-leaf network: node positions (in SVG
 * viewBox units), links, and path-finding that respects failed nodes.
 */

export type NodeKind = 'internet' | 'edge' | 'spine' | 'leaf' | 'server';

export interface TopologyNode {
  id: string;
  label: string;
  kind: NodeKind;
  ip: string;
  x: number;
  y: number;
}

export const VIEW_W = 480;
export const VIEW_H = 330;

const leafX = [66, 182, 298, 414];

export const NODES: TopologyNode[] = [
  { id: 'internet', label: 'internet', kind: 'internet', ip: '0.0.0.0/0', x: 240, y: 30 },
  { id: 'edge-01', label: 'edge-01', kind: 'edge', ip: '10.0.0.1', x: 160, y: 92 },
  { id: 'edge-02', label: 'edge-02', kind: 'edge', ip: '10.0.0.2', x: 320, y: 92 },
  { id: 'spine-01', label: 'spine-01', kind: 'spine', ip: '10.0.1.1', x: 160, y: 164 },
  { id: 'spine-02', label: 'spine-02', kind: 'spine', ip: '10.0.1.2', x: 320, y: 164 },
  ...leafX.map((x, i) => ({
    id: `leaf-0${i + 1}`,
    label: `leaf-0${i + 1}`,
    kind: 'leaf' as const,
    ip: `10.0.2.${i + 1}`,
    x,
    y: 236,
  })),
  ...leafX.flatMap((x, i) =>
    [0, 1].map((j) => ({
      id: `srv-${i + 1}${j + 1}`,
      label: `srv-${i + 1}${j + 1}`,
      kind: 'server' as const,
      ip: `10.42.${i + 1}.${10 + j}`,
      x: x - 20 + j * 40,
      y: 300,
    })),
  ),
];

export const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<string, TopologyNode>;

const ids = (kind: NodeKind) => NODES.filter((n) => n.kind === kind).map((n) => n.id);
export const EDGES = ids('edge');
export const SPINES = ids('spine');
export const LEAVES = ids('leaf');
export const SERVERS = ids('server');

export const LINKS: [string, string][] = [
  ...EDGES.map((e) => ['internet', e] as [string, string]),
  ...EDGES.flatMap((e) => SPINES.map((s) => [e, s] as [string, string])),
  ...SPINES.flatMap((s) => LEAVES.map((l) => [s, l] as [string, string])),
  ...SERVERS.map((srv) => [`leaf-0${srv[4]}`, srv] as [string, string]),
];

export const linkKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

export const ROLE: Record<NodeKind, string> = {
  internet: 'Upstream transit',
  edge: 'Edge router · BGP',
  spine: 'Spine switch · EVPN',
  leaf: 'Leaf switch · VTEP',
  server: 'Workload',
};

const pick = <T,>(items: T[]): T | undefined => items[Math.floor(Math.random() * items.length)];

/**
 * A random internet → edge → spine → leaf → server path avoiding failed
 * nodes. Returns the path and whether it had to stop early (no healthy hop).
 */
export function randomPath(failed: Set<string>, target?: string): { path: string[]; dropped: boolean } {
  const server = target ?? pick(SERVERS)!;
  const leaf = `leaf-0${server[4]}`;
  const path = ['internet'];

  const edge = pick(EDGES.filter((e) => !failed.has(e)));
  if (!edge) return { path, dropped: true };
  path.push(edge);

  const spine = pick(SPINES.filter((s) => !failed.has(s)));
  if (!spine) return { path, dropped: true };
  path.push(spine, leaf, server);
  return { path, dropped: false };
}
