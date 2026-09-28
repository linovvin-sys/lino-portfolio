import { experienceListSchema } from './schemas';

/* PLACEHOLDER: companies, dates and numbers are illustrative — replace with your real roles */
const data = [
  {
    id: 'network-devops-engineer',
    company: 'CloudBridge Systems',
    role: 'Network DevOps Engineer',
    location: 'Taguig, Philippines',
    type: 'full-time' as const,
    period: { start: '2023', end: 'Present' },
    description: 'Own network automation and the CI/CD platform for a multi-site data center and hybrid-cloud footprint.',
    impacts: [
      { metric: '−85% change lead time', description: 'Moved standard network changes from tickets to reviewed merge requests with automated pre-checks.' },
      { metric: '99.99% availability', description: 'Introduced SLOs, burn-rate alerting and staged rollouts across 1,200+ devices.' },
    ],
    stack: ['Ansible', 'Python', 'NetBox', 'Terraform', 'Kubernetes', 'GitLab CI'],
  },
  {
    id: 'senior-network-engineer',
    company: 'NetCore Solutions',
    role: 'Senior Network Engineer',
    location: 'Makati, Philippines',
    type: 'full-time' as const,
    period: { start: '2021', end: '2023' },
    description: 'Led the data center fabric migration and started the team’s automation practice.',
    impacts: [
      { metric: 'EVPN-VXLAN fabric', description: 'Migrated a legacy three-tier network to a spine-leaf fabric with zero unplanned downtime.' },
      { metric: '−60% alert noise', description: 'Replaced SNMP threshold alerts with streaming telemetry and actionable alert rules.' },
    ],
    stack: ['Cisco NX-OS', 'Arista EOS', 'BGP', 'Prometheus', 'Grafana'],
  },
  {
    id: 'network-engineer',
    company: 'Pacific Telecom',
    role: 'Network Engineer',
    location: 'Manila, Philippines',
    type: 'full-time' as const,
    period: { start: '2019', end: '2021' },
    description: 'Designed and operated enterprise WAN, branch and firewall infrastructure for business customers.',
    impacts: [
      { metric: '300+ branch sites', description: 'Templated branch router and firewall configs, cutting turn-up time from days to hours.' },
      { metric: 'SD-WAN rollout', description: 'Planned and delivered an SD-WAN migration with dual-ISP failover.' },
    ],
    stack: ['Cisco IOS-XE', 'Fortinet', 'MPLS', 'SD-WAN', 'Python'],
  },
  {
    id: 'noc-engineer',
    company: 'DataLink ISP',
    role: 'NOC Engineer',
    location: 'Cavite, Philippines',
    type: 'full-time' as const,
    period: { start: '2017', end: '2019' },
    description: 'Monitored and troubleshot a regional ISP backbone around the clock.',
    impacts: [
      { metric: 'Tier-2 escalations', description: 'Handled routing, circuit and customer-edge incidents end to end.' },
      { metric: 'First scripts', description: 'Wrote Python scripts to automate daily health checks that took the team an hour by hand.' },
    ],
    stack: ['OSPF', 'BGP', 'Zabbix', 'Linux', 'Bash'],
  },
];

export const experience = experienceListSchema.parse(data);
