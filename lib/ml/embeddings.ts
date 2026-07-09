import { pipeline, env, FeatureExtractionPipeline } from '@xenova/transformers';

// Configuration for Next.js environments
env.allowLocalModels = false;
env.useBrowserCache = false;

const globalForPipeline = globalThis as unknown as {
  pipelinePromise: Promise<FeatureExtractionPipeline> | undefined;
};

class EmbeddingsPipeline {
  static task = 'feature-extraction';
  static model = 'Xenova/all-MiniLM-L6-v2';

  static async getInstance(progress_callback?: any) {
    if (!globalForPipeline.pipelinePromise) {
      globalForPipeline.pipelinePromise = pipeline(this.task as any, this.model, { progress_callback }) as Promise<FeatureExtractionPipeline>;
    }
    return globalForPipeline.pipelinePromise;
  }
}

/**
 * Computes the 384-dimensional dense vector embedding for a given string
 * using the all-MiniLM-L6-v2 model.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const extractor = await EmbeddingsPipeline.getInstance();
    
    // Perform feature extraction
    // pooling: 'mean' and normalize: true are standard for semantic search
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    
    // The output is a Tensor. We convert it to a standard JS array
    return Array.from(output.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Batch compute embeddings for multiple strings
 */
export async function getEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  try {
    const extractor = await EmbeddingsPipeline.getInstance();
    const results: number[][] = [];
    
    for (const text of texts) {
      const output = await extractor(text, { pooling: 'mean', normalize: true });
      results.push(Array.from(output.data));
    }
    
    return results;
  } catch (error) {
    console.error('Error generating batch embeddings:', error);
    throw error;
  }
}
