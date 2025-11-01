'use client';

import Spline from '@splinetool/react-spline';
import Header from '@/components/header';
import Instruction from '@/components/instruction';
import Cloud from '@/components/cloud';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Catroom() {
  const [showInstruction, setShowInstruction] = useState(true);
  const [showCloud, setShowCloud] = useState(false);
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
        router.push('/chatme');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);

  return (
    <>
      <Header />
      <Spline
        scene="/scene.splinecode" 
      />
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
    </>
  );
}

