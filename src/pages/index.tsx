// /src/pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ChatBox from '../components/ChatBox';
import { motion } from 'framer-motion';

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>RAG Chat App</title>
        <meta name="description" content="RAG system using Langchain, Ollama, Qdrant and Firecrawl" />
      </Head>
      <main className="container mx-auto py-10">
        <ChatBox />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          onClick={() => router.push('/knowledge-base')}
        >
          Knowledge Base
        </motion.button>
      </main>
    </div>
  );
};

export default Home;
