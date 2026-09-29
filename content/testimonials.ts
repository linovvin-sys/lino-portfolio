import { testimonialsSchema } from './schemas';

/*
 * PLACEHOLDER: ask your friends/classmates for a short quote, then fill in
 * their name, what they do, and a link to their portfolio (`url`).
 * The card links to `url` with a "View portfolio" button when it's set.
 */
const data = [
  {
    id: 'friend-1',
    quote: 'Lino is the teammate who actually reads the error message. On our projects he set up the database, kept everyone on Git branches, and still found time to help the rest of us debug.',
    author: 'Ian Reyes',
    role: 'IT Student',
    company: 'National College of Science and Technology',
    relationship: 'Classmate',
    url: 'https://example.com',
    featured: true,
  },
  {
    id: 'friend-2',
    quote: 'Working with Lino on our term project has been easy. He explains networking and backend concepts clearly, and he’s always excited to try the next tool, whether that’s Docker, AR or a new framework.',
    author: 'Frankyz Malbog',
    role: 'Frontend Developer',
    company: 'Term project teammate',
    relationship: 'Teammate',
    url: 'https://example.com',
    featured: true,
  },
  {
    id: 'friend-3',
    quote: 'Whenever our labs broke in Packet Tracer, Lino was the one tracing the problem hop by hop. He’s patient, curious, and genuinely likes figuring out how things work.',
    author: 'Bea Bulado',
    role: 'Aspiring Network Engineer',
    company: 'National College of Science and Technology',
    relationship: 'Lab partner',
    url: 'https://example.com',
    featured: true,
  },
];

export const testimonials = testimonialsSchema.parse(data);
