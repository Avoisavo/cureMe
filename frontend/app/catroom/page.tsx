'use client';

import Spline from '@splinetool/react-spline';
import Header from '@/components/header';
import ChatPanelWrapper from '@/components/chat-panel';
import Instruction from '@/components/instruction';
import { useState } from 'react';

export default function Catroom() {
  const [showInstruction, setShowInstruction] = useState(true);

  return (
    <>
      <Header />
      <ChatPanelWrapper>
        <Spline
          scene="/scene.splinecode" 
        />
      </ChatPanelWrapper>
      {showInstruction && (
        <Instruction onClose={() => setShowInstruction(false)} />
      )}
    </>
  );
}

