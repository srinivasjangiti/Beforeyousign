import { getEmbedding } from './embeddings';
import { cosineSimilarity, similarityToPercentage } from './similarity';
// We'll read the legal precedents directly for the knowledge base
import precedentsData from '../../data/legal-precedents.json';
import embeddingsData from '../../data/legal-precedents-embeddings.json';

export interface CorpusStats {
  medianRisk: number;
  minRisk: number;
  maxRisk: number;
  sampleSize: number;
}

export interface RetrievalResult {
  id: string;
  category: string;
  text: string;
  similarityScore: number;
  riskScoreBenchmark: number;
  source?: string;
  corpusStats?: CorpusStats;
}

const queryCache = new Map<string, RetrievalResult[]>();

/**
 * Searches the local LEDGAR Knowledge Base for the most similar clause
 * to the provided input text.
 */
export async function findSimilarClause(text: string, topK: number = 3): Promise<RetrievalResult[]> {
  try {
    const cacheKey = `${text.substring(0, 50)}_${topK}`;
    if (queryCache.has(cacheKey)) {
      return queryCache.get(cacheKey)!;
    }

    // 1. Embed the query text
    const queryVector = await getEmbedding(text);
    
    // 2. Compute similarity against all knowledge base vectors
    const results: RetrievalResult[] = [];
    
    for (const precedent of precedentsData) {
      const dbVector = (embeddingsData as Record<string, number[]>)[precedent.id];
      if (!dbVector) continue;
      
      const sim = cosineSimilarity(queryVector, dbVector);
      
      results.push({
        id: precedent.id,
        category: precedent.category,
        text: precedent.text,
        similarityScore: similarityToPercentage(sim),
        riskScoreBenchmark: precedent.risk_score_benchmark,
        source: precedent.source
      });
    }
    
    // 3. Sort by similarity descending
    results.sort((a, b) => b.similarityScore - a.similarityScore);
    
    const finalResults = results.slice(0, topK);
    
    // Attach benchmark stats
    for (const res of finalResults) {
      const categoryClauses = precedentsData.filter(p => p.category === res.category);
      const risks = categoryClauses.map(p => p.risk_score_benchmark).sort((a, b) => a - b);
      if (risks.length > 0) {
        res.corpusStats = {
          minRisk: risks[0],
          maxRisk: risks[risks.length - 1],
          medianRisk: risks[Math.floor(risks.length / 2)],
          sampleSize: risks.length
        };
      }
    }
    
    queryCache.set(cacheKey, finalResults);
    
    // Prevent cache from growing infinitely
    if (queryCache.size > 500) {
      const firstKey = queryCache.keys().next().value;
      if (firstKey) queryCache.delete(firstKey);
    }
    
    return finalResults;
    
  } catch (error) {
    console.error('Error during semantic search:', error);
    return [];
  }
}
