'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import LoginPopup from '@/components/modals/LoginPopup'

export default function TopNav() {
  const { theme, toggleTheme } = useTheme()
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="top-nav">
      <div className="logo-btn" onClick={() => setShowLogin(v => !v)}>
        <Image src="/images/MyLogo.png" alt="KR" width={24} height={24} />
      </div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️ Lights On 🫦' : '🌙 Lights Off 🫦'}
      </button>

      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
    </div>
  )
}
