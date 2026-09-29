import { resourcesSchema } from './schemas';

/*
 * PLACEHOLDER: these are well-known starter picks, not confirmed personal
 * favorites. Swap in the resources you actually use — same shape (name,
 * url, description, cost: 'free' | 'freemium').
 */
const data = [
  {
    id: 'building-software',
    index: 1,
    title: 'Learning to Build Software',
    description: 'Where I actually learned to write and ship code.',
    items: [
      { name: 'The Odin Project', url: 'https://www.theodinproject.com', description: 'Free full-stack curriculum, project-based.', cost: 'free' },
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'The reference I check more than any other.', cost: 'free' },
      { name: 'roadmap.sh', url: 'https://roadmap.sh', description: 'Structured learning paths for dev and DevOps roles.', cost: 'free' },
    ],
  },
  {
    id: 'networking-devops',
    index: 2,
    title: 'Networking & DevOps',
    description: 'Where I\'m building toward a Network DevOps career.',
    items: [
      { name: 'Cisco Networking Academy', url: 'https://www.netacad.com', description: 'Free CCNA-aligned courses and packet tracer labs.', cost: 'free' },
      { name: 'Professor Messer', url: 'https://www.professormesser.com', description: 'Free video courses for Network+ and Security+.', cost: 'free' },
      { name: 'KodeKloud', url: 'https://kodekloud.com', description: 'Hands-on labs for Docker, Kubernetes and CI/CD.', cost: 'freemium' },
    ],
  },
  {
    id: 'staying-current',
    index: 3,
    title: 'Staying Current',
    description: 'How I keep up with what\'s shipping and what\'s changing.',
    items: [
      { name: 'Hacker News', url: 'https://news.ycombinator.com', description: 'Daily read for what the industry is actually talking about.', cost: 'free' },
      { name: 'GitHub Trending', url: 'https://github.com/trending', description: 'What the open-source world is building right now.', cost: 'free' },
    ],
  },
];

export const resources = resourcesSchema.parse(data);
