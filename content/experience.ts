import { experienceListSchema } from './schemas';

/* PLACEHOLDER: replace the university, dates and coursework with your own */
const data = [
  {
    id: 'lampara-term-project',
    company: 'Term project',
    role: 'Lampara: AR & AI navigation',
    location: 'Team project',
    type: 'academic' as const,
    period: { start: '2026', end: 'Present' },
    description: 'Building an augmented-reality navigation app with an AI conversational navigator as our term project.',
    impacts: [
      { metric: 'AR navigation', description: 'Directions overlaid on the real world through the phone camera.' },
      { metric: 'AI navigator', description: 'Answers “where is…” questions in plain language and points the way.' },
    ],
    stack: ['Augmented Reality', 'Conversational AI', 'PHP', 'Tailwind CSS', 'MySQL'],
  },
  {
    id: 'networking-devops-self-study',
    company: 'Self-study',
    role: 'Networking & DevOps',
    location: 'Cavite, Philippines',
    type: 'self-study' as const,
    period: { start: '2025', end: 'Present' },
    description: 'Building DevOps habits on my own projects and practicing networking toward a Network DevOps career.',
    impacts: [
      { metric: 'Packet Tracer labs', description: 'Building VLAN, routing and DHCP labs to practice CCNA topics.' },
      { metric: 'Git & GitHub', description: 'Every project lives on GitHub with feature branches and pull requests.' },
      { metric: 'Docker & CI/CD', description: 'Containerized my apps with Docker and automated builds and deploys with GitHub Actions.' },
    ],
    stack: ['Cisco Packet Tracer', 'Linux', 'Git', 'Docker', 'GitHub Actions'],
  },
  {
    id: 'bs-information-technology',
    company: 'National College of Science and Technology',
    role: 'B.S. Information Technology',
    location: 'Cavite, Philippines',
    type: 'academic' as const,
    period: { start: '2024', end: 'Present' },
    description: 'Third-year IT student. Coursework has covered programming, databases, web development and computer networking.',
    impacts: [
      { metric: '5 systems built', description: 'Car rental (C++), hotel, inventory, parking and enrollment/LMS systems for coursework.' },
      { metric: 'Networking coursework', description: 'Data communications, network fundamentals and system administration.' },
    ],
    stack: ['C++', 'PHP', 'Java', 'Python', 'MySQL', 'Bootstrap', 'JavaScript'],
  },
];

export const experience = experienceListSchema.parse(data);
