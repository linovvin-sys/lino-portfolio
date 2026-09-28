import { educationListSchema, certificationsSchema } from './schemas';

/* Networking certifications. Update `date` as you progress: 'In progress' → 'Up next' → the year you earned it. */
const degreeData = [
  {
    id: 'bs-information-technology',
    institution: 'National College of Science and Technology',
    degree: 'B.S. Information Technology',
    field: '3rd year',
    period: { start: '2024', end: '2028 (expected)' },
  },
];

const certificationData = [
  {
    id: 'netacad-networking-basics',
    name: 'Cisco NetAcad: Networking Basics',
    issuer: 'Cisco Networking Academy',
    date: 'In progress',
  },
  {
    id: 'netacad-itn',
    name: 'CCNA: Introduction to Networks',
    issuer: 'Cisco Networking Academy',
    date: 'In progress',
  },
  {
    id: 'netacad-srwe',
    name: 'CCNA: Switching, Routing & Wireless Essentials',
    issuer: 'Cisco Networking Academy',
    date: 'Up next',
  },
  {
    id: 'ccna',
    name: 'Cisco Certified Network Associate (CCNA)',
    issuer: 'Cisco',
    date: 'Goal',
  },
];

export const education = educationListSchema.parse(degreeData);
export const certifications = certificationsSchema.parse(certificationData);
