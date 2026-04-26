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
      <div className="glass-card p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer" onClick={openGame}>
        <h3 className="font-semibold text-lg mb-1">🚀 Play</h3>
        <p className="text-sm opacity-60">Click to launch game</p>
      </div>

      <div className={`fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center ${open ? 'block' : 'hidden'}`}>
        <div className="relative border-2 border-orange-500 p-2 rounded-2xl">
          <button onClick={closeGame} className="absolute -top-12 right-0 text-orange-500 text-3xl hover:text-white">&times;</button>
          <iframe
            ref={iframeRef}
            className="w-[850px] max-w-[95vw] aspect-video rounded-xl"
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