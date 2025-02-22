// /src/pages/api/scrape.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { scrapeAndIndex } from '../../../services/scraperService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    const result = await scrapeAndIndex(url);
    return res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
