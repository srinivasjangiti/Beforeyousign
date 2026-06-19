import { pipeline, env, FeatureExtractionPipeline } from '@xenova/transformers';

// Configuration for Next.js environments
env.allowLocalModels = false;
env.useBrowserCache = false;

class EmbeddingsPipeline {
  static task = 'feature-extraction';
  static model = 'Xenova/all-MiniLM-L6-v2';
  static instance: Promise<FeatureExtractionPipeline> | null = null;

  static async getInstance(progress_callback?: any) {
    if (this.instance === null) {
      // Create pipeline (downloading model if needed)
      this.instance = pipeline(this.task as any, this.model, { progress_callback }) as Promise<FeatureExtractionPipeline>;
    }
    return this.instance;
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
