'use client'

import { useEffect, useRef, useState } from 'react'

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [lineVisible, setLineVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLineVisible(true)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const categories = [
    { label: 'FRONTEND', skills: ['HTML5', 'CSS3', 'JavaScript', '.NET MAUI', 'ASP.NET'] },
    { label: 'BACKEND', skills: ['Supabase', 'SQLite'] },
    { label: 'DESIGN & TOOLS', skills: ['Figma', 'Gemini'] },
  ]

  return (
    <section id="skills-section" className="min-h-screen py-20 px-4 sm:px-6 flex flex-col justify-center" ref={sectionRef}>
      <h2 className="font-semibold text-3xl sm:text-4xl text-center mb-8">Technical Arsenal</h2>
      
      <div className={`h-0.5 bg-orange-500/50 mb-8 transition-all duration-700 ${lineVisible ? 'w-48 mx-auto' : 'w-0 mx-auto'}`} />
      
      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto w-full">
        {categories.map(cat => (
          <div key={cat.label} className="glass-card p-6 transition-transform duration-300 hover:-translate-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.15em] mb-4 block opacity-60">{cat.label}</span>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map(s => (
                <span key={s} className="skill-item">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}