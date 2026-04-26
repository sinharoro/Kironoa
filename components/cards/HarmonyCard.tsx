'use client'

import { useRef, useState } from 'react'
import CardModal from '@/components/modals/CardModal'
import Image from 'next/image'

const SEASONS = [
  { key: 'spring', kanji: '春', label: 'Spring', sound: '/sounds/Green_Despair.mp3', cls: 'spring' },
  { key: 'summer', kanji: '夏', label: 'Summer', sound: '/sounds/Desert_Scream.mp3', cls: 'summer' },
  { key: 'autumn', kanji: '秋', label: 'Autumn', sound: '/sounds/Bloody_Ice.mp3', cls: 'autumn' },
  { key: 'winter', kanji: '冬', label: 'Winter', sound: '/sounds/Port_Lux.mp3', cls: 'winter' },
]

export default function HarmonyCard() {
  const [open, setOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSeason = (e: React.MouseEvent, src: string) => {
    e.stopPropagation()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = src
      audioRef.current.play().catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} />

      <div className="glass-card p-6 sm:p-8 cursor-pointer" onClick={() => setOpen(true)}>
        <h2 className="font-semibold text-lg mb-1">Harmony App</h2>
        <p className="text-sm opacity-60 mb-4">A mindfulness tool for busy creators.</p>

        <div className="seasons-container">
          {SEASONS.map(s => (
            <div
              key={s.key}
              className={`season-quadrant ${s.cls}`}
              onClick={e => playSeason(e, s.sound)}
            >
              <span className="kanji">{s.kanji}</span>
              <span className="season-label">{s.label}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-center opacity-40 mt-4">Click on a season to play a sound</p>
      </div>

      {open && (
        <CardModal title="Harmony App" onClose={() => setOpen(false)}>
          <Image
            src="/images/4seasons.png"
            alt="4 Seasons"
            width={400}
            height={250}
            className="w-full h-auto mb-4 rounded-xl"
          />
          <h3 className="font-semibold mb-2">Project Details</h3>
          <p className="opacity-80 leading-relaxed">
            The app serves as a digital escape for users who are overwhelmed. By providing curated
            sounds based on the four seasons, it allows users to engage in brief "micro-meditations"
            or grounding exercises during a busy workday.
          </p>
        </CardModal>
      )}
    </>
  )
}