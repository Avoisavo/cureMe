'use client';

import Spline from '@splinetool/react-spline';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/catroom');
  };

  return (
    <main 
      onClick={handleClick}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      {/* Title at the top */}
      <h1 style={{
        position: 'absolute',
        top: '4.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '4rem',
        fontWeight: '900',
        color: '#00FFFF',
        textAlign: 'center',
        zIndex: 10,
        pointerEvents: 'none',
        textShadow: `
          3px 3px 0px #FF00FF,
          6px 6px 0px #FF1493,
          9px 9px 0px #8B008B,
          12px 12px 0px #4B0082,
          15px 15px 20px rgba(0, 0, 0, 0.8),
          0 0 30px rgba(0, 255, 255, 0.8),
          0 0 60px rgba(255, 0, 255, 0.6)
        `,
        margin: 0,
        letterSpacing: '12px',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-press-start), "Courier New", monospace',
        WebkitTextStroke: '2px #000033',
        paintOrder: 'stroke fill',
        whiteSpace: 'nowrap',
        width: 'max-content',
        maxWidth: '95vw'
      }}>
        PsyCatrist Time
      </h1>

      <div style={{
        width: '120%',
        height: '120%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }}>
        <Spline
          scene="https://prod.spline.design/11IDjxMUwN7d3QYS/scene.splinecode" 
        />
      </div>
    </main>
  );
}
