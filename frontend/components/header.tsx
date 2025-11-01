'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/landing', label: 'Home', icon: '🏡' },
    { href: '/catroom', label: 'Cat Room', icon: '🐱' },
    { href: '/livingroom', label: 'Living Room', icon: '🛋️' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="text-3xl transform group-hover:rotate-12 transition-transform duration-300">
              🏠
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              CureMe
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full font-medium
                    transition-all duration-300 ease-out
                    ${isActive 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                    }
                  `}
                >
                  <span className={`text-lg transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {link.icon}
                  </span>
                  <span className="text-sm">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </header>
  );
}

