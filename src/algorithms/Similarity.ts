export function calculateSimilarity(
  vectorA: Float32Array,
  vectorB: Float32Array,
  metric: string,
): number {
  switch (metric) {
    case "euclidean":
      return euclideanDistance(vectorA, vectorB);
    case "cosine":
      return cosineSimilarity(vectorA, vectorB);
    default:
      throw new Error(`Unknown similarity metric: ${metric}`);
  }
}

function euclideanDistance(
  vectorA: Float32Array,
  vectorB: Float32Array,
): number {
  return Math.sqrt(
    vectorA.reduce((sum, a, idx) => sum + Math.pow(a - vectorB[idx], 2), 0),
  );
}

function cosineSimilarity(
  vectorA: Float32Array,
  vectorB: Float32Array,
): number {
  const dotProduct = vectorA.reduce((sum, a, idx) => sum + a * vectorB[idx], 0);
  const magnitudeA = Math.sqrt(
    vectorA.reduce((sum, a) => sum + Math.pow(a, 2), 0),
  );
  const magnitudeB = Math.sqrt(
    vectorB.reduce((sum, b) => sum + Math.pow(b, 2), 0),
  );
  return dotProduct / (magnitudeA * magnitudeB);
}
