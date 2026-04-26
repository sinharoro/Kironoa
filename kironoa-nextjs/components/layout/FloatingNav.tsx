'use client'

import { useEffect, useRef, useState } from 'react'

const SECTIONS = [
  { id: 'bento-section',        label: 'Portfolio' },
  { id: 'skills-section',       label: 'Skills' },
  { id: 'certificates-section', label: 'Certificates' },
  { id: 'projects-section',     label: 'Projects' },
]

export default function FloatingNav() {
  const [active, setActive] = useState('bento-section')
  const indicatorRef = useRef<HTMLDivElement>(null)

  // Update indicator width/position to match the active nav item
  useEffect(() => {
    const indicator = indicatorRef.current
    const nav = document.querySelector('.floating-nav')
    if (!indicator || !nav) return

    const activeEl = nav.querySelector<HTMLElement>('.nav-item.active')
    if (activeEl) {
      indicator.style.width  = activeEl.offsetWidth + 'px'
      indicator.style.left   = activeEl.offsetLeft + 'px'
    }
  }, [active])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setActive(id)
  }

  return (
    <nav className="floating-nav">
      {SECTIONS.map(s => (
        <button
          key={s.id}
          className={`nav-item ${active === s.id ? 'active' : ''}`}
          onClick={() => scrollTo(s.id)}
        >
          {s.label}
        </button>
      ))}
      <div className="nav-indicator" ref={indicatorRef} />
    </nav>
  )
}
