// /src/modules/knowledgeBase/KnowledgeComponent.tsx
import React, { useState, useRef, useEffect } from 'react';
import { scrapeUrl } from './kbService';
import { gsap } from 'gsap';

const KnowledgeComponent: React.FC = () => {
  const [url, setUrl] = useState('');
  const [scrapedData, setScrapedData] = useState<{ url: string; content: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await scrapeUrl(url);
      setScrapedData(result);
    } catch (error) {
      console.error('Error scraping URL:', error);
    }
  };

  // Animate the container when new data is loaded
  useEffect(() => {
    if (scrapedData && containerRef.current) {
      gsap.from(containerRef.current, { opacity: 0, y: 20, duration: 0.5 });
    }
  }, [scrapedData]);

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold mb-4">Knowledge Base Scraper</h2>
      <form onSubmit={handleScrape} className="flex flex-col space-y-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL to scrape"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
          Scrape
        </button>
      </form>
      {scrapedData && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="text-xl font-semibold mb-2">Scraped Content:</h3>
          <p className="whitespace-pre-wrap text-sm text-gray-700">{scrapedData.content}</p>
          <p className="mt-2 text-xs text-gray-500">Source: {scrapedData.url}</p>
        </div>
      )}
    </div>
  );
};

export default KnowledgeComponent;
