// src/services/llmService.ts
import axios from 'axios';
import {
  OLLAMA_API_URL,
  OLLAMA_MODEL,
  OLLAMA_EMBEDDING_MODEL,
} from '../lib/config';

// Response type definitions
type OllamaEmbeddingResponse = {
  embedding: number[];
};

type OllamaGenerationResponse = {
  response: string;
};

/**
 * Generates text embeddings using Ollama's embedding model
 * @param text - Input text to generate embeddings for
 * @returns Promise containing the embedding vector
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await axios.post<OllamaEmbeddingResponse>(
      `${OLLAMA_API_URL}/api/embeddings`,
      {
        model: OLLAMA_EMBEDDING_MODEL,
        prompt: text,
        options: {
          embedding_only: true,
        },
      }
    );

    return response.data.embedding;
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw new Error('Failed to generate embeddings');
  }
}

/**
 * Generates an answer using Ollama with RAG context
 * @param question - User question to answer
 * @param context - Context for RAG-based answer generation
 * @returns Promise containing the generated answer
 */
export async function getAnswer(
  question: string,
  context?: string
): Promise<string> {
  const prompt = context 
    ? `[INST]You are a helpful AI assistant. Using the following context, answer the question. If the context doesn't help, say so.

Context: ${context}

Question: ${question}[/INST]`
    : `[INST]You are a helpful AI assistant. Please answer this question: ${question}[/INST]`;

  try {
    const response = await axios.post<OllamaGenerationResponse>(
      `${OLLAMA_API_URL}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40,
          num_predict: 256,
          stop: ['</s>', '[INST]'],
        },
      }
    );

    return response.data.response.trim();
  } catch (error) {
    console.error('Answer generation error:', error);
    throw new Error('Failed to generate answer');
  }
}