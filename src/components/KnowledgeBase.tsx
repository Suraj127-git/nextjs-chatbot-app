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
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) {
      gsap.to(loaderRef.current, {
        rotate: 360,
        duration: 1,
        repeat: -1,
        ease: "none"
      });
    } else {
      gsap.killTweensOf(loaderRef.current);
    }
  }, [loading]);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsSuccess(false);
    
    // Animate form on submit
    gsap.to(formRef.current, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    try {
      await axios.post('/api/scrape/scrape', { url });
      setIsSuccess(true);
    } catch (error) {
      console.error('Error scraping URL:', error);
    } finally {
      setLoading(false);
    }
  };

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
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors relative"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div 
                ref={loaderRef}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
              <span>Scraping...</span>
            </div>
          ) : (
            'Scrape'
          )}
        </motion.button>
      </form>
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-4 bg-green-100 rounded overflow-hidden"
          >
            <p className="text-green-700">Successfully scraped the URL: {url}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default KnowledgeBase;
