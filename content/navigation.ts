import { navigationSchema } from './schemas';

/* PLACEHOLDER */
const data = [
  { index: '01', label: 'Work', href: '/#work' },
  { index: '02', label: 'Capabilities', href: '/#capabilities' },
  { index: '03', label: 'Experience', href: '/#experience' },
  { index: '04', label: 'Research', href: '/#research' },
  { index: '05', label: 'Lab', href: '/#lab' },
  { index: '06', label: 'About', href: '/#about' },
  { index: '07', label: 'Contact', href: '/#contact' }
];

export const navigation = navigationSchema.parse(data);
