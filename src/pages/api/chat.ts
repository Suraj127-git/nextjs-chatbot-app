// /src/pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getEmbedding, getAnswer } from '../../services/llmService';
import { searchKnowledgeBase, insertUserQA } from '../../services/qdrantService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Generate the embedding for the user question
    const queryEmbedding = await getEmbedding(question);

    // Retrieve context from the knowledge base via Qdrant
    const kbResults = await searchKnowledgeBase(queryEmbedding);
    const context = kbResults.map((r: any) => r.payload.content).join('\n');

    // Generate answer using LLM (Ollama)
    const answer = await getAnswer(question, context);

    // Save the user Q&A pair in Qdrant
    await insertUserQA(question, answer, queryEmbedding);

    return res.status(200).json({ answer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
