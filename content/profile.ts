import { profileSchema } from './schemas';

/* PLACEHOLDER: GitHub, LinkedIn, X and calendar links are unverified — swap for real links before launch */
const data = {
  name: 'Lino Vincent G. Dela Cruz',
  title: 'Aspiring Network DevOps Engineer',
  location: 'Cavite, Philippines',
  timezone: 'Asia/Manila',
  tagline: '3rd-year IT student and aspiring Network DevOps engineer who builds full-stack systems and is learning to automate the networks they run on.',
  bio: 'I’m a third-year IT student who likes understanding how things work end to end. I’ve built web, desktop and AR projects with PHP, Java, Python and C++, built this portfolio with Next.js and TypeScript, and I ship my work with Git, Docker and CI/CD pipelines. Now I’m going deeper into networking fundamentals and Linux. My goal is to become a Network DevOps engineer who treats networks like software: automated, versioned and reliable.',
  availability: {
    status: 'available',
    message: 'Open to OJT and internship opportunities',
  },
  links: {
    github: 'https://github.com/placeholder',
    linkedin: 'https://linkedin.com/in/placeholder',
    x: 'https://x.com/placeholder',
    email: 'linovincentdelacruz@gmail.com',
    resume: '/resume',
    calendar: 'https://cal.com/placeholder',
  },
  principles: [
    { title: 'Learn by building', description: 'Every concept sticks better once I’ve used it in a real project.' },
    { title: 'Fundamentals first', description: 'Packets before platforms: understand how the network works before automating it.' },
    { title: 'Automate the boring parts', description: 'If I do something twice by hand, I look for a way to script it.' },
    { title: 'Document as I go', description: 'Clear READMEs and notes make my projects easy to run, review and improve.' },
    { title: 'Stay curious', description: 'Ask questions, read the docs, and share what I learn with classmates.' },
  ],
};

export const profile = profileSchema.parse(data);
