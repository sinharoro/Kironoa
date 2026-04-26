'use client'

import { useEffect, useRef } from 'react'
import Sortable from 'sortablejs'
import TimeCard    from '@/components/cards/TimeCard'
import ProfileCard from '@/components/cards/ProfileCard'
import StatusCard  from '@/components/cards/StatusCard'
import HarmonyCard from '@/components/cards/HarmonyCard'
import ContactCard from '@/components/cards/ContactCard'
import MusicCard   from '@/components/cards/MusicCard'
import GameCard    from '@/components/cards/GameCard'

export default function BentoSection() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return
    const sortable = Sortable.create(gridRef.current, {
      animation: 300,
      handle: '.card',
      ghostClass: 'sortable-ghost',
    })
    return () => sortable.destroy()
  }, [])

  return (
    <section id="bento-section" className="portfolio-section">
      <div className="bento-container" ref={gridRef}>
        {/* Time card spans 2 cols — wrapper needed for Sortable */}
        <div style={{ gridColumn: 'span 2' }}>
          <TimeCard />
        </div>

        <ProfileCard />
        <StatusCard  />

        <HarmonyCard />
        <ContactCard />

        {/* Reminder card */}
        <div className="card" style={{ cursor: 'default' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Reminder</h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>You can click and drag the cards.</p>
        </div>

        <GameCard />
        <MusicCard />
      </div>
    </section>
  )
}
