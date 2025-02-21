// /src/components/ChatBox.tsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';

const ChatBox: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  // Animate the chat container when a new answer is received
  useEffect(() => {
    if (chatRef.current) {
      gsap.from(chatRef.current, { opacity: 0, duration: 1, y: -50 });
    }
  }, [answer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/chat', { question });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error fetching answer:', error);
    }
  };

  return (
    <div
      ref={chatRef}
      className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10 transition-all"
    >
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <input 
          type="text" 
          value={question} 
          onChange={(e) => setQuestion(e.target.value)} 
          placeholder="Ask your question..."
          className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </form>
      {answer && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="text-xl font-semibold mb-2">Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
