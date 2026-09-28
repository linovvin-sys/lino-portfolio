import { metricsStripSchema } from './schemas';

const data = [
  { label: 'p95 latency', value: '142', numericValue: 142, suffix: 'ms' },
  { label: 'Cost reduction', value: '60', numericValue: 60, suffix: '%' },
  { label: 'Eval score', value: '94', numericValue: 94, suffix: '%' },
  { label: 'Queries served', value: '50', numericValue: 50, suffix: 'K+/day' },
];

export const metricsStrip = metricsStripSchema.parse(data);
