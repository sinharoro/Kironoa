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
      <div 
        className="glass-card time-card p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[180px] cursor-pointer" 
        onClick={() => setOpen(true)}
      >
        <span className="font-mono text-xs tracking-[0.2em] uppercase opacity-50">LOCAL TIME · PH</span>
        <h1 className="font-mono text-3xl sm:text-4xl font-medium tracking-tight text-orange-400 my-3">
          {time}
        </h1>
        <p className="font-mono text-sm opacity-60">{date}</p>
        <p className="font-mono text-xs opacity-40 mt-4">Click to open calendar</p>
      </div>

      {open && (
        <CardModal title="Calendar & Notes" onClose={() => setOpen(false)}>
          <CalendarCard />
        </CardModal>
      )}
    </>
  )
}