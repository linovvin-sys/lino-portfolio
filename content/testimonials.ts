import { testimonialsSchema } from './schemas';

/* PLACEHOLDER: names/companies are illustrative until real references are collected */
const data = [
  {
    id: 'vp-eng-acme',
    quote: "Their deep understanding of both LLM inference and distributed systems allowed us to cut our serving costs in half while improving latency. They don't just build demos; they build robust platforms that handle real production traffic.",
    author: 'Priya Ramachandran',
    role: 'VP Engineering',
    company: 'Acme AI',
    featured: true,
  },
  {
    id: 'cto-nextgen',
    quote: 'The evaluation framework they architected fundamentally changed how we ship AI features. We went from vibes-based testing to rigorous, automated CI/CD for prompts in a matter of weeks.',
    author: 'Marcus Whitfield',
    role: 'CTO',
    company: 'NextGen Tech',
    featured: true,
  },
  {
    id: 'staff-eng-datacorp',
    quote: 'An exceptional engineer who seamlessly bridges the gap between AI research and product engineering. Their work on our multi-agent orchestrator was instrumental in unlocking new autonomous capabilities for our users.',
    author: 'Alessandra Ferreira',
    role: 'Staff Engineer',
    company: 'DataCorp',
    featured: true,
  },
];

export const testimonials = testimonialsSchema.parse(data);
