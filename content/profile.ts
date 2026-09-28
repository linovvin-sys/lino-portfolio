import { profileSchema } from './schemas';

/* PLACEHOLDER: social URLs, email and calendar link are unverified — swap for real links before launch */
const data = {
  name: 'Lino Vincent G. Dela Cruz',
  title: 'Network DevOps Engineer',
  location: 'Cavite, Philippines',
  timezone: 'Asia/Manila',
  tagline: 'Network DevOps Engineer automating networks and the infrastructure that runs on them.',
  bio: 'I treat networks like software. From automating configuration across thousands of devices to building CI/CD pipelines for infrastructure, I turn fragile manual changes into versioned, tested and observable deployments. My approach is grounded in automation, reliability engineering and a deep understanding of how packets actually move.',
  availability: {
    status: 'available',
    message: 'Open to Network DevOps and platform roles',
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
    { title: 'Automate the second time', description: 'Do it by hand once to understand it; the second time, write the playbook.' },
    { title: 'Everything as code', description: 'Configs, topology and policy live in Git, reviewed like any other change.' },
    { title: 'Test before you touch prod', description: 'Every change is linted, validated and dry-run in CI before it reaches a device.' },
    { title: 'Know the blast radius', description: 'Roll out in small batches with an automatic rollback path.' },
    { title: 'If it is not observed, it is not done', description: 'Telemetry, alerts and dashboards ship with the change, not after the incident.' },
  ],
};

export const profile = profileSchema.parse(data);
