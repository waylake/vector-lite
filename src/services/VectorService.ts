import VectorModel from "../models/VectorModel";
import { openDatabase } from "../utils/Database";
import { Metadata } from "../types";

class VectorService {
  private model: VectorModel;

  constructor(dbPath: string) {
    const db = openDatabase(dbPath);
    this.model = new VectorModel(db);
  }

  public async initialize(): Promise<void> {
    await this.model.initialize();
  }

  public async addVector(
    name: string,
    vector: number[],
    metadata: Metadata,
  ): Promise<void> {
    const buffer = Buffer.from(new Float32Array(vector).buffer);
    await this.model.insertVector(name, buffer, JSON.stringify(metadata));
  }

  public async updateVector(
    name: string,
    vector: number[],
    metadata: Metadata,
  ): Promise<void> {
    const buffer = Buffer.from(new Float32Array(vector).buffer);
    await this.model.updateVector(name, buffer, JSON.stringify(metadata));
  }

  public async getVector(
    name: string,
  ): Promise<{ vector: number[]; metadata: Metadata } | null> {
    const result = await this.model.getVectorByName(name);
    if (result) {
      const floatArray = new Float32Array(result.vector.buffer);
      return {
        vector: Array.from(floatArray),
        metadata: JSON.parse(result.metadata),
      };
    }
    return null;
  }

  public async deleteVector(name: string): Promise<void> {
    await this.model.deleteVector(name);
  }

  public async searchSimilarVectors(
    vector: number[],
    topK: number,
    similarityMetric: string,
  ): Promise<string[]> {
    const buffer = Buffer.from(new Float32Array(vector).buffer);
    return await this.model.searchSimilarVectors(
      buffer,
      topK,
      similarityMetric,
    );
  }

  public async clusterVectors(): Promise<{ [clusterId: number]: string[] }> {
    return await this.model.clusterVectors();
  }
}

export default VectorService;
