"use client";

import Spline from "@splinetool/react-spline";
import Header from "@/components/header";
import ChatPanelWrapper from "@/components/chat-panel";
import Instruction from "@/components/instruction";
import Cloud from "@/components/cloud";
import Bookshelf from "@/components/Bookshelf";
import MangaBook from "@/components/MangaBook";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Catroom() {
  const [showInstruction, setShowInstruction] = useState(true);
  const [showCloud, setShowCloud] = useState(false);
  const [showBookshelf, setShowBookshelf] = useState(false);
  const [showManga, setShowManga] = useState(false);
  const router = useRouter();

  // Listen for "2" and "3" key press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "2") {
        setShowCloud(true);
      } else if (e.key === "3") {
        setShowBookshelf(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router]);

  return (
    <>
      <Header />
      <ChatPanelWrapper>
        <Spline scene="/scene.splinecode" />
      </ChatPanelWrapper>
      {showInstruction && (
        <Instruction onClose={() => setShowInstruction(false)} />
      )}
      {showCloud && (
        <Cloud
          onClose={() => setShowCloud(false)}
          // ===== HOW TO ADJUST CLOUD POSITION =====
          // Uncomment and modify these props to change position:

          // top="20%"        // Distance from top (default: 20%)
          // bottom="auto"    // Distance from bottom (default: auto)
          // left="50%"       // Distance from left (default: 50% - centered)
          // right="auto"     // Distance from right (default: auto)

          // EXAMPLES:
          // Top-left corner:     top="10%" left="10%"
          // Top-right corner:    top="10%" right="10%" left="auto"
          // Bottom-left corner:  bottom="10%" left="10%" top="auto"
          // Bottom-right corner: bottom="10%" right="10%" left="auto" top="auto"
          // Center screen:       top="50%" left="50%" (default is already centered)
          // Lower center:        top="60%" left="50%"
        />
      )}
      {showBookshelf && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowBookshelf(false)}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Bookshelf
              onClose={() => setShowBookshelf(false)}
              onMangaClick={() => {
                setShowBookshelf(false);
                setShowManga(true);
              }}
            />
          </div>
        </div>
      )}
      {showManga && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              zIndex: 2,
            }}
          >
            <MangaBook
              coverImage="/cover.png"
              title="My Daily Manga Journal"
              description="2025 Edition"
              leftPageImage="/manga-left.png"
              rightPageImage="/manga-right.png"
            />
          </div>
          {/* Close button */}
          <button
            onClick={() => setShowManga(false)}
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              width: "44px",
              height: "44px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "2px solid rgba(0, 0, 0, 0.1)",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "20px",
              fontWeight: "400",
              zIndex: 1001,
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#333",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
              e.currentTarget.style.transform = "scale(1.1) rotate(90deg)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.9)";
              e.currentTarget.style.transform = "scale(1) rotate(0deg)";
              e.currentTarget.style.boxShadow =
                "0 2px 12px rgba(0, 0, 0, 0.15)";
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
