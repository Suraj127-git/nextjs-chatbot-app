// /src/components/KnowledgeBase.tsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrapeResult {
  url?: string;
  content: string;
  source: 'url' | 'file';
  fileName?: string;
  fileType?: string;
}

const KnowledgeBase: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [scrapeResult, setScrapeResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setScrapeResult(null);
    
    gsap.to(formRef.current, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    try {
      const formData = new FormData();
      if (url) {
        formData.append('url', url);
        formData.append('type', 'url');
      }
      if (file) {
        formData.append('file', file);
        formData.append('type', 'file');
        formData.append('fileName', file.name);
      }

      const response = await axios.post('/api/scrape/scrape', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setScrapeResult(response.data.result);
    } catch (error: any) {
      console.error('Error processing content:', error);
      setError(error.response?.data?.error || 'Failed to process content');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType.match(/(pdf|csv|image\/.*)/)) {
        setFile(selectedFile);
        setUrl(''); // Clear URL when file is selected
      } else {
        setError('Please upload a PDF, CSV, or image file');
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10"
    >
      <motion.h2 className="text-2xl font-bold mb-4">
        Knowledge Base Processor
      </motion.h2>
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Enter URL or upload a file
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setFile(null); // Clear file when URL is entered
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            placeholder="Enter website URL to scrape"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || !!file}
          />
          <div className="flex items-center space-x-2">
            <motion.input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.csv,image/*"
              className="hidden"
              disabled={loading || !!url}
            />
            <motion.button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              disabled={loading || !!url}
            >
              Choose File
            </motion.button>
            {file && (
              <span className="text-sm text-gray-600">
                Selected: {file.name}
              </span>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || (!url && !file)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
        >
          {loading ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Processing...
            </motion.span>
          ) : (
            'Process'
          )}
        </motion.button>
      </form>
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-red-100 text-red-700 rounded"
          >
            {error}
          </motion.div>
        )}
        
        {scrapeResult && (
          <motion.div
            key="result"
            ref={resultRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-4 bg-gray-100 rounded overflow-hidden"
          >
            <h3 className="text-xl font-semibold mb-2">Processed Data:</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {scrapeResult.content}
            </p>
            <div className="text-xs text-gray-500 mt-2">
              {scrapeResult.source === 'url' ? (
                <p>Source URL: {scrapeResult.url}</p>
              ) : (
                <p>Source File: {scrapeResult.fileName} ({scrapeResult.fileType})</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default KnowledgeBase;
