import { testimonialsSchema } from './schemas';

/* PLACEHOLDER: names/companies are illustrative until real references are collected */
const data = [
  {
    id: 'head-of-infra',
    quote: 'Lino turned our network from the thing everyone was afraid to touch into something we change several times a day. Every change is reviewed, tested and reversible, and outages from changes basically stopped.',
    author: 'Maria Santos',
    role: 'Head of Infrastructure',
    company: 'CloudBridge Systems',
    featured: true,
  },
  {
    id: 'sre-lead',
    quote: 'The observability work was a turning point. We went from finding out about incidents from customers to seeing them coming on a dashboard, with alerts that actually meant something.',
    author: 'Daniel Reyes',
    role: 'SRE Lead',
    company: 'NetCore Solutions',
    featured: true,
  },
  {
    id: 'platform-manager',
    quote: 'Rare mix of deep networking knowledge and real software engineering discipline. The platform Lino built lets our developers ship on their own without ever opening a network ticket.',
    author: 'Angela Cruz',
    role: 'Platform Engineering Manager',
    company: 'Pacific Telecom',
    featured: true,
  },
];

export const testimonials = testimonialsSchema.parse(data);
