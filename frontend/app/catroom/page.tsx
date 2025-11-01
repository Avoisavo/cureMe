import Spline from '@splinetool/react-spline/next';
import Header from '@/components/header';
import ChatPanelWrapper from '@/components/chat-panel';

export default function Catroom() {
  return (
    <>
      <Header />
      <ChatPanelWrapper>
        <Spline
          scene="/scene.splinecode" 
        />
      </ChatPanelWrapper>
    </>
  );
}

