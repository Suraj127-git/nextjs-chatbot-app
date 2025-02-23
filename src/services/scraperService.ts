import FirecrawlApp from '@mendable/firecrawl-js';
import { getEmbedding } from './llmService';
import { insertKnowledgeData } from './qdrantService';

interface ScrapeResponse {
  success: boolean;
  error?: string;
  markdown?: string;
  html?: string;
  data?: {
    content: string;
    metadata?: any;
    html?: string;
  };
}


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
    const scrapeResponse: ScrapeResponse = await firecrawl.scrapeUrl(url, {
      formats: ['markdown','html'],
      timeout: 60000,
      waitFor: 0,
    });

    console.log('Step 4: Validating scrape response', JSON.stringify(scrapeResponse));
    if (!scrapeResponse.success) {
      throw new Error(`Scraping failed: ${scrapeResponse.error}`);
    }

    console.log('Step 5: Processing scraped content');
    // Try to extract content from different sources
    const rawContent = scrapeResponse.markdown || scrapeResponse.html || scrapeResponse.data?.content || scrapeResponse.data?.html || '';

    
    if (!rawContent) {
      throw new Error('No content received from scraper');
    }

    // Enhanced content cleaning
    const cleanedContent = rawContent
      .replace(/<head>[\s\S]*?<\/head>/gi, '') // Remove head section
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/&[a-z]+;/gi, ' ') // Remove HTML entities
      .trim()
      .substring(0, 10000);

    if (cleanedContent.length < 50) { // Minimum content length check
      throw new Error('Insufficient content after cleaning');
    }

    console.log('Cleaned content length:', cleanedContent.length);
    console.log('Sample content:', cleanedContent.substring(0, 200));

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
      metadata: {
        originalLength: rawContent.length,
        cleanedLength: cleanedContent.length,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Scraping operation failed:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Scraping operation failed with unknown error');
  }
}