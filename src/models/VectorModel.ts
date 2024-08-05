import sqlite3 from "sqlite3";
import { calculateSimilarity } from "../algorithms/Similarity";
import { clusterVectors } from "../algorithms/Clustering";

interface VectorRow {
  name: string;
  vector: Buffer;
  metadata: string;
}

class VectorModel {
  private db: sqlite3.Database;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  public initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
                CREATE TABLE IF NOT EXISTS vectors (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    vector BLOB,
                    metadata TEXT
                );
            `;
      this.db.run(query, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public insertVector(
    name: string,
    vector: Buffer,
    metadata: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO vectors (name, vector, metadata) VALUES (?, ?, ?)`;
      this.db.run(query, [name, vector, metadata], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public updateVector(
    name: string,
    vector: Buffer,
    metadata: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `UPDATE vectors SET vector = ?, metadata = ? WHERE name = ?`;
      this.db.run(query, [vector, metadata, name], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public getVectorByName(
    name: string,
  ): Promise<{ vector: Buffer; metadata: string } | null> {
    return new Promise((resolve, reject) => {
      const query = `SELECT vector, metadata FROM vectors WHERE name = ?`;
      this.db.get(query, [name], (err, row: any) => {
        if (err) {
          reject(err);
        } else {
          if (row) {
            resolve({
              vector: row.vector as Buffer,
              metadata: row.metadata as string,
            });
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  public deleteVector(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM vectors WHERE name = ?`;
      this.db.run(query, [name], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async searchSimilarVectors(
    vector: Buffer,
    topK: number,
    similarityMetric: string,
  ): Promise<string[]> {
    const vectors = await this.getAllVectors();
    const similarities = vectors.map(({ name, vector: vec }) => ({
      name,
      similarity: calculateSimilarity(
        new Float32Array(vector.buffer),
        new Float32Array(vec.buffer),
        similarityMetric,
      ),
    }));
    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, topK).map((sim) => sim.name);
  }

  public async clusterVectors(): Promise<{ [clusterId: number]: string[] }> {
    const vectors = await this.getAllVectors();
    const clusters = clusterVectors(
      vectors.map((v) => new Float32Array(v.vector.buffer)),
    );
    const result: { [clusterId: number]: string[] } = {};
    clusters.forEach((cluster: number, idx: number) => {
      if (!result[cluster]) {
        result[cluster] = [];
      }
      result[cluster].push(vectors[idx].name);
    });
    return result;
  }

  private getAllVectors(): Promise<
    { name: string; vector: Buffer; metadata: string }[]
  > {
    return new Promise((resolve, reject) => {
      const query = `SELECT name, vector, metadata FROM vectors`;
      this.db.all(query, (err, rows: unknown[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            rows.map((row) => ({
              name: (row as VectorRow).name,
              vector: (row as VectorRow).vector,
              metadata: (row as VectorRow).metadata,
            })),
          );
        }
      });
    });
  }
}

export default VectorModel;
