'use client';

import { useState, ReactNode } from 'react';

interface ChatPanelWrapperProps {
  children: ReactNode;
}

export default function ChatPanelWrapper({ children }: ChatPanelWrapperProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      {/* Left Panel Chatbox */}
      <div style={{
        position: 'fixed',
        top: '80px',
        left: isPanelOpen ? '0' : '-600px',
        width: '600px',
        height: 'calc(100vh - 80px)',
        backgroundColor: 'white',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
        transition: 'left 0.3s ease-in-out',
        zIndex: 900,
        padding: '1.5rem',
        overflowY: 'auto'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          color: '#1f2937'
        }}>
          💬 Chat Panel
        </h2>
        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            Welcome to the Cat Room! How can I help you today?
          </p>
        </div>
        
        {/* Chat input area */}
        <div style={{ marginTop: '1rem' }}>
          <textarea
            placeholder="Type your message..."
            style={{
              width: '100%',
              height: '100px',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '0.9rem',
              resize: 'vertical'
            }}
          />
          <button style={{
            marginTop: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            Send Message
          </button>
        </div>
      </div>

      {/* Toggle Button (Right Side) */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        style={{
          position: 'fixed',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#6366f1',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
        }}
      >
        {isPanelOpen ? '✕' : '💬'}
      </button>

      {/* Main Content with Animation */}
      <div style={{ 
        width: '100vw', 
        height: '100vh',
        transform: `translateZ(50px) scale(1.1) ${isPanelOpen ? 'translateX(300px)' : 'translateX(0)'}`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease-in-out'
      }}>
        {children}
      </div>
    </>
  );
}

