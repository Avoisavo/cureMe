'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  role: 'user' | 'assistant' | 'pending-selection';
  content?: string;
  originalResponse?: string;
  rationalResponse?: string;
  emotionalResponse?: string;
  timestamp: string;
}

interface CloudChatProps {
  onClose?: () => void;
}

export default function CloudChat({ onClose }: CloudChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preferredStyle, setPreferredStyle] = useState<'rational' | 'emotional' | null>(null);
  const [pendingStyleSelection, setPendingStyleSelection] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const isFirstMessage = messages.length === 0;
      const requestBody: any = {
        prompt: userMessage.content,
      };

      if (isFirstMessage) {
        requestBody.isFirstMessage = true;
      } else if (preferredStyle) {
        requestBody.preferredStyle = preferredStyle;
        requestBody.conversationHistory = messages
          .filter(msg => msg.role !== 'pending-selection')
          .map(msg => ({
            role: msg.role,
            content: msg.content,
          }));
      } else {
        requestBody.model = 'all';
      }

      const response = await fetch('http://localhost:3002/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || `Server error: ${response.status}` };
        }
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.success) {
        if (data.isFirstMessage) {
          const styleSelectionMessage: Message = {
            id: Date.now() + 1,
            role: 'pending-selection',
            originalResponse: data.originalResponse,
            rationalResponse: data.rationalResponse,
            emotionalResponse: data.emotionalResponse,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, styleSelectionMessage]);
          setPendingStyleSelection(true);
        } else {
          const assistantMessage: Message = {
            id: Date.now() + 1,
            role: 'assistant',
            content: data.response || 'No response received',
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Error: ${error.message || 'Something went wrong. Please try again.'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectStyle = (style: 'rational' | 'emotional') => {
    setPreferredStyle(style);
    setPendingStyleSelection(false);
    
    setMessages((prev) => {
      const updated = [...prev];
      const pendingIndex = updated.findIndex(msg => msg.role === 'pending-selection');
      if (pendingIndex !== -1) {
        const selectedResponse = style === 'rational' 
          ? updated[pendingIndex].rationalResponse 
          : updated[pendingIndex].emotionalResponse;
        
        updated[pendingIndex] = {
          id: updated[pendingIndex].id,
          role: 'assistant',
          content: selectedResponse || 'No response available',
          timestamp: updated[pendingIndex].timestamp,
        };
      }
      return updated;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateSummary = async (conversationMessages: Message[]): Promise<string> => {
    try {
      const conversationText = conversationMessages
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n\n');

      const summaryPrompt = `Please provide a comprehensive conclusion summarizing the user's situation, concerns, feelings, and the key points discussed in the conversation. Focus on understanding the user's complete situation - what they're experiencing, their challenges, the insights gained, and the overall context. Write this as a conclusive statement that wraps up the entire conversation. Keep it concise (around 100-150 words). 

CRITICAL REQUIREMENTS:
- Write ONLY statements and conclusions
- DO NOT include any questions (no question marks)
- DO NOT ask "what", "which", "how", "why", "when", "where", "who", "would", "could", "should", "can", "will", "do", "did", "does", "are", "is", "was", "were" in question form
- End with a conclusive statement, NOT a question
- Focus on concluding the user's situation

Conversation:
${conversationText}

Conclusive Summary (statements only, no questions):`;

      const response = await fetch('http://localhost:3002/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: summaryPrompt,
          model: 'all',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        let summary = data.response || data.humanizedResponse || 'Unable to generate summary';
        
        // Remove any questions
        summary = summary.replace(/[^.!]*\?[^.!]*/g, '').trim();
        summary = summary.replace(/\s+(what|which|how|why|when|where|who|would|could|should|can|will|do|did|does|are|is|was|were)\s+[^.!?]*\?/gi, '').trim();
        summary = summary.replace(/\?/g, '.').trim();
        summary = summary.replace(/\s+/g, ' ').trim();
        
        return summary;
      } else {
        throw new Error(data.error || 'Failed to generate summary');
      }
    } catch (error: any) {
      console.error('Error generating summary:', error);
      return `Summary generation failed: ${error.message}`;
    }
  };

  const endChat = async () => {
    if (messages.length === 0) {
      return;
    }

    const conversationToSummarize = [...messages];
    setMessages([]);
    setInput('');
    setIsLoading(true);
    
    try {
      const conversationSummary = await generateSummary(conversationToSummarize);
      
      const now = new Date();
      const dateTime = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      const summaryMessage: Message = {
        id: Date.now(),
        role: 'assistant',
        content: `📋 **Conversation Summary**\n📅 ${dateTime}\n\n${conversationSummary}`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages([summaryMessage]);
      setIsLoading(false);
      
      // Save chat history
      try {
        await fetch('http://localhost:3002/api/save-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: conversationToSummarize,
            summary: conversationSummary,
            dateTime: now.toISOString(),
          }),
        });
        console.log('Chat history saved successfully');
      } catch (saveError) {
        console.error('Error saving chat history:', saveError);
      }
      
      setTimeout(() => scrollToBottom(), 50);
      setTimeout(() => scrollToBottom(), 200);
      setTimeout(() => scrollToBottom(), 500);
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage: Message = {
        id: Date.now(),
        role: 'assistant',
        content: `Error generating summary: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
      setMessages([errorMessage]);
    }
  };

  const renderMessage = (message: Message) => {
    if (message.role === 'pending-selection') {
      return (
        <div key={message.id} className="message-assistant">
          <div className="avatar avatar-assistant">AI</div>
          <div style={{ maxWidth: '85%', width: '100%' }}>
            {message.originalResponse && (
              <div style={{ marginBottom: '24px' }}>
                <div className="message-content" style={{ whiteSpace: 'pre-wrap', marginBottom: '16px' }}>
                  {message.originalResponse.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
                </div>
              </div>
            )}
            
            <div style={{ marginBottom: '12px', color: '#565869', fontSize: '13px', fontWeight: '500' }}>
              Choose your preferred talking style:
            </div>
            <div className="style-selection-container">
              <div className="style-response-card">
                <div className="style-badge rational">🧠 Rational</div>
                <div className="style-header">
                  <span>Response 1</span>
                </div>
                <div className="style-content">
                  {message.rationalResponse}
                </div>
                <button 
                  className="select-style-button"
                  onClick={() => selectStyle('rational')}
                >
                  Choose This Style
                </button>
              </div>
              <div className="style-response-card">
                <div className="style-badge emotional">❤️ Emotional</div>
                <div className="style-header">
                  <span>Response 2</span>
                </div>
                <div className="style-content">
                  {message.emotionalResponse}
                </div>
                <button 
                  className="select-style-button"
                  onClick={() => selectStyle('emotional')}
                >
                  Choose This Style
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div key={message.id} className={`message-${message.role}`}>
        {message.role === 'assistant' && (
          <div className="avatar avatar-assistant">AI</div>
        )}
        <div className="message-content" style={{ whiteSpace: 'pre-wrap' }}>
          {message.content && message.content.split('**').map((part, i) => 
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
          )}
        </div>
        {message.role === 'user' && (
          <div className="avatar avatar-user">U</div>
        )}
      </div>
    );
  };

  return (
    <>
      <style jsx>{`
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
          margin-bottom: 16px;
          max-height: calc(100vh - 400px);
        }

        .empty-state {
          text-align: center;
          margin-top: 40px;
          color: #565869;
        }

        .empty-state-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h2 {
          font-size: 20px;
          font-weight: 600;
          color: #202123;
          margin-bottom: 8px;
        }

        .empty-state p {
          font-size: 14px;
          color: #565869;
        }

        .message-user, .message-assistant {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .message-user {
          justify-content: flex-end;
        }

        .message-assistant {
          justify-content: flex-start;
        }

        .avatar {
          width: 28px;
          height: 28px;
          border-radius: 2px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 11px;
        }

        .avatar-user {
          background: #19c37d;
          color: white;
        }

        .avatar-assistant {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .message-content {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 14px;
          line-height: 1.6;
          font-size: 13px;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .message-user .message-content {
          background: #19c37d;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-assistant .message-content {
          background: white;
          color: #353740;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .style-selection-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin: 12px 0;
        }

        .style-response-card {
          border: 2px solid #e5e5e6;
          border-radius: 10px;
          padding: 14px;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }

        .style-response-card:hover {
          border-color: #10a37f;
          box-shadow: 0 4px 12px rgba(16, 163, 127, 0.15);
        }

        .style-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
          font-weight: 600;
          font-size: 14px;
          color: #202123;
        }

        .style-content {
          color: #353740;
          line-height: 1.5;
          font-size: 12px;
          white-space: pre-wrap;
          margin-bottom: 10px;
        }

        .select-style-button {
          width: 100%;
          padding: 8px;
          background: #10a37f;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .select-style-button:hover {
          background: #0d8f6e;
        }

        .style-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 3px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .style-badge.rational {
          background: #e3f2fd;
          color: #1976d2;
        }

        .style-badge.emotional {
          background: #fce4ec;
          color: #c2185b;
        }

        .loading-dots {
          display: flex;
          gap: 4px;
          padding: 8px 0;
        }

        .loading-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #8e8ea0;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .loading-dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .loading-dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .style-selection-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="messages-container">
        {messages.length === 0 && !isLoading && (
          <div className="empty-state">
            <div className="empty-state-icon">🐱</div>
            <h2>Meow! How can I help?</h2>
            <p>Tell me what's on your mind...</p>
          </div>
        )}

        {messages.map(renderMessage)}

        {isLoading && (
          <div className="message-assistant">
            <div className="avatar avatar-assistant">AI</div>
            <div className="message-content">
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
              <p style={{ marginTop: '8px', fontSize: '12px', color: '#565869' }}>
                Good things take a little time, almost there 🌼
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length > 0 && (
        <button
          onClick={endChat}
          style={{
            width: '100%',
            padding: '10px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '12px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ef4444';
          }}
        >
          End Chat & Get Summary
        </button>
      )}

      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your meow-ssage here... 🐾"
          disabled={isLoading || pendingStyleSelection}
          style={{
            width: '100%',
            minHeight: '80px',
            maxHeight: '150px',
            padding: '12px 14px',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            fontSize: '14px',
            resize: 'none',
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#6366f1',
            fontWeight: '400',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
            outline: 'none',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <button
        onClick={sendMessage}
        disabled={!input.trim() || isLoading || pendingStyleSelection}
        style={{
          width: '100%',
          padding: '14px',
          background: input.trim() && !isLoading && !pendingStyleSelection 
            ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' 
            : '#d1d5db',
          color: '#fbbf24',
          border: '2px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '20px',
          cursor: input.trim() && !isLoading && !pendingStyleSelection ? 'pointer' : 'not-allowed',
          fontSize: '15px',
          fontWeight: '700',
          letterSpacing: '0.5px',
          boxShadow: '0 6px 20px rgba(139, 92, 246, 0.5)',
          transition: 'all 0.3s ease',
        }}
      >
        {isLoading ? 'Sending...' : 'Send Meow-ssage 🐾'}
      </button>
    </>
  );
}
