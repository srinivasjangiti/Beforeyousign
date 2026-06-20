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

export interface RetrievalResponse {
  results: RetrievalResult[];
  predictedCategory: string;
  confidence: number;
  recommendedAlternative?: RetrievalResult;
}

// Bounded in-memory query cache (FIFO eviction, max 500 entries)
const queryCache = new Map<string, RetrievalResponse>();

/**
 * Searches the local LEDGAR Knowledge Base for the most similar clause
 * to the provided input text and predicts its category.
 */
export async function findSimilarClause(text: string, topK: number = 3, currentRiskScore?: number): Promise<RetrievalResponse> {
  try {
    const cacheKey = `${text.substring(0, 50)}_${topK}_${currentRiskScore || 0}`;
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
    
    // 4. K-NN Category Prediction based on Top-K
    const categoryCounts: Record<string, number> = {};
    for (const res of finalResults) {
      categoryCounts[res.category] = (categoryCounts[res.category] || 0) + 1;
    }
    
    let bestCategory = 'Unknown';
    let maxVotes = 0;
    for (const [cat, votes] of Object.entries(categoryCounts)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        bestCategory = cat;
      }
    }

    // 5. Risk-Aware Clause Recommendation Engine
    let recommendedAlternative: RetrievalResult | undefined = undefined;
    if (currentRiskScore !== undefined) {
      // Step 1: Retrieve Top 20 similar clauses
      const top20 = results.slice(0, 20);
      
      // Step 2: Remove clauses with risk >= current clause risk
      const saferAlternatives = top20.filter(c => c.riskScoreBenchmark < currentRiskScore);
      
      if (saferAlternatives.length > 0) {
        // Step 3: Sort by similarityScore DESC, riskScoreBenchmark ASC
        saferAlternatives.sort((a, b) => {
          if (b.similarityScore !== a.similarityScore) {
            return b.similarityScore - a.similarityScore;
          }
          return a.riskScoreBenchmark - b.riskScoreBenchmark;
        });
        
        // Step 4: Return the best recommendation
        recommendedAlternative = saferAlternatives[0];
      }
    }
    
    const response: RetrievalResponse = {
      results: finalResults,
      predictedCategory: bestCategory,
      confidence: Math.round((maxVotes / topK) * 100),
      recommendedAlternative
    };
    
    queryCache.set(cacheKey, response);
    
    // Prevent cache from growing infinitely
    if (queryCache.size > 500) {
      const firstKey = queryCache.keys().next().value;
      if (firstKey) queryCache.delete(firstKey);
    }
    
    return response;
    
  } catch (error) {
    console.error('Error during semantic search:', error);
    return { results: [], predictedCategory: 'Unknown', confidence: 0 };
  }
}
