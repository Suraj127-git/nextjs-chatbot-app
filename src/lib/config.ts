// /src/lib/config.ts
export const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
export const QDRANT_API_KEY = process.env.QDRANT_API_KEY || '';
export const USER_QA_COLLECTION = 'user_qa';
export const KNOWLEDGE_BASE_COLLECTION = 'knowledge_base';

export const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2';
export const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'mistral';
