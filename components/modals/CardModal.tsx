'use client'

import { useEffect } from 'react'

interface Props {
  title: string
  children: React.ReactNode
  onClose: () => void
}

export default function CardModal({ title, children, onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2 style={{ marginBottom: 16, fontSize: '1.4rem', fontWeight: 600 }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}
