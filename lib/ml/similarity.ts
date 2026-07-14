export function dotProduct(vecA: number[], vecB: number[]): number {
  let product = 0;
  for (let i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i];
  }
  return product;
}

export function magnitude(vec: number[]): number {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must be of the same length');
  }
  const dot = dotProduct(vecA, vecB);
  const magA = magnitude(vecA);
  const magB = magnitude(vecB);
  
  if (magA === 0 || magB === 0) return 0;
  
  return dot / (magA * magB);
}

// Convert cosine similarity [-1, 1] to a percentage [0, 100]
export function similarityToPercentage(sim: number): number {
  // Cosine similarity goes from -1 to 1. Usually in NLP embeddings it's 0 to 1.
  // We'll clamp to 0 and multiply by 100
  return Math.max(0, Math.round(sim * 1000) / 10);
}
