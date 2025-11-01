"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { getUserData, UserData } from "@/app/utils/userData/auth";

export interface Message {
  id: number;
  role: "user" | "assistant" | "pending-selection";
  content?: string;
  rationalResponse?: string;
  emotionalResponse?: string;
  timestamp: string;
}

interface CloudChatProps {
  onClose?: () => void;
  onMessagesUpdate?: (messages: Message[]) => void;
}

export default function CloudChat({
  onClose,
  onMessagesUpdate,
}: CloudChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preferredStyle, setPreferredStyle] = useState<
    "rational" | "emotional" | null
  >(null);
  const [pendingStyleSelection, setPendingStyleSelection] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const user = getUserData();
    setUserData(user);
  }, []);

  // Count user messages to determine AI avatar
  const getUserMessageCount = () => {
    return messages.filter((msg) => msg.role === "user").length;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  useEffect(() => {
    if (onMessagesUpdate) {
      onMessagesUpdate(messages);
    }
  }, [messages, onMessagesUpdate]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
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
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send all messages (conversation history) to the API
      const conversationMessages = [...messages, userMessage]
        .filter((msg) => msg.role !== "pending-selection")
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationMessages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = {
            error: errorText || `Server error: ${response.status}`,
          };
        }
        console.error("API Error:", response.status, errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success) {
        if (data.isFirstMessage) {
          const styleSelectionMessage: Message = {
            id: Date.now() + 1,
            role: "pending-selection",
            rationalResponse: data.rationalResponse,
            emotionalResponse: data.emotionalResponse,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, styleSelectionMessage]);
          setPendingStyleSelection(true);
        } else {
          const assistantMessage: Message = {
            id: Date.now() + 1,
            role: "assistant",
            content: data.response || "No response received",
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: `Error: ${
          error.message || "Something went wrong. Please try again."
        }`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectStyle = (style: "rational" | "emotional") => {
    setPreferredStyle(style);
    setPendingStyleSelection(false);

    setMessages((prev) => {
      const updated = [...prev];
      const pendingIndex = updated.findIndex(
        (msg) => msg.role === "pending-selection"
      );
      if (pendingIndex !== -1) {
        const selectedResponse =
          style === "rational"
            ? updated[pendingIndex].rationalResponse
            : updated[pendingIndex].emotionalResponse;

        updated[pendingIndex] = {
          id: updated[pendingIndex].id,
          role: "assistant",
          content: selectedResponse || "No response available",
          timestamp: updated[pendingIndex].timestamp,
        };
      }
      return updated;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateSummary = async (
    conversationMessages: Message[]
  ): Promise<string> => {
    try {
      // Send conversation to API for summary generation
      const messagesToSummarize = conversationMessages
        .filter((msg) => msg.role !== "pending-selection")
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesToSummarize,
          action: "generate_summary",
        }),
      });

      const data = await response.json();

      if (data.success) {
        return data.response || "Unable to generate summary";
      } else {
        throw new Error(data.error || "Failed to generate summary");
      }
    } catch (error: any) {
      console.error("Error generating summary:", error);
      return `Summary generation failed: ${error.message}`;
    }
  };

  const endChat = async () => {
    if (messages.length === 0) {
      return;
    }

    const conversationToSummarize = [...messages];
    setMessages([]);
    setInput("");
    setIsLoading(true);

    try {
      const conversationSummary = await generateSummary(
        conversationToSummarize
      );

      const now = new Date();
      const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
      const dateTime = now.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      const summaryMessage: Message = {
        id: Date.now(),
        role: "assistant",
        content: `📋 **Conversation Summary**\n📅 ${dateTime}\n\n${conversationSummary}\n\n✨ Your memory has been saved and will be available in your collection!`,
        timestamp: now.toISOString(),
      };

      setMessages([summaryMessage]);
      setIsLoading(false);

      // Save chat history, summary, and generate memory in parallel
      try {
        const savePromises = [];

        // 1. Save chat session
        savePromises.push(
          fetch("/api/chat-sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              messages: conversationToSummarize.filter(
                (m) => m.role !== "pending-selection"
              ),
              userId: userData?.email || "default",
            }),
          })
        );

        // 2. Save AI summary
        savePromises.push(
          fetch("/api/chat-summaries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              summary: conversationSummary,
              userId: userData?.email || "default",
            }),
          })
        );

        // 3. Generate and save memory
        savePromises.push(
          fetch("/api/memories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              date,
              datetime: now.toISOString(),
              timestamp: dateTime,
              aiSummary: conversationSummary,
              chatMessages: conversationToSummarize
                .filter((m) => m.role !== "pending-selection")
                .map((m) => ({
                  role: m.role,
                  content: m.content,
                  timestamp: m.timestamp,
                })),
              userId: userData?.email || "default",
              options: {
                tone: "reflective",
                panelCount: 4,
                contentSensitivity: "medium",
              },
            }),
          })
        );

        // Wait for all saves to complete
        const results = await Promise.all(savePromises);

        // Check if all saves were successful
        const allSuccess = await Promise.all(
          results.map(async (res) => {
            const data = await res.json();
            return data.success;
          })
        );

        if (allSuccess.every((s) => s)) {
          console.log(
            "✅ Chat session, summary, and memory saved successfully"
          );
        } else {
          console.warn("⚠️ Some saves may have failed");
        }
      } catch (saveError: any) {
        console.error("Error in save pipeline:", saveError);
        // Don't show error to user, just log it
      }

      setTimeout(() => scrollToBottom(), 50);
      setTimeout(() => scrollToBottom(), 200);
      setTimeout(() => scrollToBottom(), 500);
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage: Message = {
        id: Date.now(),
        role: "assistant",
        content: `Error generating summary: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
      setMessages([errorMessage]);
    }
  };

  const renderMessage = (message: Message) => {
    if (message.role === "pending-selection") {
      return (
        <div key={message.id} style={{ width: "100%", marginBottom: "20px" }}>
          <div
            style={{
              color: "#565869",
              fontSize: "13px",
              fontWeight: "600",
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            Choose a response:
          </div>

          {/* Side by Side Response Container */}
          <div className="response-selection-container">
            {/* Response 1 - Left Side */}
            <div className="response-column">
              <div className="response-label-header">Response 1</div>
              <div
                className="message-assistant style-response-bubble-left"
                onClick={() => selectStyle("rational")}
              >
                <div className="avatar avatar-assistant">
                  <Image
                    src={
                      getUserMessageCount() >= 2 ? "/sadcat.gif" : "/beluga.jpg"
                    }
                    alt="AI Assistant"
                    width={40}
                    height={40}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  className="message-content"
                  style={{ whiteSpace: "pre-wrap", cursor: "pointer" }}
                >
                  {message.rationalResponse &&
                    message.rationalResponse
                      .split("**")
                      .map((part, i) =>
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                </div>
              </div>
            </div>

            {/* Response 2 - Right Side */}
            <div className="response-column">
              <div className="response-label-header">Response 2</div>
              <div
                className="message-assistant style-response-bubble-right"
                onClick={() => selectStyle("emotional")}
              >
                <div className="avatar avatar-assistant">
                  <Image
                    src={
                      getUserMessageCount() >= 2 ? "/sadcat.gif" : "/beluga.jpg"
                    }
                    alt="AI Assistant"
                    width={40}
                    height={40}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  className="message-content"
                  style={{ whiteSpace: "pre-wrap", cursor: "pointer" }}
                >
                  {message.emotionalResponse &&
                    message.emotionalResponse
                      .split("**")
                      .map((part, i) =>
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={message.id} className={`message-${message.role}`}>
        {message.role === "assistant" && (
          <div className="avatar avatar-assistant">
            <Image
              src={getUserMessageCount() >= 2 ? "/sadcat.gif" : "/beluga.jpg"}
              alt="AI Assistant"
              width={40}
              height={40}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}
        <div className="message-content" style={{ whiteSpace: "pre-wrap" }}>
          {message.content &&
            message.content
              .split("**")
              .map((part, i) =>
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
        </div>
        {message.role === "user" && (
          <div className="avatar avatar-user">
            {userData?.picture ? (
              <Image
                src={userData.picture}
                alt={userData.name || "User"}
                width={40}
                height={40}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              "U"
            )}
          </div>
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

        .message-user,
        .message-assistant {
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

        /* Side by Side Response Selection */
        .response-selection-container {
          display: flex;
          gap: 20px;
          width: 100%;
          align-items: flex-start;
        }

        .response-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .response-label-header {
          font-size: 13px;
          font-weight: 700;
          color: #6366f1;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-align: center;
          padding: 10px 16px;
          background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.1) 0%,
            rgba(139, 92, 246, 0.1) 100%
          );
          border-radius: 12px;
          border: 2px solid rgba(99, 102, 241, 0.3);
          font-family: "Courier New", monospace;
        }

        .style-response-bubble-left,
        .style-response-bubble-right {
          margin-bottom: 0;
          transition: all 0.3s ease;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .style-response-bubble-left:hover,
        .style-response-bubble-right:hover {
          transform: scale(1.02);
        }

        .style-response-bubble-left:hover .message-content,
        .style-response-bubble-right:hover .message-content {
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
          border-color: #818cf8;
        }

        .style-response-bubble-left .message-content,
        .style-response-bubble-right .message-content {
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .response-selection-container {
            flex-direction: column;
          }
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
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>

      <div className="messages-container">
        {messages.length === 0 && !isLoading && (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h2>How can I help you today?</h2>
            <p>Start a conversation by typing a message below</p>
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
              <p
                style={{ marginTop: "8px", fontSize: "12px", color: "#565869" }}
              >
                Good things take a little time, almost there 🌼
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ position: "relative", marginBottom: "12px" }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          disabled={isLoading || pendingStyleSelection}
          style={{
            width: "100%",
            minHeight: "80px",
            maxHeight: "200px",
            padding: "12px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "12px",
            fontSize: "14px",
            resize: "none",
            background: "#ffffff",
            color: "#1f2937",
            fontWeight: "400",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            outline: "none",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
            lineHeight: "1.5",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#8b5cf6";
            e.currentTarget.style.boxShadow =
              "0 0 0 3px rgba(139, 92, 246, 0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#d1d5db";
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
          }}
        />
      </div>

      {/* Two Buttons Side by Side */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          width: "100%",
        }}
      >
        {/* End Chat Button - Only show if there are messages */}
        {messages.length > 0 && (
          <button
            onClick={endChat}
            disabled={isLoading || pendingStyleSelection}
            style={{
              flex: "1",
              padding: "12px 20px",
              background:
                isLoading || pendingStyleSelection ? "#e5e7eb" : "#ef4444",
              color: isLoading || pendingStyleSelection ? "#9ca3af" : "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor:
                isLoading || pendingStyleSelection ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow:
                isLoading || pendingStyleSelection
                  ? "none"
                  : "0 2px 8px rgba(239, 68, 68, 0.3)",
            }}
            onMouseEnter={(e) => {
              if (!isLoading && !pendingStyleSelection) {
                e.currentTarget.style.background = "#dc2626";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(239, 68, 68, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && !pendingStyleSelection) {
                e.currentTarget.style.background = "#ef4444";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(239, 68, 68, 0.3)";
              }
            }}
          >
            End Chat & Get Summary
          </button>
        )}

        {/* Send Message Button */}
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading || pendingStyleSelection}
          style={{
            flex: messages.length > 0 ? "1" : "1",
            padding: "12px 20px",
            background:
              input.trim() && !isLoading && !pendingStyleSelection
                ? "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)"
                : "#e5e7eb",
            color:
              input.trim() && !isLoading && !pendingStyleSelection
                ? "#ffffff"
                : "#9ca3af",
            border: "none",
            borderRadius: "12px",
            cursor:
              input.trim() && !isLoading && !pendingStyleSelection
                ? "pointer"
                : "not-allowed",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow:
              input.trim() && !isLoading && !pendingStyleSelection
                ? "0 2px 8px rgba(139, 92, 246, 0.3)"
                : "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (input.trim() && !isLoading && !pendingStyleSelection) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(139, 92, 246, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              input.trim() && !isLoading && !pendingStyleSelection
                ? "0 2px 8px rgba(139, 92, 246, 0.3)"
                : "none";
          }}
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </>
  );
}
