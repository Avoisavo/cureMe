"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { MangaBook3D } from "@/components/MangaBook3D";
import Spline from "@splinetool/react-spline";

export default function MangaPage() {
  const router = useRouter();
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [bookOpened, setBookOpened] = useState(false);

  const handleClose = () => {
    router.back();
  };

  // Add ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.back();
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [router]);

  // Auto-open book after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setBookOpened(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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

      {/* 3D Manga book */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100%",
          pointerEvents: "auto",
        }}
      >
        <Canvas
          shadows
          camera={{
            position: [0, 0, 5],
            fov: 45,
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-5, 5, 5]} intensity={0.8} />
          <pointLight position={[0, 0, 5]} intensity={0.5} />
          <Suspense fallback={null}>
            <MangaBook3D
              leftPageImage="/manga-right.png"
              rightPageText="This is a placeholder for the AI summary. Today was an interesting day filled with various activities and emotions. The AI will analyze your journal entries and provide insightful summaries here that capture the essence of your experiences."
              opened={bookOpened}
            />
          </Suspense>
        </Canvas>

        {/* Click to open prompt */}
        {!bookOpened && (
          <div
            style={{
              position: "absolute",
              bottom: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              fontSize: "18px",
              fontWeight: "500",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
              animation: "bounce 2s ease-in-out infinite",
              pointerEvents: "none",
            }}
          >
            Click the book to open
          </div>
        )}
      </div>

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
