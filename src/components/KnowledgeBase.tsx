// /src/components/KnowledgeBase.tsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrapeResult {
  url: string;
  content: string;
}

const KnowledgeBase: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [scrapeResult, setScrapeResult] = useState<ScrapeResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Animate form on submit
    gsap.to(formRef.current, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    try {
      const response = await axios.post('/api/scrape', { url });
      setScrapeResult(response.data.result);
    } catch (error) {
      console.error('Error scraping URL:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrapeResult && resultRef.current) {
      gsap.from(resultRef.current, { 
        opacity: 0, 
        duration: 1, 
        y: 20,
        ease: "power2.out"
      });
    }
  }, [scrapeResult]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10"
    >
      <motion.h2 
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-4"
      >
        Knowledge Base Scraper
      </motion.h2>
      <form ref={formRef} onSubmit={handleScrape} className="flex flex-col space-y-4">
        <motion.input
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL to scrape"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          {loading ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              Scraping...
            </motion.span>
          ) : (
            'Scrape'
          )}
        </motion.button>
      </form>
      <AnimatePresence>
        {scrapeResult && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-4 bg-gray-100 rounded overflow-hidden"
          >
            <h3 className="text-xl font-semibold mb-2">Scraped Data:</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{scrapeResult.content}</p>
            <p className="text-xs text-gray-500 mt-2">Source: {scrapeResult.url}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default KnowledgeBase;
