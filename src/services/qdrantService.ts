// /src/services/qdrantService.ts
import { QdrantClient } from '@qdrant/js-client-rest';
import { 
  QDRANT_URL, 
  QDRANT_API_KEY, 
  USER_QA_COLLECTION, 
  KNOWLEDGE_BASE_COLLECTION 
} from '../lib/config';

const client = new QdrantClient({ url: QDRANT_URL, apiKey: QDRANT_API_KEY });

export async function insertUserQA(question: string, answer: string, embedding: number[]) {
  const payload = { question, answer };
  await client.upsert(USER_QA_COLLECTION, {
    points: [{
      id: crypto.randomUUID(),
      vector: embedding,
      payload,
    }],
  });
}

export async function searchKnowledgeBase(queryEmbedding: number[], top: number = 5) {
  const result = await client.search(KNOWLEDGE_BASE_COLLECTION, {
    vector: queryEmbedding,
    limit: top,
    with_payload: true,
  });
  return result;
}

export async function insertKnowledgeData(data: { url: string; content: string; embedding: number[] }) {
  const payload = { url: data.url, content: data.content };
  await client.upsert(KNOWLEDGE_BASE_COLLECTION, {
    points: [{
      id: crypto.randomUUID(),
      vector: data.embedding,
      payload,
    }],
  });
}
