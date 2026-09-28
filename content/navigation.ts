import { navigationSchema } from './schemas';

/* PLACEHOLDER */
const data = [
  { index: '01', label: 'Projects', href: '/#work' },
  { index: '02', label: 'Skills', href: '/#capabilities' },
  { index: '03', label: 'Workflow', href: '/#workflow' },
  { index: '04', label: 'Journey', href: '/#experience' },
  { index: '05', label: 'Roadmap', href: '/#roadmap' },
  { index: '06', label: 'Lab', href: '/#lab' },
  { index: '07', label: 'About', href: '/#about' },
  { index: '08', label: 'Contact', href: '/#contact' },
];

export const navigation = navigationSchema.parse(data);
