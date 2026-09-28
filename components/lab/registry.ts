import type { ComponentType } from 'react';
import { SubnetCalculator } from './SubnetCalculator';
import { PacketPath } from './PacketPath';
import { ConfigDiffViewer } from './ConfigDiffViewer';
import { LoadBalancerSimulator } from './LoadBalancerSimulator';
import { ErrorBudgetCalculator } from './ErrorBudgetCalculator';
import { RolloutSimulator } from './RolloutSimulator';

export const labComponents: Record<string, ComponentType> = {
  'subnet-calculator': SubnetCalculator,
  'packet-path': PacketPath,
  'config-diff-viewer': ConfigDiffViewer,
  'load-balancer-simulator': LoadBalancerSimulator,
  'error-budget-calculator': ErrorBudgetCalculator,
  'rollout-simulator': RolloutSimulator,
};
