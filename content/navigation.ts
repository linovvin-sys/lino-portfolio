import { navigationSchema } from './schemas';

const data = [
  { index: '01', label: 'About', href: '/about' },
  { index: '02', label: 'Projects', href: '/work' },
  { index: '03', label: 'Stack', href: '/stack' },
  { index: '04', label: 'Workflow', href: '/workflow' },
  { index: '05', label: 'Journey', href: '/experience' },
  { index: '06', label: 'Roadmap', href: '/roadmap' },
  { index: '07', label: 'Resources', href: '/resources' },
  { index: '08', label: 'Lab', href: '/lab' },
  { index: '09', label: 'Friends & classmates', href: '/testimonials' },
  { index: '10', label: 'Education', href: '/education' },
  { index: '11', label: 'Contact', href: '/contact' },
];

export const navigation = navigationSchema.parse(data);
