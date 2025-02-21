import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import KnowledgeBase from '../../components/KnowledgeBase';
import { motion } from 'framer-motion';

const KnowledgeBasePage: NextPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Knowledge Base - RAG Chat App</title>
        <meta name="description" content="Web scraping and knowledge base management for RAG system" />
      </Head>
      <main className="container mx-auto py-10 relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-0 left-0 mb-6 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2"
          onClick={() => router.push('/')}
        >
          <span>←</span> Back to Chat
        </motion.button>
        <KnowledgeBase />
      </main>
    </div>
  );
};

export default KnowledgeBasePage;