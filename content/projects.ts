import { projectsSchema } from './schemas';

/*
 * PLACEHOLDER: confirm each project's exact stack, year and details.
 * Slugs must match content/case-studies/*.mdx 1:1.
 */
const data = [
  {
    slug: 'lampara',
    index: 1,
    title: 'Lampara',
    subtitle: 'AR navigation with an AI conversational navigator that guides people to where they need to go',
    category: 'Capstone · AR + AI',
    year: '2026',
    thumbnail: { src: '/placeholder-project-1.webp', alt: 'Lampara AR navigation', width: 1600, height: 1200 },
    stack: ['Augmented Reality', 'Conversational AI', 'Python', 'MySQL'],
    metrics: [
      { label: 'Type', value: 'AR app' },
      { label: 'Status', value: 'In progress' },
    ],
    summary: 'Point your phone around and Lampara overlays directions on the real world, while an AI assistant answers questions like “Where is the registrar?” in plain language.',
  },
  {
    slug: 'enrollment-lms',
    index: 2,
    title: 'Enrollment Management System + LMS',
    subtitle: 'Online enrollment, class sections and a learning management system in one platform',
    category: 'Web application',
    year: '2025',
    thumbnail: { src: '/placeholder-project-2.webp', alt: 'Enrollment system dashboard', width: 1600, height: 1200 },
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'MySQL'],
    metrics: [
      { label: 'Type', value: 'Web app' },
      { label: 'Users', value: '3 roles' },
    ],
    summary: 'Students enroll online, registrars approve and assign sections, and teachers post lessons and grades in the built-in LMS.',
  },
  {
    slug: 'hotel-management-system',
    index: 3,
    title: 'Hotel Management System',
    subtitle: 'Room booking, check-in/check-out and billing, built with native PHP and Bootstrap',
    category: 'Web application',
    year: '2025',
    thumbnail: { src: '/placeholder-project-3.webp', alt: 'Hotel management dashboard', width: 1600, height: 1200 },
    stack: ['PHP', 'Bootstrap', 'MySQL', 'JavaScript'],
    metrics: [
      { label: 'Type', value: 'Web app' },
      { label: 'Backend', value: 'Native PHP' },
    ],
    summary: 'A front-desk system for managing rooms, reservations, guest check-in and check-out, and billing, all backed by a MySQL database.',
  },
  {
    slug: 'parking-monitoring-system',
    index: 4,
    title: 'Parking Monitoring System',
    subtitle: 'Real-time slot availability and vehicle entry/exit logging in Java',
    category: 'Desktop application',
    year: '2024',
    thumbnail: { src: '/placeholder-project-4.webp', alt: 'Parking slots view', width: 1600, height: 1200 },
    stack: ['Java', 'Java Swing', 'MySQL'],
    metrics: [
      { label: 'Type', value: 'Desktop app' },
      { label: 'Language', value: 'Java' },
    ],
    summary: 'Shows which parking slots are free or occupied, logs every vehicle entry and exit, and computes parking fees automatically.',
  },
  {
    slug: 'inventory-management-system',
    index: 5,
    title: 'Inventory Management System',
    subtitle: 'Stock tracking, low-stock alerts and simple reports in Python',
    category: 'Desktop application',
    year: '2024',
    thumbnail: { src: '/placeholder-project-5.webp', alt: 'Inventory list view', width: 1600, height: 1200 },
    stack: ['Python', 'Tkinter', 'MySQL'],
    metrics: [
      { label: 'Type', value: 'Desktop app' },
      { label: 'Language', value: 'Python' },
    ],
    summary: 'Tracks products and stock levels, records stock in and out, warns when items run low, and generates simple inventory reports.',
  },
];

export const projects = projectsSchema.parse(data);
