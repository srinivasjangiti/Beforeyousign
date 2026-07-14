import { magnitude } from './similarity';

export interface Cluster {
  id: number;
  centroid: number[];
  items: number[]; // indices of items in this cluster
}

/**
 * Calculates Euclidean distance between two vectors
 */
export function euclideanDistance(vecA: number[], vecB: number[]): number {
  let sum = 0;
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

/**
 * Standard K-Means clustering algorithm
 * Because our embeddings are normalized, Euclidean distance is mathematically 
 * equivalent to Cosine distance for clustering purposes.
 */
export function kMeans(
  data: number[][], 
  k: number, 
  maxIterations: number = 100
): Cluster[] {
  if (data.length === 0 || k <= 0) return [];
  if (k > data.length) k = data.length;

  // 1. Initialize centroids randomly using data points (Forgy method)
  const clusters: Cluster[] = [];
  const usedIndices = new Set<number>();
  
  for (let i = 0; i < k; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * data.length);
    } while (usedIndices.has(randomIndex));
    
    usedIndices.add(randomIndex);
    clusters.push({
      id: i,
      // Deep copy the chosen centroid to avoid mutating the original data
      centroid: [...data[randomIndex]], 
      items: []
    });
  }

  let iterations = 0;
  let centroidsChanged = true;

  while (iterations < maxIterations && centroidsChanged) {
    // Clear items for this iteration
    clusters.forEach(c => c.items = []);

    // 2. Assignment Step: Assign each vector to the closest centroid
    for (let i = 0; i < data.length; i++) {
      const vec = data[i];
      let minDistance = Infinity;
      let closestClusterIndex = 0;

      for (let c = 0; c < clusters.length; c++) {
        const dist = euclideanDistance(vec, clusters[c].centroid);
        if (dist < minDistance) {
          minDistance = dist;
          closestClusterIndex = c;
        }
      }

      clusters[closestClusterIndex].items.push(i);
    }

    // 3. Update Step: Recalculate centroids
    centroidsChanged = false;

    for (let c = 0; c < clusters.length; c++) {
      const cluster = clusters[c];
      if (cluster.items.length === 0) continue;

      const newCentroid = new Array(data[0].length).fill(0);
      
      // Sum all vectors in the cluster
      for (const idx of cluster.items) {
        const vec = data[idx];
        for (let j = 0; j < vec.length; j++) {
          newCentroid[j] += vec[j];
        }
      }

      // Calculate mean and re-normalize (spherical K-means approach)
      for (let j = 0; j < newCentroid.length; j++) {
        newCentroid[j] /= cluster.items.length;
      }
      
      const mag = magnitude(newCentroid);
      for (let j = 0; j < newCentroid.length; j++) {
        newCentroid[j] /= (mag > 0 ? mag : 1);
      }

      // Check if centroid moved
      const shift = euclideanDistance(cluster.centroid, newCentroid);
      if (shift > 1e-4) {
        centroidsChanged = true;
        cluster.centroid = newCentroid;
      }
    }

    iterations++;
  }

  return clusters;
}
