// /src/modules/knowledgeBase/kbService.ts
import axios from 'axios';

export async function scrapeUrl(url: string): Promise<{ url: string; content: string }> {
  try {
    const response = await axios.post('/api/scrape', { url });
    return response.data.result;
  } catch (error) {
    console.error('Error scraping URL:', error);
    throw new Error('Failed to scrape URL.');
  }
}
