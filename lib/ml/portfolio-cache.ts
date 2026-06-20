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

export function getCachedEmbedding(contractId: string): number[] | null {
  const entry = embeddingCache.get(contractId);
  if (!entry) return null;
  
  if (Date.now() - entry.timestamp > TTL_MS) {
    embeddingCache.delete(contractId);
    return null;
  }
  
  return entry.embedding;
}

export function setCachedEmbedding(contractId: string, embedding: number[]): void {
  embeddingCache.set(contractId, {
    embedding,
    timestamp: Date.now()
  });
}
