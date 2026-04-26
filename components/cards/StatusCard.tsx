'use client'

import { useState } from 'react'
import CardModal from '@/components/modals/CardModal'

const STATUSES = [
  'Thinking about code...',
  'Deep in focus mode...',
  'Chasing bugs...',
  'Architecting dreams...',
]

export default function StatusCard() {
  const [open, setOpen] = useState(false)
  // Rotate statuses every render deterministically
  const status = STATUSES[Math.floor(Date.now() / 60000) % STATUSES.length]

  return (
    <>
      <div className="card status-card" onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
        <div className="status-indicator">
          <span className="dot" />
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{status}</span>
        </div>
        <h3 style={{ fontWeight: 700, margin: '8px 0 4px' }}>Current Focus</h3>
        <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Making Portfolio and Mobile Application</p>
      </div>

      {open && (
        <CardModal title="What's on the list" onClose={() => setOpen(false)}>
          <p style={{ marginBottom: 12, opacity: 0.8 }}>Things I want to try:</p>
          <ul style={{ paddingLeft: 20, lineHeight: 2, opacity: 0.9 }}>
            <li>Build a Space Impact clone ✅</li>
            <li>Master Glassmorphism UI</li>
            <li>Build a Remote Control Using Mobile Phone</li>
            <li>Mastering Design</li>
          </ul>
        </CardModal>
      )}
    </>
  )
}
