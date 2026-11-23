export interface ProtocolChunk {
  id: string;
  protocolId: string;
  phaseNumber: number;
  text: string;
  tags: string[];
}

export interface VectorSearchResult {
  chunk: ProtocolChunk;
  relevanceScore: number;
}

/**
 * MockVectorRetriever
 * In-memory keyword and semantic similarity retriever mock interface for protocol documents.
 */
export class MockVectorRetriever {
  private chunks: ProtocolChunk[] = [];

  constructor(initialChunks?: ProtocolChunk[]) {
    if (initialChunks) {
      this.chunks = initialChunks;
    }
  }

  public addChunk(chunk: ProtocolChunk): void {
    this.chunks.push(chunk);
  }

  public search(query: string, topK = 3): VectorSearchResult[] {
    const qLower = query.toLowerCase().split(/\s+/);
    const results: VectorSearchResult[] = [];

    for (const chunk of this.chunks) {
      let score = 0;
      const textLower = chunk.text.toLowerCase();
      for (const token of qLower) {
        if (textLower.includes(token)) score += 0.25;
      }
      for (const tag of chunk.tags) {
        if (qLower.includes(tag.toLowerCase())) score += 0.5;
      }
      if (score > 0) {
        results.push({
          chunk,
          relevanceScore: Math.min(1.0, score)
        });
      }
    }

    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return results.slice(0, topK);
  }
}
