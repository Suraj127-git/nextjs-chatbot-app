import type { NextApiRequest, NextApiResponse } from 'next';
import { getEmbedding, getAnswer } from '../../../services/llmService';
import { searchKnowledgeBase, insertUserQA } from '../../../services/qdrantService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Starting API request handler');

    if (req.method !== 'POST') {
      console.log('Invalid method:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { question } = req.body;
    console.log('Received question:', question);
    
    if (!question) {
      console.log('Error: Question is missing');
      return res.status(400).json({ error: 'Question is required' });
    }
    
    // Generate the embedding for the question
    console.log('Generating embedding for question');
    const queryEmbedding = await getEmbedding(question);
    console.log('Embedding generated successfully:  ', JSON.stringify(queryEmbedding));

    // Search for relevant context using the embedding
    console.log('Searching knowledge base');
    const kbResults = await searchKnowledgeBase(queryEmbedding, question);
    console.log('Knowledge base search completed', JSON.stringify(kbResults));

    let answer;
    if (kbResults.length > 0) {
      const context = kbResults.map((doc: any) => doc.payload?.content).join('\n');
      console.log('Found context from knowledge base', JSON.stringify(context));
      console.log('Generating answer with context');
      answer = await getAnswer(question, context);
    } else {
      console.log('No knowledge base results found, generating answer without context');
      answer = await getAnswer(question);
    }
    console.log('Answer generated successfully', JSON.stringify(answer));
    
    // Optionally, store the Q&A pair in Qdrant
    console.log('Storing Q&A pair in database');
    await insertUserQA(question, answer, queryEmbedding);
    console.log('Q&A pair stored successfully');

    return res.status(200).json({ answer });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'Failed to process your question. Please try again.' 
    });
  }
}
