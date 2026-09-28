import { navigationSchema } from './schemas';

/* PLACEHOLDER */
const data = [
  { index: '01', label: 'Work', href: '/#work' },
  { index: '02', label: 'Capabilities', href: '/#capabilities' },
  { index: '03', label: 'Workflow', href: '/#workflow' },
  { index: '04', label: 'Experience', href: '/#experience' },
  { index: '05', label: 'Writing', href: '/#research' },
  { index: '06', label: 'Lab', href: '/#lab' },
  { index: '07', label: 'About', href: '/#about' },
  { index: '08', label: 'Contact', href: '/#contact' },
];

export const navigation = navigationSchema.parse(data);
