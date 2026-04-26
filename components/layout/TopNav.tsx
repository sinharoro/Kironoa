'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import LoginPopup from '@/components/modals/LoginPopup'

export default function TopNav() {
  const { theme, toggleTheme } = useTheme()
  const [showLogin, setShowLogin] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div className="fixed top-5 right-5 z-50 flex items-center gap-3">
        <button 
          className="logo-btn" 
          onClick={() => setShowLogin(v => !v)}
        >
          <Image src="/images/MyLogo.png" alt="KR" width={22} height={22} />
        </button>

        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
      </div>

      {/* Scroll line indicator */}
      <div 
        className={`fixed top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent transition-transform duration-300 ${
          scrolled ? 'scale-x-100' : 'scale-x-0'
        }`}
        style={{ transformOrigin: 'left' }}
      />
    </>
  )
}