import FirecrawlApp from '@mendable/firecrawl-js';
import { getEmbedding } from './llmService';
import { insertKnowledgeData } from './qdrantService';

export async function scrapeAndIndex(url: string) {
  try {
    console.log('Step 1: Validating API key configuration');
    if (!process.env.FIRECRAWL_API_KEY) {
      throw new Error('FIRECRAWL_API_KEY is not configured');
    }

    console.log('Step 2: Initializing FirecrawlApp instance');
    const firecrawl = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY
    });
    
    console.log('Step 3: Starting web scraping process for URL:', url);
    const scrapeResponse = await firecrawl.scrapeUrl(url, {
      formats: ['markdown', 'html'],
      timeout: 30000  // Increased timeout for complex pages
    });

    console.log('Step 4: Validating scrape response');
    if (!scrapeResponse.success) {
      throw new Error(`Scraping failed: ${scrapeResponse.error}`);
    }

    console.log('Step 5: Processing scraped content');
    const content = scrapeResponse.data?.content;
    
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      throw new Error('Scraped content is empty or invalid');
    }

    // Clean up content before processing
    const cleanedContent = content
      .replace(/\[.*?\]\(.*?\)/g, '') // Remove markdown links
      .replace(/<[^>]+>/g, '')        // Remove HTML tags
      .substring(0, 10000);           // Truncate to first 10k characters

    console.log('Step 6: Generating embedding for scraped content');
    const embedding = await getEmbedding(cleanedContent);

    console.log('Step 7: Storing data in knowledge base');
    await insertKnowledgeData({ 
      url, 
      content: cleanedContent, 
      embedding 
    });

    console.log('Step 8: Scraping and indexing completed successfully');
    return { 
      url, 
      content: cleanedContent,
      metadata: scrapeResponse.data?.metadata 
    };
  } catch (error) {
    console.error('Scraping operation failed:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Scraping operation failed with unknown error');
  }
}