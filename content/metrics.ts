import { metricsStripSchema } from './schemas';

const data = [
  { label: 'Projects built', value: '5', numericValue: 5 },
  { label: 'Technologies', value: '15', numericValue: 15, suffix: '+' },
  { label: 'Languages', value: '4', numericValue: 4, suffix: 'PHP · Java · Python · TS' },
  { label: 'Year in college', value: '3', numericValue: 3, suffix: 'rd' },
];

export const metricsStrip = metricsStripSchema.parse(data);
