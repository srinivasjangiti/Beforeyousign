import { getEmbedding } from './embeddings';
import { getCachedEmbedding, setCachedEmbedding } from './portfolio-cache';
import { cosineSimilarity, similarityToPercentage } from './similarity';

/**
 * Extracts a representative string from the JSON summary for embedding
 */
function extractSummaryText(summaryJsonStr: string): string {
  try {
    const data = JSON.parse(summaryJsonStr);
    if (data.executiveSummary) return data.executiveSummary;
    if (data.summary) return data.summary;
    // Fallback if the object doesn't have those keys
    return JSON.stringify(data).substring(0, 800);
  } catch (e) {
    // If not valid JSON, just take the first part of the string
    return summaryJsonStr.substring(0, 800);
  }
}

/**
 * Retrieves the MiniLM embedding for a contract, checking the TTL cache first
 * to avoid unnecessary transformer inferences.
 */
export async function getContractEmbedding(contractId: string, summaryJsonStr: string): Promise<number[]> {
  const cached = getCachedEmbedding(contractId);
  if (cached) {
    return cached;
  }
  
  const textToEmbed = extractSummaryText(summaryJsonStr);
  const embedding = await getEmbedding(textToEmbed);
  
  setCachedEmbedding(contractId, embedding);
  return embedding;
}

/**
 * Calculates semantic similarity percentage between two contract embeddings
 */
export function computeSemanticSimilarity(vectorA: number[], vectorB: number[]): number {
  const sim = cosineSimilarity(vectorA, vectorB);
  return similarityToPercentage(sim);
}
