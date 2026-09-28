import { ossListSchema } from './schemas';

/* PLACEHOLDER: repo urls point to a placeholder GitHub username; star counts are illustrative */
const data = [
  {
    id: 'netbox-ansible-sync',
    name: 'netbox-ansible-sync',
    description: 'Generates a dynamic Ansible inventory and host variables straight from NetBox, with caching and per-site filtering.',
    language: 'Python',
    stars: 640,
    url: 'https://github.com/placeholder/netbox-ansible-sync',
    purpose: 'Keep automation and the source of truth in lockstep.',
    featured: true,
  },
  {
    id: 'terraform-network-modules',
    name: 'terraform-network-modules',
    description: 'Opinionated Terraform modules for hub-and-spoke cloud networking: VPCs, transit gateways, firewalls and private DNS.',
    language: 'HCL',
    stars: 420,
    url: 'https://github.com/placeholder/terraform-network-modules',
    purpose: 'Stand up a production-grade cloud network in minutes.',
    featured: true,
  },
  {
    id: 'config-drift-detector',
    name: 'config-drift-detector',
    description: 'Compares running configs against golden templates and opens a merge request when devices drift.',
    language: 'Go',
    stars: 310,
    url: 'https://github.com/placeholder/config-drift-detector',
    purpose: 'Catch out-of-band changes before they cause an outage.',
    featured: false,
  },
  {
    id: 'bgp-looking-glass',
    name: 'bgp-looking-glass',
    description: 'A lightweight looking glass that exposes read-only BGP and traceroute queries over a small web UI.',
    language: 'TypeScript',
    stars: 185,
    url: 'https://github.com/placeholder/bgp-looking-glass',
    purpose: 'Let customers and teammates debug routing without CLI access.',
    featured: false,
  },
  {
    id: 'nornir-health-checks',
    name: 'nornir-health-checks',
    description: 'A library of Nornir tasks for pre- and post-change validation: interfaces, BGP sessions, routes and optics.',
    language: 'Python',
    stars: 150,
    url: 'https://github.com/placeholder/nornir-health-checks',
    purpose: 'Prove a change worked before calling it done.',
    featured: false,
  },
];

export const oss = ossListSchema.parse(data);
