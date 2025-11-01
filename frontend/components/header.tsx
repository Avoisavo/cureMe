'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUserData, isAuthenticated, logout, UserData } from '@/app/utils/userData/auth';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const navLinks = [
    { href: '/landing', label: 'Home', icon: '🏡' },
    { href: '/catroom', label: 'Cat Room', icon: '🐱' },
    { href: '/livingroom', label: 'Living Room', icon: '🛋️' },
  ];

  // Check authentication status on mount and when pathname changes
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        const user = getUserData();
        setUserData(user);
        console.log('✅ User logged in:', user?.name, user?.email);
      } else {
        setUserData(null);
        console.log('❌ User not logged in');
      }
    };

    checkAuth();
    
    // Also check when URL changes (e.g., after OAuth redirect)
    const handleRouteChange = () => {
      setTimeout(checkAuth, 100); // Small delay to ensure cookies are set
    };
    
    window.addEventListener('focus', checkAuth);
    return () => window.removeEventListener('focus', checkAuth);
  }, [pathname]);

  const handleLogin = () => {
    // Redirect to Google OAuth
    window.location.href = '/api/auth/google';
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="transform group-hover:rotate-12 transition-transform duration-300">
              <Image 
                src="/projectlogo.png" 
                alt="PsyCatrist Time Logo" 
                width={50} 
                height={50}
                className="rounded-full"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              PsyCatrist Time
            </span>
          </Link>
          
          {/* Navigation Links and Auth Buttons */}
          <div className="flex items-center gap-4">
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

            {/* Login/Logout Buttons */}
            <div className="flex items-center gap-2 ml-2 border-l border-gray-300 pl-4">
              {!isLoggedIn ? (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 px-5 py-2 rounded-full font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-105"
                >
                  <span className="text-lg">🔐</span>
                  <span className="text-sm">Log In</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  {/* User Info */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
                    {userData?.picture && (
                      <Image
                        src={userData.picture}
                        alt={userData.name || 'User'}
                        width={28}
                        height={28}
                        className="rounded-full border-2 border-white shadow-sm"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-800">
                      {userData?.name?.split(' ')[0] || 'User'}
                    </span>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-full font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-lg">👋</span>
                    <span className="text-sm">Log Out</span>
                  </button>
                </div>
              )}
            </div>
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

