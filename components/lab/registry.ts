import type { ComponentType } from 'react';
import { TokenizerVisualizer } from './TokenizerVisualizer';
import { PromptDiffViewer } from './PromptDiffViewer';
import { AttentionHeatmap } from './AttentionHeatmap';
import { RagChunkingPlayground } from './RagChunkingPlayground';
import { EmbeddingNearestNeighbors } from './EmbeddingNearestNeighbors';
import { InferenceLatencySimulator } from './InferenceLatencySimulator';

export const labComponents: Record<string, ComponentType> = {
  'tokenizer-visualizer': TokenizerVisualizer,
  'prompt-diff-viewer': PromptDiffViewer,
  'attention-heatmap': AttentionHeatmap,
  'rag-chunking-playground': RagChunkingPlayground,
  'embedding-nearest-neighbors': EmbeddingNearestNeighbors,
  'inference-latency-simulator': InferenceLatencySimulator,
};
