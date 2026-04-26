'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CalendarCard() {
  const today = new Date()
  const [month, setMonth]           = useState(today.getMonth())
  const [year, setYear]             = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [note, setNote]             = useState('')
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)

  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })
    .format(new Date(year, month))

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth     = new Date(year, month + 1, 0).getDate()
  const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  const changeMonth = (dir: number) => {
    let m = month + dir
    let y = year
    if (m < 0)  { m = 11; y-- }
    if (m > 11) { m = 0;  y++ }
    setMonth(m)
    setYear(y)
    setSelectedDay(null)
    setNote('')
  }

  const handleDayClick = (day: number) => {
    setSelectedDay(day)
    setNote('')
    setSaved(false)
  }

  const saveNote = async () => {
    if (!selectedDay) return
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('Please log in to save notes.')
      setSaving(false)
      return
    }

    const dateKey = `${year}-${month + 1}-${selectedDay}`
    const { error } = await supabase.from('calendar_notes').upsert(
      { date_key: dateKey, note_text: note, user_id: user.id },
      { onConflict: 'user_id,date_key' }
    )

    setSaving(false)
    if (error) {
      alert('Save failed: ' + error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20, color: 'white' }}>
      {/* Calendar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{monthLabel}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => changeMonth(-1)} style={navBtnStyle}>❮</button>
            <button onClick={() => changeMonth(1)}  style={navBtnStyle}>❯</button>
          </div>
        </div>

        {/* Weekday headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', marginBottom: 8 }}>
          {WEEKDAYS.map((d, i) => (
            <div key={i} style={{ fontSize: '0.75rem', opacity: 0.5, fontWeight: 'bold' }}>{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="calendar-grid">
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            const isSelected = day === selectedDay
            return (
              <div
                key={day}
                className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                {day}
              </div>
            )
          })}
        </div>
      </div>

      {/* Notes panel */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 300,
      }}>
        <span style={{ fontSize: '1rem', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 10, marginBottom: 16 }}>
          {selectedDay
            ? `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month))} ${selectedDay}, ${year}`
            : 'Select a date'}
        </span>

        {!selectedDay ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
            <p style={{ fontSize: '0.85rem' }}>No events scheduled</p>
          </div>
        ) : (
          <>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a note for this day..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: 10,
                color: 'white',
                resize: 'none',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                marginBottom: 12,
                outline: 'none',
              }}
            />
            <button
              onClick={saveNote}
              disabled={saving}
              style={{
                padding: '8px 0',
                background: saved ? 'rgba(0,255,117,0.2)' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${saved ? 'rgba(0,255,117,0.5)' : 'rgba(255,255,255,0.2)'}`,
                color: saved ? '#00ff75' : 'white',
                borderRadius: 8,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                transition: 'all 0.3s',
              }}
            >
              {saving ? 'Saving…' : saved ? 'Saved! ✓' : 'Save Note'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const navBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 8,
  padding: '4px 10px',
  color: 'white',
  cursor: 'pointer',
  fontFamily: 'inherit',
}
