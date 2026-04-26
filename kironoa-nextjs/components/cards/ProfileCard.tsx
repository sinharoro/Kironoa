'use client'

import Image from 'next/image'
import { useState } from 'react'
import CardModal from '@/components/modals/CardModal'

export default function ProfileCard() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="card profile-card" onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
        <div className="profile-pic-container" style={{ marginBottom: 12 }}>
          <Image
            src="/images/nge.jpg"
            alt="Kironoa Roro"
            width={80}
            height={80}
            className="profile-img"
          />
        </div>
        <div className="profile-info">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Kironoa Roro</h2>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '4px 0 8px' }}>
            Bachelor of Science in Computer Science Student
          </p>
          <span className="badge">Open to Work</span>
        </div>
      </div>

      {open && (
        <CardModal title="Rolando F. Lobido Jr." onClose={() => setOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <Image
              src="/images/mwemwe.jpg"
              alt="Profile"
              width={200}
              height={200}
              style={{ borderRadius: 16, objectFit: 'cover' }}
            />
            <div>
              <h3 style={{ marginBottom: 8 }}>Bio</h3>
              <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
                Vibe coder who learns by doing and experimenting.
              </p>
            </div>
          </div>
        </CardModal>
      )}
    </>
  )
}
