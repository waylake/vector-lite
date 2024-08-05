import VectorService from "./services/VectorService";
import {
  VectorStoreOptions,
  IndexType,
  SimilarVectorsQuery,
  Metadata,
} from "./types";

class VectorStore {
  private vectorService: VectorService;
  private indexType: IndexType;
  private indexOptions: any;

  constructor(options: VectorStoreOptions) {
    this.vectorService = new VectorService(options.dbPath);
    this.indexType = options.indexType;
    this.indexOptions = options.indexOptions;
  }

  public async initialize(): Promise<void> {
    await this.vectorService.initialize();
    this.initializeIndex();
  }

  private initializeIndex() {
    if (this.indexType === IndexType.HNSW) {
      console.log("Initializing HNSW index with options:", this.indexOptions);
    }
  }

  public async addVector(
    name: string,
    vector: number[],
    metadata: Metadata,
  ): Promise<void> {
    await this.vectorService.addVector(name, vector, metadata);
  }

  public async updateVector(
    name: string,
    vector: number[],
    metadata: Metadata,
  ): Promise<void> {
    await this.vectorService.updateVector(name, vector, metadata);
  }

  public async getVector(
    name: string,
  ): Promise<{ vector: number[]; metadata: Metadata } | null> {
    return await this.vectorService.getVector(name);
  }

  public async deleteVector(name: string): Promise<void> {
    await this.vectorService.deleteVector(name);
  }

  public async searchSimilarVectors(
    query: SimilarVectorsQuery,
  ): Promise<string[]> {
    return await this.vectorService.searchSimilarVectors(
      query.vector,
      query.topK,
      query.similarityMetric,
    );
  }

  public async clusterVectors(): Promise<{ [clusterId: number]: string[] }> {
    return await this.vectorService.clusterVectors();
  }
}

export default VectorStore;
