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
  try {
    // Check if collection exists
    const collections = await client.getCollections();
    const collectionExists = collections.collections.some(
      col => col.name === USER_QA_COLLECTION
    );

    // Create collection if it doesn't exist
    if (!collectionExists) {
      await client.createCollection(USER_QA_COLLECTION, {
        vectors: {
          size: embedding.length,
          distance: "Cosine"
        }
      });
    }

    // Insert the Q&A pair
    const payload = { question, answer };
    await client.upsert(USER_QA_COLLECTION, {
      points: [{
        id: crypto.randomUUID(),
        vector: embedding,
        payload,
      }],
    });
  } catch (error) {
    console.error('Error inserting Q&A:', error);
    throw error;
  }
}

export async function searchKnowledgeBase(queryEmbedding: number[], top: number = 5) {
  try {
    // Check if collection exists
    const collections = await client.getCollections();
    const collectionExists = collections.collections.some(
      col => col.name === KNOWLEDGE_BASE_COLLECTION
    );

    if (!collectionExists) {
      return [];
    }

    const result = await client.search(KNOWLEDGE_BASE_COLLECTION, {
      vector: queryEmbedding,
      limit: top,
      with_payload: true,
    });

    return result || [];
  } catch (error) {
    console.error('Error searching knowledge base:', error);
    return [];
  }
}

export async function insertKnowledgeData(data: { url: string; content: string; embedding: number[] }) {
  try {
    // Check if collection exists
    const collections = await client.getCollections();
    const collectionExists = collections.collections.some(
      col => col.name === KNOWLEDGE_BASE_COLLECTION
    );

    // Create collection if it doesn't exist
    if (!collectionExists) {
      await client.createCollection(KNOWLEDGE_BASE_COLLECTION, {
        vectors: {
          size: data.embedding.length,
          distance: "Cosine"
        }
      });
    }

    // Insert the knowledge data
    const payload = { url: data.url, content: data.content };
    await client.upsert(KNOWLEDGE_BASE_COLLECTION, {
      points: [{
        id: crypto.randomUUID(),
        vector: data.embedding,
        payload,
      }],
    });
  } catch (error) {
    console.error('Error inserting knowledge data:', error);
    throw error;
  }
}
