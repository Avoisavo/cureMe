'use client';

import { useState, ReactNode } from 'react';

interface ChatPanelWrapperProps {
  children: ReactNode;
}

export default function ChatPanelWrapper({ children }: ChatPanelWrapperProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      {/* Super Cute Cat-Themed Chat Panel */}
      <div style={{
        position: 'fixed',
        top: '80px',
        left: isPanelOpen ? '0' : '-650px',
        width: '650px',
        height: 'calc(100vh - 80px)',
        background: 'linear-gradient(145deg, #e9d5ff 0%, #ddd6fe 40%, #c4b5fd 100%)',
        border: 'none',
        borderRight: '3px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '0 30px 30px 0',
        boxShadow: `
          20px 0 40px rgba(139, 92, 246, 0.2),
          inset -5px 0 15px rgba(167, 139, 250, 0.1)
        `,
        transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 900,
        padding: '2rem',
        overflowY: 'auto'
      }}>
        {/* Cute Cat Header */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          padding: '1.5rem 2rem',
          borderRadius: '25px',
          marginBottom: '2rem',
          boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)',
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid rgba(167, 139, 250, 0.3)'
        }}>
          {/* Cute floating paw prints */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '20px',
            fontSize: '1.5rem',
            opacity: 0.4,
            animation: 'float 3s ease-in-out infinite'
          }}>🐾</div>
          
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '700', 
            margin: 0,
            color: '#fbbf24',
            letterSpacing: '0.5px',
            position: 'relative',
            zIndex: 1,
            textAlign: 'center'
          }}>
             Meow Chat 
          </h2>
          <p style={{
            margin: '0.5rem 0 0 0',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#e0e7ff',
            fontWeight: '500'
          }}>
            Purr-fect Conversations ✨
          </p>
        </div>

        {/* Cute Chat Input Area */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            position: 'relative',
            marginBottom: '1rem'
          }}>
            <textarea
              placeholder="Type your meow-ssage here... "
              style={{
                width: '100%',
                height: '120px',
                padding: '1rem 1.25rem',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '20px',
                fontSize: '1rem',
                resize: 'vertical',
                background: 'rgba(255, 255, 255, 0.8)',
                color: '#6366f1',
                fontWeight: '400',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#8b5cf6';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.3)';
                e.currentTarget.style.background = 'white';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.15)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
              }}
            />
          </div>
          
          {/* Super Cute Send Button */}
          <button style={{
            width: '100%',
            padding: '1.2rem 2rem',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            color: '#fbbf24',
            border: '2px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '700',
            letterSpacing: '0.5px',
            boxShadow: '0 6px 20px rgba(139, 92, 246, 0.5)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.6)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.5)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(1px)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}>
            Send Meow-ssage 
          </button>
        </div>

        {/* Adorable Floating Paw Print Decorations */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '20px',
          fontSize: '2rem',
          opacity: 0.2,
          pointerEvents: 'none',
          transform: 'rotate(-15deg)'
        }}>🐾</div>
        <div style={{
          position: 'absolute',
          bottom: '100px',
          right: '30px',
          fontSize: '1.8rem',
          opacity: 0.2,
          pointerEvents: 'none',
          transform: 'rotate(25deg)'
        }}>🐾</div>
        <div style={{
          position: 'absolute',
          top: '150px',
          right: '50px',
          fontSize: '1.5rem',
          opacity: 0.15,
          pointerEvents: 'none',
          transform: 'rotate(-20deg)'
        }}>🐾</div>
        <div style={{
          position: 'absolute',
          top: '250px',
          left: '40px',
          fontSize: '1.6rem',
          opacity: 0.15,
          pointerEvents: 'none',
          transform: 'rotate(10deg)'
        }}>🐾</div>

        {/* Cute cat face decorations */}
        <div style={{
          position: 'absolute',
          bottom: '200px',
          right: '20px',
          fontSize: '3rem',
          opacity: 0.1,
          pointerEvents: 'none'
        }}>😺</div>
        <div style={{
          position: 'absolute',
          top: '350px',
          left: '30px',
          fontSize: '2.5rem',
          opacity: 0.1,
          pointerEvents: 'none'
        }}>😸</div>
      </div>

      {/* Adorable Cat Toggle Button */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        style={{
          position: 'fixed',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
          color: '#fbbf24',
          border: '3px solid rgba(251, 191, 36, 0.6)',
          cursor: 'pointer',
          fontSize: '2rem',
          boxShadow: '0 6px 25px rgba(139, 92, 246, 0.6)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.15) rotate(10deg)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(139, 92, 246, 0.8)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1) rotate(0deg)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(139, 92, 246, 0.6)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)';
        }}
      >
        {isPanelOpen ? '✕' : '🐱'}
      </button>

      {/* Main Content with Smooth Animation */}
      <div style={{ 
        width: '100vw', 
        height: '100vh',
        transform: `${isPanelOpen ? 'translateX(325px) scale(0.95)' : 'translateX(0) scale(1)'}`,
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transformOrigin: 'center center'
      }}>
        {children}
      </div>
    </>
  );
}

