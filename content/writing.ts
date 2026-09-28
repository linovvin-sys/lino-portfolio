import { writingListSchema } from './schemas';

/* PLACEHOLDER: titles and venues are illustrative; urls are omitted until real posts/talks exist */
const data = [
  {
    id: 'network-changes-as-merge-requests',
    title: 'Network Changes as Merge Requests',
    type: 'blog' as const,
    date: '2025-02-10',
    venue: 'Personal Blog',
    description: 'How we moved from change tickets and CLI sessions to reviewed, tested, automatically deployed network changes, and what broke along the way.',
    featured: true,
  },
  {
    id: 'netbox-as-source-of-truth',
    title: 'NetBox as the Source of Truth',
    type: 'talk' as const,
    date: '2024-10-18',
    venue: 'PhNOG Conference',
    description: 'Modelling devices, IPAM and cabling in NetBox, then generating every config from it so the network can never disagree with the docs.',
    featured: true,
  },
  {
    id: 'streaming-telemetry-101',
    title: 'Streaming Telemetry 101: Leaving SNMP Behind',
    type: 'workshop' as const,
    date: '2024-07-06',
    venue: 'DevOps Manila Meetup',
    description: 'A hands-on workshop wiring gNMI, Telegraf, Prometheus and Grafana together to get sub-second visibility into interface and BGP state.',
    featured: false,
  },
  {
    id: 'terraform-for-network-engineers',
    title: 'Terraform for Network Engineers',
    type: 'blog' as const,
    date: '2024-04-22',
    venue: 'Dev.to',
    description: 'A practical guide to managing VPCs, transit gateways, firewalls and DNS as code, written for people who think in subnets first.',
    featured: false,
  },
  {
    id: 'slos-for-networks',
    title: 'SLOs for the Network Team',
    type: 'blog' as const,
    date: '2023-11-30',
    venue: 'Medium',
    description: 'Defining availability and latency objectives for a network, and using error budgets to decide when to ship and when to slow down.',
    featured: false,
  },
  {
    id: 'safe-rollouts-with-ansible',
    title: 'Safe Rollouts with Ansible',
    type: 'talk' as const,
    date: '2023-08-12',
    venue: 'Ansible Philippines User Group',
    description: 'Batching, pre- and post-checks, and automatic rollback patterns for pushing configuration to hundreds of devices without drama.',
    featured: false,
  },
];

export const writing = writingListSchema.parse(data);
