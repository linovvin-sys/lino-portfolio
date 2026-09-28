import { capabilitiesSchema } from './schemas';

const data = [
  {
    id: 'network-engineering',
    index: 1,
    title: 'Network Engineering',
    description: 'Designing and running routed and switched networks that stay up under change.',
    items: [
      { name: 'Routing', detail: 'BGP, OSPF, IS-IS, route policy' },
      { name: 'Data center fabrics', detail: 'Spine-leaf, EVPN-VXLAN' },
      { name: 'Switching', detail: 'VLANs, STP, LACP, MLAG' },
      { name: 'Security', detail: 'Firewalls, ACLs, VPN, segmentation' },
      { name: 'Multi-vendor', detail: 'Cisco, Juniper, Arista, Fortinet' },
    ],
  },
  {
    id: 'network-automation',
    index: 2,
    title: 'Network Automation',
    description: 'Replacing copy-paste CLI work with tested, repeatable code.',
    items: [
      { name: 'Ansible', detail: 'Roles, collections, AWX' },
      { name: 'Python', detail: 'Nornir, Netmiko, NAPALM, Scrapli' },
      { name: 'Source of truth', detail: 'NetBox, Nautobot' },
      { name: 'Zero-touch provisioning', detail: 'ZTP, templated Day-0 configs' },
      { name: 'Config compliance', detail: 'Golden configs, drift detection' },
    ],
  },
  {
    id: 'infrastructure-as-code',
    index: 3,
    title: 'Infrastructure as Code',
    description: 'Cloud and on-prem infrastructure declared, reviewed and versioned in Git.',
    items: [
      { name: 'Terraform', detail: 'Reusable modules, remote state' },
      { name: 'Terragrunt', detail: 'DRY multi-environment layouts' },
      { name: 'Cloud networking', detail: 'AWS, Azure, GCP VPC design' },
      { name: 'Policy as code', detail: 'OPA, Sentinel, Checkov' },
      { name: 'Images', detail: 'Packer, cloud-init' },
    ],
  },
  {
    id: 'cicd-platform',
    index: 4,
    title: 'CI/CD & Platform',
    description: 'Pipelines and platforms that let teams ship safely, many times a day.',
    items: [
      { name: 'CI/CD', detail: 'GitLab CI, GitHub Actions, Jenkins' },
      { name: 'Kubernetes', detail: 'Cluster ops, Cilium, ingress' },
      { name: 'GitOps', detail: 'Argo CD, Flux' },
      { name: 'Containers', detail: 'Docker, Helm, Kustomize' },
      { name: 'Secrets', detail: 'HashiCorp Vault, SOPS' },
    ],
  },
  {
    id: 'observability-reliability',
    index: 5,
    title: 'Observability & Reliability',
    description: 'Seeing problems before users do, and fixing them fast when they happen.',
    items: [
      { name: 'Metrics', detail: 'Prometheus, Grafana' },
      { name: 'Streaming telemetry', detail: 'gNMI, OpenConfig, Telegraf' },
      { name: 'Logs', detail: 'Loki, ELK, syslog pipelines' },
      { name: 'SLOs', detail: 'Error budgets, burn-rate alerts' },
      { name: 'Incident response', detail: 'On-call, runbooks, postmortems' },
    ],
  },
];

export const capabilities = capabilitiesSchema.parse(data);
