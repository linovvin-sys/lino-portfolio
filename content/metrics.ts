import { metricsStripSchema } from './schemas';

/* PLACEHOLDER: illustrative numbers — replace with your own */
const data = [
  { label: 'Network uptime', value: '99.99', numericValue: 99.99, suffix: '%' },
  { label: 'Devices automated', value: '1,200', numericValue: 1200, suffix: '+' },
  { label: 'Faster changes', value: '85', numericValue: 85, suffix: '%' },
  { label: 'Deploys per week', value: '200', numericValue: 200, suffix: '+' },
];

export const metricsStrip = metricsStripSchema.parse(data);
