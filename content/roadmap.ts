import { roadmapSchema } from './schemas';

/* Update `done` as you finish each item — the progress bars and percentages update automatically. */
const data = [
  {
    id: 'programming',
    title: 'Programming foundations',
    status: 'done',
    summary: 'Core languages and databases I’ve used to build real projects.',
    items: [
      { name: 'PHP', done: true },
      { name: 'Java', done: true },
      { name: 'Python', done: true },
      { name: 'C++', done: true },
      { name: 'SQL & MySQL', done: true },
    ],
  },
  {
    id: 'web',
    title: 'Web development',
    status: 'done',
    summary: 'Modern frontend tooling for building full-stack web apps.',
    items: [
      { name: 'HTML, CSS & JavaScript', done: true },
      { name: 'Bootstrap & Tailwind CSS', done: true },
      { name: 'React & Next.js', done: true },
      { name: 'TypeScript', done: true },
    ],
  },
  {
    id: 'cicd',
    title: 'Containers & CI/CD',
    status: 'done',
    summary: 'Packaging apps consistently and shipping them automatically.',
    items: [
      { name: 'Git & GitHub workflow', done: true },
      { name: 'Docker & Docker Compose', done: true },
      { name: 'CI/CD with GitHub Actions', done: true },
      { name: 'Deploying to a Linux server', done: true },
    ],
  },
  {
    id: 'networking',
    title: 'Networking fundamentals',
    status: 'in-progress',
    summary: 'How networks actually work, practiced in Cisco Packet Tracer.',
    items: [
      { name: 'OSI & TCP/IP models', done: true },
      { name: 'IPv4 addressing & subnetting', done: true },
      { name: 'VLANs & inter-VLAN routing', done: false },
      { name: 'Static routing & OSPF', done: false },
      { name: 'CCNA certification', done: false },
    ],
  },
  {
    id: 'linux',
    title: 'Linux & scripting',
    status: 'in-progress',
    summary: 'Getting comfortable on servers and automating small tasks.',
    items: [
      { name: 'Linux command line', done: true },
      { name: 'Users, permissions & SSH', done: false },
      { name: 'Bash scripting', done: false },
      { name: 'Python for automation', done: false },
    ],
  },
  {
    id: 'automation',
    title: 'Network automation & IaC',
    status: 'next',
    summary: 'Where networking and DevOps meet: the goal.',
    items: [
      { name: 'Netmiko & NAPALM', done: false },
      { name: 'Ansible for network devices', done: false },
      { name: 'Terraform basics', done: false },
      { name: 'Monitoring with Prometheus & Grafana', done: false },
    ],
  },
];

export const roadmap = roadmapSchema.parse(data);
