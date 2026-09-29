import { capabilitiesSchema } from './schemas';

/* Keep `detail` honest: "Used in projects" for things you've shipped, "Learning" for things you're studying.
   `icon` is a key into content/tech-icons.ts — omit it for items with no real brand mark (concepts, skills). */
const data = [
  {
    id: 'frontend',
    index: 1,
    title: 'Frontend',
    description: 'Responsive interfaces for web apps and dashboards.',
    items: [
      { name: 'React & Next.js', detail: 'This portfolio', icon: 'react' },
      { name: 'TypeScript', detail: 'This portfolio', icon: 'typescript' },
      { name: 'Tailwind CSS', detail: 'Lampara and this portfolio', icon: 'tailwindcss' },
      { name: 'Bootstrap', detail: 'Hotel and enrollment systems', icon: 'bootstrap' },
      { name: 'HTML, CSS & JavaScript', detail: 'The foundations', icon: 'html5' },
    ],
  },
  {
    id: 'backend-databases',
    index: 2,
    title: 'Backend & Databases',
    description: 'Business logic, CRUD, authentication and relational data.',
    items: [
      { name: 'PHP', detail: 'Native PHP: hotel, enrollment, Lampara', icon: 'php' },
      { name: 'Java', detail: 'OOP, Swing desktop apps', icon: 'openjdk' },
      { name: 'Python', detail: 'Inventory system, scripting', icon: 'python' },
      { name: 'C++', detail: 'Car rental system, OOP basics', icon: 'cplusplus' },
      { name: 'MySQL', detail: 'Schema design, joins, queries', icon: 'mysql' },
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
      { name: 'Cisco Packet Tracer', detail: 'VLAN, routing and DHCP labs', icon: 'cisco' },
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
      { name: 'Git & GitHub', detail: 'Branches, pull requests, reviews', icon: 'github' },
      { name: 'Linux command line', detail: 'Files, permissions, SSH', icon: 'linux' },
      { name: 'Docker', detail: 'Dockerfiles, Docker Compose', icon: 'docker' },
      { name: 'CI/CD', detail: 'GitHub Actions build and deploy pipelines', icon: 'githubactions' },
      { name: 'XAMPP & Apache', detail: 'Local PHP and MySQL hosting', icon: 'xampp' },
    ],
  },
  {
    id: 'exploring',
    index: 5,
    title: 'Also Exploring',
    description: 'Newer areas I’ve worked with through my term project and side projects.',
    items: [
      { name: 'Augmented reality', detail: 'Lampara AR navigation' },
      { name: 'Conversational AI', detail: 'Lampara AI navigator' },
      { name: 'Figma', detail: 'Wireframes and UI mockups', icon: 'figma' },
      { name: 'Postman', detail: 'API testing', icon: 'postman' },
    ],
  },
  {
    id: 'ai-tools',
    index: 6,
    title: 'AI Tools',
    description: 'Assistants and models I use day to day for building and learning faster.',
    items: [
      { name: 'Claude Code', detail: 'AI pair programming', icon: 'claude' },
      { name: 'ChatGPT', detail: 'Research and rubber-ducking' },
      { name: 'Anthropic', detail: 'Claude models', icon: 'anthropic' },
      { name: 'OpenAI', detail: 'GPT models' },
      { name: 'Codex', detail: 'Code generation' },
      { name: 'Ollama', detail: 'Running models locally', icon: 'ollama' },
      { name: 'AntiGravity', detail: 'AI-assisted coding' },
    ],
  },
  {
    id: 'developer-tools',
    index: 7,
    title: 'Developer Tools',
    description: 'Where I actually write code, track work and talk to people.',
    items: [
      { name: 'VS Code', detail: 'Daily driver' },
      { name: 'GitHub', detail: 'Version control and collaboration', icon: 'github' },
      { name: 'PyCharm', detail: 'Python projects', icon: 'pycharm' },
      { name: 'NetBeans', detail: 'Java Swing apps', icon: 'apachenetbeanside' },
      { name: 'Trello', detail: 'Task boards', icon: 'trello' },
      { name: 'Discord', detail: 'Team and community chat', icon: 'discord' },
    ],
  },
];

export const capabilities = capabilitiesSchema.parse(data);
