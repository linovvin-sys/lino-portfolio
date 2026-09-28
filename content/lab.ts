import { labListSchema } from './schemas';

/* `id` must match a key in components/lab/registry.ts */
const data = [
  {
    id: 'subnet-calculator',
    title: 'Subnet Calculator',
    description: 'Type any IPv4 CIDR and see the network, broadcast, usable range and host count, with the network and host bits laid out visually.',
    category: 'networking',
    status: 'live',
    component: 'SubnetCalculator',
    techStack: ['TypeScript', 'Bitwise math'],
  },
  {
    id: 'packet-path',
    title: 'Packet Path Visualizer',
    description: 'Watch a packet hop from your laptop to a server, traceroute-style, with per-hop latency and a simulated failure you can inject.',
    category: 'routing',
    status: 'live',
    component: 'PacketPath',
    techStack: ['TypeScript', 'SVG'],
  },
  {
    id: 'config-diff-viewer',
    title: 'Config Diff Viewer',
    description: 'Paste a running config and a candidate config and get the exact lines that would change, like a pre-change review.',
    category: 'automation',
    status: 'live',
    component: 'ConfigDiffViewer',
    techStack: ['TypeScript', 'Myers diff'],
  },
  {
    id: 'load-balancer-simulator',
    title: 'Load Balancer Simulator',
    description: 'Send live traffic through round-robin, least-connections or weighted balancing and watch how each backend fills up.',
    category: 'traffic',
    status: 'live',
    component: 'LoadBalancerSimulator',
    techStack: ['TypeScript', 'SVG'],
  },
  {
    id: 'error-budget-calculator',
    title: 'SLO Error Budget Calculator',
    description: 'Pick an availability target and see exactly how much downtime it allows per day, week, month and year.',
    category: 'reliability',
    status: 'live',
    component: 'ErrorBudgetCalculator',
    techStack: ['TypeScript'],
  },
  {
    id: 'rollout-simulator',
    title: 'Kubernetes Rollout Simulator',
    description: 'Tune maxSurge and maxUnavailable and watch a rolling update replace pods, with capacity tracked at every step.',
    category: 'platform',
    status: 'live',
    component: 'RolloutSimulator',
    techStack: ['TypeScript', 'Kubernetes'],
  },
];

export const lab = labListSchema.parse(data);
