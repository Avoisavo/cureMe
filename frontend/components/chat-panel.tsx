'use client';

import { useState, ReactNode } from 'react';

interface ChatPanelWrapperProps {
  children: ReactNode;
}

export default function ChatPanelWrapper({ children }: ChatPanelWrapperProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      {/* Arcade-Style Left Panel Chatbox */}
      <div style={{
        position: 'fixed',
        top: '80px',
        left: isPanelOpen ? '0' : '-650px',
        width: '650px',
        height: 'calc(100vh - 80px)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 50%, #e8f0ff 100%)',
        border: '4px solid #a78bfa',
        borderLeft: 'none',
        borderRadius: '0 24px 24px 0',
        boxShadow: `
          0 0 30px rgba(167, 139, 250, 0.5),
          inset 0 0 60px rgba(167, 139, 250, 0.1),
          0 8px 32px rgba(0, 0, 0, 0.12)
        `,
        transition: 'left 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        zIndex: 900,
        padding: '2rem',
        overflowY: 'auto',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Arcade Header with Neon Effect */}
        <div style={{
          background: 'linear-gradient(135deg, #a78bfa 0%, #7dd3fc 100%)',
          padding: '1.5rem',
          borderRadius: '16px',
          marginBottom: '1.5rem',
          border: '3px solid white',
          boxShadow: `
            0 0 20px rgba(167, 139, 250, 0.6),
            inset 0 0 20px rgba(255, 255, 255, 0.2)
          `,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Scan line effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            pointerEvents: 'none'
          }} />
          
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '900', 
            margin: 0,
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            textShadow: `
              0 0 10px rgba(255, 255, 255, 0.8),
              0 0 20px rgba(167, 139, 250, 0.8),
              2px 2px 4px rgba(0, 0, 0, 0.3)
            `,
            position: 'relative',
            zIndex: 1
          }}>
            🎮 CHAT ARCADE
          </h2>
        </div>

        {/* Arcade-style Message Box */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '16px',
          marginBottom: '1.5rem',
          border: '3px solid #7dd3fc',
          boxShadow: `
            0 0 15px rgba(125, 211, 252, 0.4),
            inset 0 0 20px rgba(125, 211, 252, 0.05)
          `,
          position: 'relative'
        }}>
          {/* Corner decorations */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            width: '16px',
            height: '16px',
            border: '3px solid #a78bfa',
            borderRight: 'none',
            borderBottom: 'none',
            borderRadius: '4px 0 0 0'
          }} />
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '16px',
            height: '16px',
            border: '3px solid #a78bfa',
            borderLeft: 'none',
            borderBottom: 'none',
            borderRadius: '0 4px 0 0'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            width: '16px',
            height: '16px',
            border: '3px solid #a78bfa',
            borderRight: 'none',
            borderTop: 'none',
            borderRadius: '0 0 0 4px'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            width: '16px',
            height: '16px',
            border: '3px solid #a78bfa',
            borderLeft: 'none',
            borderTop: 'none',
            borderRadius: '0 0 4px 0'
          }} />
          
          <p style={{ 
            color: '#6366f1', 
            fontSize: '1.1rem',
            fontWeight: '600',
            margin: 0,
            textShadow: '1px 1px 2px rgba(167, 139, 250, 0.2)'
          }}>
            🌟 Welcome to the Cat Room Arcade! Ready to play?
          </p>
        </div>
        
        {/* Arcade-Style Chat Input Area */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            position: 'relative',
            marginBottom: '1rem'
          }}>
            <textarea
              placeholder="TYPE YOUR MESSAGE..."
              style={{
                width: '100%',
                height: '120px',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                border: '3px solid #a78bfa',
                fontSize: '1rem',
                resize: 'vertical',
                background: 'white',
                color: '#4c1d95',
                fontWeight: '500',
                boxShadow: `
                  0 0 20px rgba(167, 139, 250, 0.3),
                  inset 0 2px 8px rgba(167, 139, 250, 0.1)
                `,
                outline: 'none',
                transition: 'all 0.3s ease',
                fontFamily: 'monospace'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#7dd3fc';
                e.currentTarget.style.boxShadow = `
                  0 0 30px rgba(125, 211, 252, 0.5),
                  inset 0 2px 8px rgba(125, 211, 252, 0.15)
                `;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#a78bfa';
                e.currentTarget.style.boxShadow = `
                  0 0 20px rgba(167, 139, 250, 0.3),
                  inset 0 2px 8px rgba(167, 139, 250, 0.1)
                `;
              }}
            />
          </div>
          
          {/* Arcade Button */}
          <button style={{
            width: '100%',
            padding: '1.25rem 2rem',
            background: 'linear-gradient(135deg, #a78bfa 0%, #7dd3fc 100%)',
            color: 'white',
            border: '3px solid white',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1.25rem',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            boxShadow: `
              0 0 25px rgba(167, 139, 250, 0.6),
              0 6px 20px rgba(0, 0, 0, 0.15),
              inset 0 0 20px rgba(255, 255, 255, 0.2)
            `,
            transition: 'all 0.2s ease',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = `
              0 0 35px rgba(125, 211, 252, 0.8),
              0 10px 30px rgba(0, 0, 0, 0.2),
              inset 0 0 25px rgba(255, 255, 255, 0.3)
            `;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = `
              0 0 25px rgba(167, 139, 250, 0.6),
              0 6px 20px rgba(0, 0, 0, 0.15),
              inset 0 0 20px rgba(255, 255, 255, 0.2)
            `;
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(2px) scale(0.98)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
          }}>
            ⚡ SEND MESSAGE ⚡
          </button>
        </div>

        {/* Decorative Grid Pattern */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          height: '60px',
          background: `
            repeating-linear-gradient(90deg, 
              transparent, 
              transparent 19px, 
              rgba(167, 139, 250, 0.1) 19px, 
              rgba(167, 139, 250, 0.1) 20px
            ),
            repeating-linear-gradient(0deg, 
              transparent, 
              transparent 19px, 
              rgba(167, 139, 250, 0.1) 19px, 
              rgba(167, 139, 250, 0.1) 20px
            )
          `,
          pointerEvents: 'none',
          opacity: 0.5,
          borderRadius: '8px'
        }} />
      </div>

      {/* Arcade-Style Toggle Button */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        style={{
          position: 'fixed',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '70px',
          height: '70px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #a78bfa 0%, #7dd3fc 100%)',
          color: 'white',
          border: '4px solid white',
          cursor: 'pointer',
          fontSize: '2rem',
          boxShadow: `
            0 0 30px rgba(167, 139, 250, 0.7),
            0 8px 24px rgba(0, 0, 0, 0.2),
            inset 0 0 20px rgba(255, 255, 255, 0.2)
          `,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.15) rotate(5deg)';
          e.currentTarget.style.boxShadow = `
            0 0 40px rgba(125, 211, 252, 0.9),
            0 12px 32px rgba(0, 0, 0, 0.25),
            inset 0 0 25px rgba(255, 255, 255, 0.3)
          `;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1) rotate(0deg)';
          e.currentTarget.style.boxShadow = `
            0 0 30px rgba(167, 139, 250, 0.7),
            0 8px 24px rgba(0, 0, 0, 0.2),
            inset 0 0 20px rgba(255, 255, 255, 0.2)
          `;
        }}
      >
        {isPanelOpen ? '✕' : '🎮'}
      </button>

      {/* Main Content with Animation */}
      <div style={{ 
        width: '100vw', 
        height: '100vh',
        transform: `translateZ(50px) scale(1.1) ${isPanelOpen ? 'translateX(325px)' : 'translateX(0)'}`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }}>
        {children}
      </div>
    </>
  );
}

