'use client'

import Image from 'next/image'
import { useState } from 'react'
import CardModal from '@/components/modals/CardModal'

export default function MusicCard() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="glass-card p-6 sm:p-8 cursor-pointer" onClick={() => setOpen(true)}>
        <div className="flex justify-between items-center mb-3">
          <span className="font-mono text-xs uppercase tracking-widest opacity-60">Favorite Track</span>
          <span className="text-xl">🎵</span>
        </div>

        <div className="music-card-content">
          <Image
            src="/images/Keshi.png"
            alt="Keshi – Soft Spot"
            width={60}
            height={60}
            className="album-art"
          />
          <div>
            <h4 className="font-semibold mb-0.5">Soft Spot</h4>
            <p className="text-sm opacity-60 mb-2">Keshi</p>
            <a
              href="https://music.youtube.com/watch?v=vZ0Iogdip40"
              target="_blank"
              rel="noopener noreferrer"
              className="play-btn"
            >
              ▶ Play
            </a>
          </div>
        </div>
      </div>

      {open && (
        <CardModal title="Currently Obsessed" onClose={() => setOpen(false)}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest opacity-50 mb-2">Currently Obsessed</div>
              <h2 className="font-semibold text-3xl mb-1">Soft Spot</h2>
              <h4 className="opacity-70 mb-4">Keshi</h4>

              <hr className="border-white/10 mb-4" />

              <p className="opacity-80 leading-relaxed text-sm">
                "Soft Spot" is a staple in my coding playlist. It provides the perfect lo-fi energy
                for deep focus sessions, blending smooth vocals with a nostalgic beat.
              </p>

              <div className="flex gap-2 mt-6">
                <span className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full cursor-pointer hover:bg-white/20">⏮</span>
                <span className="px-4 py-2 bg-white/10 rounded-full cursor-pointer hover:bg-white/20">⏸</span>
                <span className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full cursor-pointer hover:bg-white/20">⏭</span>
              </div>
            </div>

            <Image
              src="/images/Keshi.png"
              alt="Album Art"
              width={200}
              height={200}
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>
        </CardModal>
      )}
    </>
  )
}