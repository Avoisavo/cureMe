'use client';

import Spline from '@splinetool/react-spline';
import Header from '@/components/header';
import Instruction from '@/components/instruction';
import Cloud from '@/components/cloud';
import Rate from '@/components/rate';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Catroom() {
  const [showInstruction, setShowInstruction] = useState(true);
  const [showCloud, setShowCloud] = useState(false);
  const [showRate, setShowRate] = useState(false);
  const router = useRouter();

  // Listen for "1", "2", "3" and "4" key press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '1') {
        router.push('/chatme');
      } else if (e.key === '2') {
        setShowCloud(true);
      } else if (e.key === '3') {
        router.push('/bookshelf');
      } else if (e.key === '4') {
        setShowRate(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);

  return (
    <>
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(0.8);
          }
        }

        .moon {
          position: absolute;
          top: 10%;
          right: 15%;
          width: 100px;
          height: 100px;
          background: #f4f4f4;
          border-radius: 50%;
          box-shadow: 0 0 60px rgba(255, 255, 255, 0.8),
                      0 0 100px rgba(255, 255, 255, 0.4);
          z-index: 0;
        }

        .moon::before {
          content: '';
          position: absolute;
          top: 15px;
          right: 15px;
          width: 70px;
          height: 70px;
          background: rgba(200, 200, 200, 0.3);
          border-radius: 50%;
        }

        .moon::after {
          content: '';
          position: absolute;
          top: 40px;
          right: 30px;
          width: 20px;
          height: 20px;
          background: rgba(200, 200, 200, 0.4);
          border-radius: 50%;
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          z-index: 0;
          animation: twinkle 3s ease-in-out infinite;
        }

        .star1 {
          width: 3px;
          height: 3px;
          top: 15%;
          left: 10%;
          animation-delay: 0s;
        }

        .star2 {
          width: 2px;
          height: 2px;
          top: 25%;
          left: 25%;
          animation-delay: 0.5s;
        }

        .star3 {
          width: 4px;
          height: 4px;
          top: 18%;
          left: 45%;
          animation-delay: 1s;
        }

        .star4 {
          width: 3px;
          height: 3px;
          top: 30%;
          left: 60%;
          animation-delay: 1.5s;
        }

        .star5 {
          width: 2px;
          height: 2px;
          top: 12%;
          left: 75%;
          animation-delay: 2s;
        }

        .star6 {
          width: 3px;
          height: 3px;
          top: 35%;
          left: 15%;
          animation-delay: 2.5s;
        }

        .star7 {
          width: 4px;
          height: 4px;
          top: 40%;
          left: 35%;
          animation-delay: 0.3s;
        }

        .star8 {
          width: 2px;
          height: 2px;
          top: 22%;
          left: 85%;
          animation-delay: 1.8s;
        }

        .star9 {
          width: 3px;
          height: 3px;
          top: 45%;
          left: 55%;
          animation-delay: 0.7s;
        }

        .star10 {
          width: 2px;
          height: 2px;
          top: 38%;
          left: 70%;
          animation-delay: 1.2s;
        }

        .star11 {
          width: 4px;
          height: 4px;
          top: 8%;
          left: 30%;
          animation-delay: 2.2s;
        }

        .star12 {
          width: 3px;
          height: 3px;
          top: 50%;
          left: 20%;
          animation-delay: 0.9s;
        }
      `}</style>
      <Header />
      <div style={{
        position: 'relative',
        top: '50px',
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(to bottom, #0a0e27, #1a1a2e, #16213e)',
        overflow: 'hidden'
      }}>
        {/* Moon */}
        <div className="moon"></div>
        
        {/* Twinkling stars */}
        <div className="star star1"></div>
        <div className="star star2"></div>
        <div className="star star3"></div>
        <div className="star star4"></div>
        <div className="star star5"></div>
        <div className="star star6"></div>
        <div className="star star7"></div>
        <div className="star star8"></div>
        <div className="star star9"></div>
        <div className="star star10"></div>
        <div className="star star11"></div>
        <div className="star star12"></div>
        
        <div style={{ position: 'relative', zIndex: 1, marginTop: '80px' }}>
          <Spline
            scene="/scene-2.splinecode" 
          />
        </div>
      </div>
      {showInstruction && (
        <Instruction onClose={() => setShowInstruction(false)} />
      )}
      {showCloud && (
        <Cloud 
          onClose={() => setShowCloud(false)}
          left="45%"  // Move to the left (lower % = more left)
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
      {showRate && (
        <Rate onClose={() => setShowRate(false)} />
      )}
    </>
  );
}

