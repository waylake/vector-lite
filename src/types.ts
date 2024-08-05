export enum IndexType {
  HNSW = "HNSW",
}

export interface IndexOptions {
  maxConnections?: number;
  efConstruction?: number;
}

export interface VectorStoreOptions {
  dbPath: string;
  indexType: IndexType;
  indexOptions: IndexOptions;
}

export interface SimilarVectorsQuery {
  vector: number[];
  topK: number;
  similarityMetric: string;
}

export interface Metadata {
  [key: string]: any;
}
