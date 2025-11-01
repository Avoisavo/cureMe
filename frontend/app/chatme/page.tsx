'use client';

import { useState } from 'react';
import CloudChat, { Message } from '@/components/cloud-chat';

export default function ChatMePage() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <>
      <style jsx global>{`
        /* Avatar Styles - Person Icons */
        .chatme-page .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0;
          position: relative;
          overflow: hidden;
        }

        /* AI Avatar - Red/Maroon Color */
        .chatme-page .avatar-assistant {
          background: linear-gradient(135deg, #c2185b 0%, #ad1457 100%);
          color: white;
        }

        .chatme-page .avatar-assistant::before {
          content: '👤';
          font-size: 20px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          line-height: 1;
          filter: brightness(1.2);
        }

        /* User Avatar - Blue/Purple Color */
        .chatme-page .avatar-user {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .chatme-page .avatar-user::before {
          content: '👤';
          font-size: 20px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          line-height: 1;
          filter: brightness(1.2);
        }

        /* Message Container */
        .chatme-page .message-assistant,
        .chatme-page .message-user {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .chatme-page .message-assistant {
          justify-content: flex-start;
        }

        .chatme-page .message-user {
          justify-content: flex-end;
        }

        /* Message Content */
        .chatme-page .message-content {
          max-width: 75%;
          padding: 12px 16px;
          border-radius: 12px;
          line-height: 1.5;
          font-size: 14px;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .chatme-page .message-user .message-content {
          background: #4a5568;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .chatme-page .message-assistant .message-content {
          background: #f3f4f6;
          color: #1f2937;
          border-bottom-left-radius: 4px;
        }

        /* Chat Container Background */
        .chatme-page .messages-container {
          background: #ffffff;
        }

        /* Style Response Bubbles */
        .chatme-page .style-response-bubble {
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }

        .chatme-page .style-response-bubble:hover {
          transform: translateX(4px);
        }

        .chatme-page .style-response-bubble:hover .message-content {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 2px solid #10a37f;
        }

        .chatme-page .style-response-bubble .message-content {
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .chatme-page .response-label {
          position: absolute;
          top: -20px;
          left: 0;
          font-size: 11px;
          font-weight: 600;
          color: #8e8ea0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>

      <div className="chatme-page" style={{
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header Section */}
        <div style={{
          width: '100%',
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            Chat with AI
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <span style={{ fontSize: '1.2rem' }}>✨</span>
          </h1>
          <p style={{
            fontSize: '0.95rem',
            color: '#6b7280',
            margin: 0,
            fontWeight: '400',
          }}>
            Ask me anything about the components
          </p>
        </div>

        {/* Chat Container */}
        <div style={{
          flex: 1,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 180px)',
        }}>
          <CloudChat onMessagesUpdate={setMessages} />
        </div>
      </div>
    </>
  );
}

