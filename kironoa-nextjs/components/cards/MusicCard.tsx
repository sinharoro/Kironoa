'use client'

import Image from 'next/image'
import { useState } from 'react'
import CardModal from '@/components/modals/CardModal'

export default function MusicCard() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="card music-card" onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
        <div className="music-header">
          <span className="now-playing-label">Favorite Track</span>
          <span style={{ fontSize: 16 }}>🎵</span>
        </div>

        <div className="static-music-content">
          <Image
            src="/images/Keshi.png"
            alt="Keshi – Soft Spot"
            width={60}
            height={60}
            className="album-art"
          />
          <div className="music-info">
            <h4 style={{ fontWeight: 700, marginBottom: 2 }}>Soft Spot</h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: 8 }}>Keshi</p>
            <a
              href="https://music.youtube.com/watch?v=vZ0Iogdip40"
              target="_blank"
              rel="noopener noreferrer"
              className="play-link"
              onClick={e => e.stopPropagation()}
            >
              <button className="button"><span>Play</span></button>
            </a>
          </div>
        </div>
      </div>

      {open && (
        <CardModal title="Currently Obsessed" onClose={() => setOpen(false)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ fontSize: '0.7rem', letterSpacing: 2, opacity: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>
                Currently Obsessed
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Soft Spot</h2>
              <h4 style={{ opacity: 0.7, marginBottom: 16 }}>Keshi</h4>

              <hr style={{ borderColor: 'rgba(255,255,255,0.1)', marginBottom: 16 }} />

              <p style={{ opacity: 0.8, lineHeight: 1.7, fontSize: '0.9rem' }}>
                &quot;Soft Spot&quot; is a staple in my coding playlist. It provides the perfect lo-fi energy
                for deep focus sessions, blending smooth vocals with a nostalgic beat.
              </p>

              <div style={{ display: 'flex', gap: 12, marginTop: 20, alignItems: 'center' }}>
                <span style={controlBtn}>⏮</span>
                <span style={{ ...controlBtn, background: 'rgba(255,255,255,0.15)', padding: '8px 14px' }}>⏸</span>
                <span style={controlBtn}>⏭</span>
              </div>
            </div>

            <Image
              src="/images/Keshi.png"
              alt="Album Art"
              width={200}
              height={200}
              style={{ borderRadius: 16, objectFit: 'cover', width: '100%', height: 'auto' }}
            />
          </div>
        </CardModal>
      )}
    </>
  )
}

const controlBtn: React.CSSProperties = {
  cursor: 'pointer',
  fontSize: '1.2rem',
  padding: '8px 12px',
  background: 'rgba(255,255,255,0.08)',
  borderRadius: 8,
}
