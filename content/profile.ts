import { profileSchema } from './schemas';

/* PLACEHOLDER: social URLs and resume path are unverified — swap for real links before launch */
const data = {
  name: 'Lino Vincent G. Dela Cruz',
  title: 'Senior Generative AI Engineer',
  location: 'Cavite, Philippines',
  timezone: 'Asia/Manila',
  tagline: 'Senior Generative AI Engineer working across networking DevOps and generative AI systems.',
  bio: 'I build AI systems that ship. From orchestrating multi-agent workflows to optimizing LLM inference, I focus on transforming cutting-edge research into production-grade products. My approach is grounded in rigorous evaluation, robust infrastructure, and a deep understanding of user needs.',
  availability: {
    status: 'available',
    message: 'Open to senior/staff roles and consulting',
  },
  links: {
    github: 'https://github.com/placeholder',
    linkedin: 'https://linkedin.com/in/placeholder',
    x: 'https://x.com/placeholder',
    email: 'hello@placeholder.dev',
    resume: '/resume',
    calendar: 'https://cal.com/placeholder',
  },
  principles: [
    { title: 'Ship, then optimize', description: 'Get a robust baseline into production early, then iteratively improve.' },
    { title: 'Evals before vibes', description: 'Rely on data-driven metrics and automated evaluation frameworks over subjective testing.' },
    { title: 'Complexity is a cost', description: 'Favor simpler architectures and predictable pipelines unless advanced techniques are strictly necessary.' },
    { title: 'UX drives AI design', description: 'The models serve the product, and the product serves the user.' },
    { title: 'Understand the constraints', description: 'Always design around latency, cost, and reliability requirements.' },
  ],
};

export const profile = profileSchema.parse(data);
