import { educationListSchema, certificationsSchema } from './schemas';

const degreeData = [
  {
    id: 'stanford-ms',
    institution: 'Stanford University',
    degree: 'M.S. Computer Science',
    field: 'Artificial Intelligence',
    period: { start: '2017', end: '2019' },
  },
  {
    id: 'umich-bs',
    institution: 'University of Michigan',
    degree: 'B.S. Computer Science',
    field: 'Computer Science',
    period: { start: '2013', end: '2017' },
  },
];

const certificationData = [
  {
    id: 'aws-ml-specialty',
    name: 'AWS Certified Machine Learning – Specialty',
    issuer: 'Amazon Web Services',
    date: '2022',
  },
  {
    id: 'dlai-genai-llm',
    name: 'Generative AI with Large Language Models',
    issuer: 'DeepLearning.AI',
    date: '2023',
  },
  {
    id: 'cka',
    name: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation',
    date: '2021',
  },
];

export const education = educationListSchema.parse(degreeData);
export const certifications = certificationsSchema.parse(certificationData);
