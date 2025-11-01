'use client';

import { useState, useRef, useEffect } from 'react';

export default function CloudChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to the Cat Room! 🐱 How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, 
        { id: messages.length + 1, text: inputValue, sender: 'user' },
        { id: messages.length + 2, text: "That's purr-fect! 🐾 Let me help you with that.", sender: 'bot' }
      ]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Cloud Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 group animate-bounce"
          style={{
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          <div className="relative">
            {/* Cloud shape */}
            <div className="bg-white rounded-full shadow-2xl p-6 flex items-center justify-center w-20 h-20 border-4 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:scale-110">
              <span className="text-4xl">☁️</span>
            </div>
            {/* Notification badge */}
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
              1
            </div>
          </div>
        </button>
      )}

      {/* Cloud Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 z-50 animate-slideUp">
          <div className="relative">
            {/* Cloud-shaped chat container */}
            <div className="bg-white rounded-3xl shadow-2xl border-4 border-blue-200 overflow-hidden w-96 h-[500px] flex flex-col">
              {/* Cloud header */}
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 flex items-center justify-between border-b-2 border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="text-3xl animate-pulse">☁️</div>
                  <div>
                    <h3 className="font-bold text-gray-800">Cloud Chat</h3>
                    <p className="text-xs text-gray-600">Cat Room Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-800 transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white to-blue-50/30">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-tr-sm'
                          : 'bg-white text-gray-800 border-2 border-blue-200 rounded-tl-sm shadow-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="p-4 border-t-2 border-blue-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border-2 border-blue-200 rounded-full focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  />
                  <button
                    onClick={handleSend}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
}


