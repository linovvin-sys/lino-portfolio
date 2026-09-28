import { educationListSchema, certificationsSchema } from './schemas';

/* PLACEHOLDER: replace the institution, years and certifications with your real ones */
const degreeData = [
  {
    id: 'bs-computer-engineering',
    institution: '[Your University]',
    degree: 'B.S. Computer Engineering',
    field: 'Computer Networks',
    period: { start: '2013', end: '2017' },
  },
];

const certificationData = [
  {
    id: 'ccnp-enterprise',
    name: 'Cisco Certified Network Professional (CCNP) Enterprise',
    issuer: 'Cisco',
    date: '2022',
  },
  {
    id: 'cka',
    name: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation',
    date: '2023',
  },
  {
    id: 'aws-advanced-networking',
    name: 'AWS Certified Advanced Networking – Specialty',
    issuer: 'Amazon Web Services',
    date: '2023',
  },
  {
    id: 'terraform-associate',
    name: 'HashiCorp Certified: Terraform Associate',
    issuer: 'HashiCorp',
    date: '2024',
  },
];

export const education = educationListSchema.parse(degreeData);
export const certifications = certificationsSchema.parse(certificationData);
