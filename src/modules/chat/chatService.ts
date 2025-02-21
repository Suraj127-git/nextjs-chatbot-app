// /src/modules/chat/chatService.ts
import axios from 'axios';

export async function sendChatMessage(question: string): Promise<string> {
  try {
    const response = await axios.post('/api/chat', { question });
    return response.data.answer;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error('Failed to send chat message.');
  }
}
