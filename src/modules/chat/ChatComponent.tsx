// /src/modules/chat/ChatComponent.tsx
import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from './chatService';
import { gsap } from 'gsap';

const ChatComponent: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await sendChatMessage(question);
      setAnswer(response);
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  // Animate container on answer update
  useEffect(() => {
    if (answer && chatContainerRef.current) {
      gsap.from(chatContainerRef.current, { opacity: 0, y: -20, duration: 0.5 });
    }
  }, [answer]);

  return (
    <div ref={chatContainerRef} className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8">
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          Ask
        </button>
      </form>
      {answer && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
