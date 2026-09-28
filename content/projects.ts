import { projectsSchema } from './schemas';

/* PLACEHOLDER: projects and numbers are illustrative — replace with your real work. Slugs match content/case-studies/*.mdx 1:1. */
const data = [
  {
    slug: 'network-automation-platform',
    index: 1,
    title: 'Network Automation Platform',
    subtitle: 'Zero-touch configuration for 1,200+ routers and switches with Ansible, NetBox and GitOps',
    category: 'Network Automation',
    year: '2024',
    thumbnail: { src: '/placeholder-project-1.webp', alt: 'Network automation pipeline', width: 1600, height: 1200 },
    stack: ['Ansible', 'Python', 'NetBox', 'Nornir', 'GitLab CI', 'Cisco IOS-XE', 'Arista EOS'],
    metrics: [
      { label: 'Devices automated', value: '1,200+' },
      { label: 'Change lead time', value: '−85%' },
    ],
    summary: 'Replaced manual CLI changes with a Git-driven pipeline. Standard changes went from a 2-day ticket to a 20-minute merge request, with pre-checks, dry runs and automatic rollback.',
  },
  {
    slug: 'infrastructure-as-code',
    index: 2,
    title: 'Multi-Cloud Infrastructure as Code',
    subtitle: 'Terraform modules and policy-as-code provisioning three clouds from a single pipeline',
    category: 'Infrastructure as Code',
    year: '2024',
    thumbnail: { src: '/placeholder-project-2.webp', alt: 'Terraform module graph', width: 1600, height: 1200 },
    stack: ['Terraform', 'Terragrunt', 'AWS', 'Azure', 'GCP', 'OPA', 'GitHub Actions'],
    metrics: [
      { label: 'Environment spin-up', value: '12 min' },
      { label: 'Config drift', value: '0' },
    ],
    summary: 'Standardised VPCs, transit gateways, firewalls and DNS as versioned Terraform modules. New environments went from two weeks of tickets to a 12-minute pipeline run.',
  },
  {
    slug: 'network-observability',
    index: 3,
    title: 'Network Observability Stack',
    subtitle: 'Streaming telemetry and SLO-based alerting that cut mean time to resolution by 70%',
    category: 'Observability',
    year: '2023',
    thumbnail: { src: '/placeholder-project-3.webp', alt: 'Grafana network dashboard', width: 1600, height: 1200 },
    stack: ['Prometheus', 'Grafana', 'gNMI', 'Telegraf', 'Loki', 'Alertmanager'],
    metrics: [
      { label: 'MTTR', value: '−70%' },
      { label: 'Alert noise', value: '−60%' },
    ],
    summary: 'Moved from 5-minute SNMP polling to sub-second streaming telemetry, and from threshold alerts to SLO burn-rate alerts. On-call pages dropped by 60% while real incidents were caught sooner.',
  },
  {
    slug: 'kubernetes-platform',
    index: 4,
    title: 'Kubernetes Platform & GitOps Delivery',
    subtitle: 'Self-service platform shipping 200+ deploys a week with zero-downtime rollouts',
    category: 'Platform & CI/CD',
    year: '2023',
    thumbnail: { src: '/placeholder-project-4.webp', alt: 'Argo CD application tree', width: 1600, height: 1200 },
    stack: ['Kubernetes', 'Argo CD', 'Helm', 'Cilium', 'GitLab CI', 'Vault'],
    metrics: [
      { label: 'Deploys / week', value: '200+' },
      { label: 'Availability', value: '99.99%' },
    ],
    summary: 'Built a GitOps platform on Kubernetes with Cilium networking, progressive rollouts and secrets in Vault. Teams ship independently, and failed rollouts revert automatically.',
  },
];

export const projects = projectsSchema.parse(data);
