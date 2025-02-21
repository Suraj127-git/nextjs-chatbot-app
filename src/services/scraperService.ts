// /src/services/scraperService.ts
import { FireCrawlLoader } from "@langchain/community/document_loaders/web/firecrawl";
import { Document } from "@langchain/core/documents";
import { getEmbedding } from './llmService';
import { insertKnowledgeData } from './qdrantService';

export async function scrapeAndIndex(url: string) {
  try {
    // Initialize FireCrawlLoader with the given URL
    const loader = new FireCrawlLoader({
      url: url,
      apiKey: process.env.FIRECRAWL_API_KEY,
      mode: "scrape",
      params: {
        wait: 1000,
        timeout: 10000,
      },
    });

    // Load and process the content
    const docs = await loader.load();
    const content = docs.map((doc: Document) => doc.pageContent).join('\n');

    // Generate embedding and store in Qdrant
    const embedding = await getEmbedding(content);
    await insertKnowledgeData({ url, content, embedding });

    return { url, content };
  } catch (error) {
    console.error('Error in scrapeAndIndex:', error);
    throw error;
  }
}
