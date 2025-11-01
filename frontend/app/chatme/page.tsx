'use client';

import { useState } from 'react';
import CloudChat, { Message } from '@/components/cloud-chat';
import Header from '@/components/header';

export default function ChatMePage() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <>
      <style jsx global>{`
        /* Low Poly Arcade Background Pattern */
        .chatme-page {
          position: relative;
          overflow: hidden;
        }

        .chatme-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(120deg, rgba(147, 197, 253, 0.1) 0%, transparent 50%),
            linear-gradient(240deg, rgba(196, 181, 253, 0.1) 0%, transparent 50%),
            linear-gradient(60deg, rgba(251, 191, 36, 0.05) 0%, transparent 50%);
          background-size: 200% 200%;
          animation: polyGradient 20s ease infinite;
          pointer-events: none;
          z-index: 0;
        }

        /* Arcade Grid Pattern */
        .chatme-page::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(0deg, transparent 24%, rgba(99, 102, 241, 0.03) 25%, rgba(99, 102, 241, 0.03) 26%, transparent 27%, transparent 74%, rgba(99, 102, 241, 0.03) 75%, rgba(99, 102, 241, 0.03) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(99, 102, 241, 0.03) 25%, rgba(99, 102, 241, 0.03) 26%, transparent 27%, transparent 74%, rgba(99, 102, 241, 0.03) 75%, rgba(99, 102, 241, 0.03) 76%, transparent 77%, transparent);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes polyGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        /* Low Poly Geometric Shapes */
        .poly-shape {
          position: absolute;
          opacity: 0.15;
          pointer-events: none;
          border: 3px solid;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
        }

        /* Avatar Styles - Geometric Arcade Shape */
        .chatme-page .avatar {
          width: 44px;
          height: 44px;
          clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 3px solid;
        }

        .chatme-page .avatar:hover {
          transform: scale(1.15) rotate(5deg);
          filter: brightness(1.1);
        }

        /* AI Avatar - Geometric with Image */
        .chatme-page .avatar-assistant {
          background: linear-gradient(135deg, #f9a8d4 0%, #ec4899 50%, #db2777 100%);
          color: white;
          border-color: #db2777;
          box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);
        }

        .chatme-page .avatar-assistant img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* User Avatar - Geometric with Image */
        .chatme-page .avatar-user {
          background: linear-gradient(135deg, #a5b4fc 0%, #818cf8 50%, #6366f1 100%);
          color: white;
          border-color: #6366f1;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
        }

        .chatme-page .avatar-user img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Message Container */
        .chatme-page .message-assistant,
        .chatme-page .message-user {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .chatme-page .message-assistant {
          justify-content: flex-start;
        }

        .chatme-page .message-user {
          justify-content: flex-end;
        }

        /* Low Poly Arcade Message Bubbles */
        .chatme-page .message-content {
          max-width: 75%;
          padding: 16px 20px;
          clip-path: polygon(
            0% 5%, 
            5% 0%, 
            calc(100% - 15px) 0%, 
            100% 15px, 
            100% calc(100% - 5%), 
            calc(100% - 5%) 100%,
            5% 100%,
            0% calc(100% - 5%)
          );
          line-height: 1.6;
          font-size: 14px;
          white-space: pre-wrap;
          word-wrap: break-word;
          position: relative;
          transition: all 0.3s ease;
          border: 3px solid;
        }

        .chatme-page .message-user .message-content {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          clip-path: polygon(
            5% 0%,
            calc(100% - 5%) 0%, 
            100% 5%, 
            100% calc(100% - 15%), 
            calc(100% - 15px) 100%, 
            15px 100%, 
            0% calc(100% - 15px),
            0% 5%
          );
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35), 0 0 20px rgba(139, 92, 246, 0.2);
          border-color: #8b5cf6;
        }

        .chatme-page .message-assistant .message-content {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          color: #1e293b;
          clip-path: polygon(
            15px 0%,
            calc(100% - 5%) 0%, 
            100% 5%, 
            100% calc(100% - 5%), 
            calc(100% - 5%) 100%,
            5% 100%, 
            0% calc(100% - 15px),
            0% 15px
          );
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(148, 163, 184, 0.15);
          border-color: rgba(148, 163, 184, 0.4);
        }

        /* Chat Container Background */
        .chatme-page .messages-container {
          background: transparent;
          position: relative;
          z-index: 1;
        }

        /* Side by Side Response Selection */
        .chatme-page .response-selection-container {
          display: flex;
          gap: 20px;
          width: 100%;
          align-items: flex-start;
        }

        .chatme-page .response-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chatme-page .response-label-header {
          font-size: 11px;
          font-weight: 700;
          color: #6366f1;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-align: center;
          padding: 12px 18px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
          clip-path: polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px);
          border: 3px solid rgba(99, 102, 241, 0.5);
          font-family: var(--font-press-start), 'Courier New', monospace;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2), inset 0 -2px 8px rgba(99, 102, 241, 0.1);
          text-shadow: 1px 1px 2px rgba(99, 102, 241, 0.3);
        }

        .chatme-page .style-response-bubble-left,
        .chatme-page .style-response-bubble-right {
          margin-bottom: 0;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .chatme-page .style-response-bubble-left:hover,
        .chatme-page .style-response-bubble-right:hover {
          transform: scale(1.03) translateY(-2px);
        }

        .chatme-page .style-response-bubble-left:hover .message-content,
        .chatme-page .style-response-bubble-right:hover .message-content {
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4), 0 0 30px rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
          border-width: 4px;
          filter: brightness(1.05);
        }

        .chatme-page .style-response-bubble-left .message-content,
        .chatme-page .style-response-bubble-right .message-content {
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .chatme-page .response-selection-container {
            flex-direction: column;
          }
        }

        /* Low Poly Header */
        .low-poly-header {
          clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 20px), 0% 100%);
        }
      `}</style>

      <div className="chatme-page" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #faf5ff 50%, #fffbeb 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Low Poly Arcade Decorative Elements */}
        <div className="poly-shape" style={{
          top: '10%',
          right: '5%',
          width: '200px',
          height: '200px',
          clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
          background: 'linear-gradient(135deg, rgba(147, 197, 253, 0.25), rgba(196, 181, 253, 0.25))',
          borderColor: 'rgba(147, 197, 253, 0.5)',
          animation: 'float 6s ease-in-out infinite',
        }} />
        <div className="poly-shape" style={{
          bottom: '15%',
          left: '3%',
          width: '150px',
          height: '150px',
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(251, 146, 60, 0.2))',
          borderColor: 'rgba(251, 191, 36, 0.6)',
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '2s',
        }} />
        <div className="poly-shape" style={{
          top: '50%',
          right: '10%',
          width: '120px',
          height: '120px',
          clipPath: 'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.2))',
          borderColor: 'rgba(236, 72, 153, 0.6)',
          animation: 'float 7s ease-in-out infinite',
          animationDelay: '1s',
        }} />
        <div className="poly-shape" style={{
          top: '30%',
          left: '8%',
          width: '100px',
          height: '100px',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(167, 139, 250, 0.2))',
          borderColor: 'rgba(139, 92, 246, 0.6)',
          animation: 'float 9s ease-in-out infinite',
          animationDelay: '3s',
        }} />

        {/* Header Component */}
        <Header />

        {/* Chat Container */}
        <div style={{
          flex: 1,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 80px)',
          position: 'relative',
          zIndex: 1,
          padding: '2rem',
          marginTop: '80px',
        }}>
          <CloudChat onMessagesUpdate={setMessages} />
        </div>
      </div>
    </>
  );
}

