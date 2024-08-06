# VectorLite

VectorLite is a TypeScript library for storing and searching vectors using SQLite. It provides efficient vector storage and similarity search capabilities with support for HNSW indexing.

## Features

- Vector storage and retrieval using SQLite
- Support for HNSW (Hierarchical Navigable Small World) indexing
- Vector similarity search
- Basic clustering algorithms

## Installation (NOT IMPLEMENTED YET)

```bash
npm install vectorlite
```

## Usage 


```typescript
import { VectorStore, IndexType } from 'vectorlite';

const store = new VectorStore({
  dbPath: 'vectors.sqlite',
  indexType: IndexType.HNSW,
  indexOptions: { maxConnections: 16, efConstruction: 200 },
});

async function main() {
  await store.initialize();

  const vector = [1.0, 2.0, 3.0];
  const metadata = { description: 'example vector' };
  await store.addVector('example_vector', vector, metadata);

  const retrievedVector = await store.getVector('example_vector');
  console.log(retrievedVector);
}

main();
```

## API 

### VectorStore 
`constructor(options: { dbPath: string; indexType: IndexType; indexOptions: any })` \
Creates a new instance of VectorStore. \
`initialize(): Promise<void>` \
Initializes the vector store. \
`addVector(name: string, vector: number[], metadata: any): Promise<void>` \
Adds a vector to the store. \
`getVector(name: string): Promise<{ vector: number[]; metadata: any } | null>`\
Retrieves a vector from the store.\
`updateVector(name: string, vector: number[], metadata: any): Promise<void>`\
Updates a vector in the store.\
`deleteVector(name: string): Promise<void>`\
Deletes a vector from the store.\
`searchSimilarVectors(query: { vector: number[]; topK: number; similarityMetric: string }): Promise<string[]>`\
Searches for similar vectors in the store.\
`clusterVectors(): Promise<{ [clusterId: number]: string[] }>`\
Clusters vectors in the store.\

## Contributing 
See CONTRIBUTE.md  for contribution guidelines.
