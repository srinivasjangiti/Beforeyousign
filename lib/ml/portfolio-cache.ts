/**
 * Ephemeral Cache for Semantic Portfolio Embeddings
 *
 * This implements the 24-hour TTL in-memory caching layer
 * to avoid dragging vectors into the Prisma schema or making
 * frequent expensive embedding calls for known contracts.
 */

interface CacheEntry {
  embedding: number[];
  timestamp: number;
}

const embeddingCache = new Map<string, CacheEntry>();
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export const cacheMetrics = {
  hits: 0,
  misses: 0,
  get hitRate() {
    const total = this.hits + this.misses;
    return total === 0 ? 0 : Math.round((this.hits / total) * 100);
  }
};

export function getCachedEmbedding(contractId: string): number[] | null {
  const entry = embeddingCache.get(contractId);
  if (!entry) {
    cacheMetrics.misses++;
    return null;
  }
  
  if (Date.now() - entry.timestamp > TTL_MS) {
    embeddingCache.delete(contractId);
    cacheMetrics.misses++;
    return null;
  }
  
  cacheMetrics.hits++;
  return entry.embedding;
}

export function setCachedEmbedding(contractId: string, embedding: number[]): void {
  embeddingCache.set(contractId, {
    embedding,
    timestamp: Date.now()
  });
}
