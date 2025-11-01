"use client";

import Spline from "@splinetool/react-spline";
import Header from "@/components/header";
import ChatPanelWrapper from "@/components/chat-panel";
import Instruction from "@/components/instruction";
import Cloud from "@/components/cloud";
import Bookshelf from "@/components/Bookshelf";
import { MangaBook3D } from "@/components/MangaBook3D";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Catroom() {
  const [showInstruction, setShowInstruction] = useState(true);
  const [showCloud, setShowCloud] = useState(false);
  const [showBookshelf, setShowBookshelf] = useState(false);
  const [showManga, setShowManga] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookOpened, setBookOpened] = useState(false);
  const router = useRouter();

  // Page data
  const pages = [
    {
      image: "/first.png",
      text: "This is a placeholder for the AI summary. Today was an interesting day filled with various activities and emotions. The AI will analyze your journal entries and provide insightful summaries here that capture the essence of your experiences.",
    },
    {
      image: "/second.png",
      text: "Another day, another adventure! This is the second page summary where we'll see different manga content and its corresponding AI-generated summary based on your journal entries.",
    },
  ];

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBookClick = () => {
    if (!bookOpened) {
      setCurrentPage(0);
      setBookOpened(true);
    }
  };

  const handleLeftPageClick = () => {
    if (currentPage === 0) {
      setBookOpened(false);
      setCurrentPage(0);
      return;
    }
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRightPageClick = () => {
    if (currentPage === pages.length - 1) {
      setBookOpened(false);
      setCurrentPage(0);
      return;
    }
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Listen for "1", "2", "3" and "4" key press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "1") {
        router.push("/chatme");
      } else if (e.key === "2") {
        setShowCloud(true);
      } else if (e.key === "3") {
        setShowBookshelf(true);
      } else if (e.key === "4") {
        router.push("/chatme");
      } else if (e.key === "Escape") {
        // ESC key closes any open modal
        if (showManga) {
          setShowManga(false);
        } else if (showBookshelf) {
          setShowBookshelf(false);
        } else if (showCloud) {
          setShowCloud(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router, showManga, showBookshelf, showCloud]);

  // Ensure the 3D book starts closed each time the modal opens
  useEffect(() => {
    if (showManga) {
      setBookOpened(false);
      setCurrentPage(0);
    }
  }, [showManga]);

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
            <Canvas
              shadows
              camera={{
                position: [0, 1, 4],
                fov: 50,
              }}
              style={{ width: "100%", height: "100%" }}
            >
              <ambientLight intensity={0.8} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={0.8}
                castShadow
              />
              <directionalLight position={[-5, 3, -3]} intensity={0.4} />
              <pointLight position={[0, 2, 3]} intensity={0.5} />
              <Suspense fallback={null}>
                <group position={[0, -0.5, 0]}>
                  <MangaBook3D
                    leftPageImage={pages[currentPage].image}
                    rightPageText={pages[currentPage].text}
                    opened={bookOpened}
                    onBookClick={handleBookClick}
                    onLeftPageClick={handleLeftPageClick}
                    onRightPageClick={handleRightPageClick}
                  />
                </group>
              </Suspense>
            </Canvas>
          </div>

          {/* Navigation buttons */}
          <div
            style={{
              position: "fixed",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "20px",
              zIndex: 1001,
            }}
          >
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              style={{
                padding: "12px 24px",
                backgroundColor:
                  currentPage === 0
                    ? "rgba(200, 200, 200, 0.5)"
                    : "rgba(255, 255, 255, 0.9)",
                border: "2px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "25px",
                cursor: currentPage === 0 ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "600",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15)",
                transition: "all 0.2s ease",
                color: currentPage === 0 ? "#999" : "#333",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 0) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 1)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 0) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.9)";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              ← Previous
            </button>

            <div
              style={{
                padding: "12px 24px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "2px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "25px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Page {currentPage + 1} / {pages.length}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === pages.length - 1}
              style={{
                padding: "12px 24px",
                backgroundColor:
                  currentPage === pages.length - 1
                    ? "rgba(200, 200, 200, 0.5)"
                    : "rgba(255, 255, 255, 0.9)",
                border: "2px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "25px",
                cursor:
                  currentPage === pages.length - 1 ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "600",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15)",
                transition: "all 0.2s ease",
                color: currentPage === pages.length - 1 ? "#999" : "#333",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== pages.length - 1) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 1)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== pages.length - 1) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.9)";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              Next →
            </button>
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
