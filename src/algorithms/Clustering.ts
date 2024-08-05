function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(
    a.reduce((sum, value, index) => sum + Math.pow(value - b[index], 2), 0),
  );
}

function initializeCentroids(vectors: number[][], k: number): number[][] {
  const centroids: number[][] = [];
  const usedIndices: Set<number> = new Set();

  while (centroids.length < k) {
    const randomIndex = Math.floor(Math.random() * vectors.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      centroids.push(vectors[randomIndex]);
    }
  }

  return centroids;
}

function assignClusters(vectors: number[][], centroids: number[][]): number[] {
  return vectors.map((vector) => {
    let minDistance = Infinity;
    let clusterIndex = -1;

    centroids.forEach((centroid, index) => {
      const distance = euclideanDistance(vector, centroid);
      if (distance < minDistance) {
        minDistance = distance;
        clusterIndex = index;
      }
    });

    return clusterIndex;
  });
}

function updateCentroids(
  vectors: number[][],
  clusters: number[],
  k: number,
): number[][] {
  const newCentroids: number[][] = Array.from({ length: k }, () =>
    Array(vectors[0].length).fill(0),
  );
  const counts: number[] = Array(k).fill(0);

  clusters.forEach((cluster, index) => {
    counts[cluster]++;
    vectors[index].forEach((value, valueIndex) => {
      newCentroids[cluster][valueIndex] += value;
    });
  });

  return newCentroids.map((centroid, index) =>
    centroid.map((value) => value / counts[index]),
  );
}

function hasConverged(
  oldCentroids: number[][],
  newCentroids: number[][],
): boolean {
  return oldCentroids.every((centroid, index) =>
    centroid.every(
      (value, valueIndex) => value === newCentroids[index][valueIndex],
    ),
  );
}

export function kmeans(
  vectors: number[][],
  k: number,
  maxIterations = 100,
): number[] {
  let centroids = initializeCentroids(vectors, k);
  let clusters = assignClusters(vectors, centroids);

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const newCentroids = updateCentroids(vectors, clusters, k);
    if (hasConverged(centroids, newCentroids)) {
      break;
    }
    centroids = newCentroids;
    clusters = assignClusters(vectors, centroids);
  }

  return clusters;
}

export function clusterVectors(vectors: Float32Array[]): number[] {
  const data = vectors.map((v) => Array.from(v));
  return kmeans(data, 3);
}
