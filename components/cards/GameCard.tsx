'use client'

import { useEffect, useRef, useState } from 'react'

export default function GameCard() {
  const [open, setOpen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const openGame = () => {
    setOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeGame = () => {
    setOpen(false)
    document.body.style.overflow = 'auto'
    if (iframeRef.current) {
      iframeRef.current.src = 'about:blank'
    }
  }

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeGame()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  return (
    <>
      <div className="si-launcher-card" onClick={openGame}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>🚀 Play</h3>
        <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Click to launch game</p>
      </div>

      <div className={`si-modal-overlay ${open ? 'active' : ''}`}>
        <div className="si-game-wrapper">
          <span className="si-close-btn" onClick={closeGame}>&times;</span>
          <iframe
            ref={iframeRef}
            className="si-game-frame"
            src={open ? '/games/SI.html' : 'about:blank'}
            scrolling="no"
            allow="fullscreen"
            title="Space Impact"
          />
        </div>
      </div>
    </>
  )
}
