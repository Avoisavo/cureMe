import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
    }}>
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#6366f1',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1.8rem' }}>🏠</span>
          CureMe
        </Link>
        
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <Link href="/landing" style={{
            color: '#4b5563',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'color 0.2s',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem'
          }}>
            Home
          </Link>
          
          <Link href="/catroom" style={{
            color: '#4b5563',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'color 0.2s',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem'
          }}>
            🐱 Cat Room
          </Link>
          
          <Link href="/livingroom" style={{
            color: '#4b5563',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'color 0.2s',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem'
          }}>
            🛋️ Living Room
          </Link>
        </div>
      </nav>
    </header>
  );
}

