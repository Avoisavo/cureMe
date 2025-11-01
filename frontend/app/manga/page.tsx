"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MangaBook from "@/components/MangaBook";
import Spline from "@splinetool/react-spline";

export default function MangaPage() {
  const router = useRouter();
  const [showManga, setShowManga] = useState(true);
  const [splineLoaded, setSplineLoaded] = useState(false);

  const handleClose = () => {
    router.back();
  };

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "white", // White background like bookshelf
      }}
    >
      {/* Catroom background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          opacity: splineLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in",
        }}
      >
        <Spline
          scene="/scene.splinecode"
          onLoad={() => setSplineLoaded(true)}
        />
      </div>

      {/* Dark overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
        }}
      />

      {/* Manga book on top */}
      {showManga && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
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
      )}

      {/* Close button */}
      <button
        onClick={handleClose}
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
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
          e.currentTarget.style.transform = "scale(1) rotate(0deg)";
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0, 0, 0, 0.15)";
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
    </main>
  );
}
