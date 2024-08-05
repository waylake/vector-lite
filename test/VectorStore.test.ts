import { VectorStore, IndexType } from "../src/index";

describe("VectorStore", () => {
  let store: VectorStore;

  beforeAll(async () => {
    store = new VectorStore({
      dbPath: "test.sqlite",
      indexType: IndexType.HNSW,
      indexOptions: { maxConnections: 16, efConstruction: 200 },
    });
    await store.initialize();
  });

  test("should add and retrieve a vector", async () => {
    const vector = [1.0, 2.0, 3.0];
    const metadata = { description: "example vector" };
    await store.addVector("example_vector", vector, metadata);

    const retrievedVector = await store.getVector("example_vector");
    expect(retrievedVector?.vector).toEqual(vector);
    expect(retrievedVector?.metadata).toEqual(metadata);
  });

  test("should update a vector", async () => {
    const vector = [4.0, 5.0, 6.0];
    const metadata = { description: "updated vector" };
    await store.updateVector("example_vector", vector, metadata);

    const retrievedVector = await store.getVector("example_vector");
    expect(retrievedVector?.vector).toEqual(vector);
    expect(retrievedVector?.metadata).toEqual(metadata);
  });

  test("should delete a vector", async () => {
    await store.deleteVector("example_vector");
    const retrievedVector = await store.getVector("example_vector");
    expect(retrievedVector).toBeNull();
  });

  test("should search for similar vectors", async () => {
    const vector = [1.0, 2.0, 3.0];
    const metadata = { description: "example vector" };
    await store.addVector("vector1", vector, metadata);

    const query = { vector, topK: 1, similarityMetric: "cosine" };
    const similarVectors = await store.searchSimilarVectors(query);
    expect(similarVectors).toContain("vector1");

    await store.deleteVector("vector1");
  });

  test("should cluster vectors", async () => {
    const vector1 = [1.0, 2.0, 3.0];
    const vector2 = [4.0, 5.0, 6.0];
    await store.addVector("vector1", vector1, {});
    await store.addVector("vector2", vector2, {});

    const clusters = await store.clusterVectors();
    expect(Object.keys(clusters)).toHaveLength(2);

    await store.deleteVector("vector1");
    await store.deleteVector("vector2");
  });
});
