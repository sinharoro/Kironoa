'use client'

import { useEffect, useRef, useState } from 'react'

const SECTIONS = [
  { id: 'bento-section', label: 'Portfolio' },
  { id: 'skills-section', label: 'Skills' },
  { id: 'certificates-section', label: 'Certs' },
  { id: 'projects-section', label: 'Projects' },
]

export default function FloatingNav() {
  const [active, setActive] = useState('bento-section')

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setActive(id)
  }

  return (
    <nav className="floating-nav-container">
      <div className="floating-nav-pill">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            className={`nav-item ${active === s.id ? 'active' : ''}`}
            onClick={() => scrollTo(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  )
}