'use client'

import { useEffect, useState } from 'react'
import CardModal from '@/components/modals/CardModal'
import CalendarCard from '@/components/cards/CalendarCard'

export default function TimeCard() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      setDate(now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <div className="card time-card" style={{ gridColumn: 'span 2' }} onClick={() => setOpen(true)}>
        <h1 id="clock" style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-1px' }}>{time}</h1>
        <div style={{ opacity: 0.7, fontSize: '0.9rem', marginTop: 4 }}>{date}</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: 8 }}>Click to open calendar</div>
      </div>

      {open && (
        <CardModal title="Calendar & Notes" onClose={() => setOpen(false)}>
          <CalendarCard />
        </CardModal>
      )}
    </>
  )
}
