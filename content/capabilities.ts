import { capabilitiesSchema } from './schemas';

/* Keep `detail` honest: "Used in projects" for things you've shipped, "Learning" for things you're studying. */
const data = [
  {
    id: 'frontend',
    index: 1,
    title: 'Frontend',
    description: 'Responsive interfaces for web apps and dashboards.',
    items: [
      { name: 'React & Next.js', detail: 'This portfolio' },
      { name: 'TypeScript', detail: 'This portfolio' },
      { name: 'Tailwind CSS', detail: 'Lampara and this portfolio' },
      { name: 'Bootstrap', detail: 'Hotel and enrollment systems' },
      { name: 'HTML, CSS & JavaScript', detail: 'The foundations' },
    ],
  },
  {
    id: 'backend-databases',
    index: 2,
    title: 'Backend & Databases',
    description: 'Business logic, CRUD, authentication and relational data.',
    items: [
      { name: 'PHP', detail: 'Native PHP: hotel, enrollment, Lampara' },
      { name: 'Java', detail: 'OOP, Swing desktop apps' },
      { name: 'Python', detail: 'Inventory system, scripting' },
      { name: 'C++', detail: 'Car rental system, OOP basics' },
      { name: 'MySQL', detail: 'Schema design, joins, queries' },
      { name: 'REST APIs', detail: 'JSON endpoints, Postman testing' },
    ],
  },
  {
    id: 'networking',
    index: 3,
    title: 'Networking',
    description: 'The fundamentals I’m building my Network DevOps career on.',
    items: [
      { name: 'OSI & TCP/IP models', detail: 'How data moves end to end' },
      { name: 'IP addressing & subnetting', detail: 'IPv4, CIDR, VLSM' },
      { name: 'Cisco Packet Tracer', detail: 'VLAN, routing and DHCP labs' },
      { name: 'Switching & routing', detail: 'Learning: VLANs, static, OSPF' },
      { name: 'Network services', detail: 'DNS, DHCP, NAT basics' },
    ],
  },
  {
    id: 'devops-tools',
    index: 4,
    title: 'DevOps & Tools',
    description: 'Version control, containers and pipelines I use to ship my projects.',
    items: [
      { name: 'Git & GitHub', detail: 'Branches, pull requests, reviews' },
      { name: 'Linux command line', detail: 'Files, permissions, SSH' },
      { name: 'Docker', detail: 'Dockerfiles, Docker Compose' },
      { name: 'CI/CD', detail: 'GitHub Actions build and deploy pipelines' },
      { name: 'XAMPP & Apache', detail: 'Local PHP and MySQL hosting' },
    ],
  },
  {
    id: 'exploring',
    index: 5,
    title: 'Also Exploring',
    description: 'Newer areas I’ve worked with through my capstone and side projects.',
    items: [
      { name: 'Augmented reality', detail: 'Lampara AR navigation' },
      { name: 'Conversational AI', detail: 'Lampara AI navigator' },
      { name: 'Figma', detail: 'Wireframes and UI mockups' },
      { name: 'Postman', detail: 'API testing' },
      { name: 'VS Code', detail: 'Daily driver' },
    ],
  },
];

export const capabilities = capabilitiesSchema.parse(data);
