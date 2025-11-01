import Spline from '@splinetool/react-spline/next';

export default function Landing() {
  return (
    <main style={{ 
      width: '100vw', 
      height: '100vh',
      transform: 'translateX(-100px)',
      position: 'relative'
    }}>
      <h1 style={{
        position: 'absolute',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        fontSize: '3rem',
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        margin: 0
      }}>
        Welcome to CureMe
      </h1>
      <Spline
        scene="/scene-landing.splinecode" 
      />
    </main>
  );
}

