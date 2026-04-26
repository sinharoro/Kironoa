'use client'

import Image from 'next/image'
import { useState } from 'react'

interface Project {
  id: string
  title: string
  tag: string
  description: string
  image?: string
  codeUrl?: string
  showcase?: {
    images?: string[]
    details: string
  }
}

const PROJECTS: Project[] = [
  {
    id: 'student-pal',
    title: 'Student Pal',
    tag: 'Mobile App',
    description: 'My very first project... a cross-platform mobile application designed to help students stay focused.',
    image: '/images/StudentPal/SPpreview.jpg',
    codeUrl: 'https://github.com',
    showcase: {
      images: [
        '/images/StudentPal/SPdashboard.png',
        '/images/StudentPal/SPonline.png',
        '/images/StudentPal/SPoffline.png',
      ],
      details: 'Student Pal is a .NET MAUI cross-platform app built to help students track tasks, manage study sessions, and stay productive. Features include offline sync, a daily planner, and a distraction-free focus mode.',
    },
  },
  {
    id: 'nova-dashboard',
    title: 'Nova Dashboard',
    tag: 'Web Design',
    description: 'A high-performance financial dashboard featuring real-time data visualization and glassmorphism widgets.',
    image: undefined,
    codeUrl: '#',
  },
]

export default function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  return (
    <>
      <section id="projects-section">
        <h2 className="section-title">Selected Works</h2>
        <div className="projects-gallery">
          {PROJECTS.map(p => (
            <div key={p.id} className="project-showcase-card" onClick={() => p.showcase && setActiveProject(p)}>
              <div className="project-image">
                {p.image ? (
                  <Image src={p.image} alt={p.title} width={500} height={350} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: 250, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3, borderRadius: 20 }}>
                    🖼️
                  </div>
                )}
              </div>

              <div className="project-details">
                <span className="tag" style={{ marginBottom: 12, display: 'inline-block' }}>{p.tag}</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '8px 0' }}>{p.title}</h3>
                <p style={{ opacity: 0.7, lineHeight: 1.6, marginBottom: 20 }}>{p.description}</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  {p.showcase && (
                    <span style={viewBtnStyle} onClick={() => setActiveProject(p)}>
                      View Case Study
                    </span>
                  )}
                  {p.codeUrl && p.codeUrl !== '#' && (
                    <a href={p.codeUrl} target="_blank" rel="noopener noreferrer" style={{ opacity: 0.7, fontSize: '0.9rem' }} onClick={e => e.stopPropagation()}>
                      Code ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Project detail modal */}
      {activeProject && (
        <div className="project-glass-modal active" onClick={() => setActiveProject(null)}>
          <div className="project-glass-content" onClick={e => e.stopPropagation()}>
            <button className="close-project-btn" onClick={() => setActiveProject(null)}>&times;</button>
            <span className="tag" style={{ marginBottom: 16, display: 'inline-block' }}>{activeProject.tag}</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0 16px' }}>{activeProject.title}</h2>
            <p style={{ opacity: 0.8, lineHeight: 1.7, marginBottom: 24 }}>{activeProject.showcase?.details}</p>

            {activeProject.showcase?.images && (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {activeProject.showcase.images.map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    alt={`${activeProject.title} screenshot ${i + 1}`}
                    width={300}
                    height={200}
                    style={{ borderRadius: 12, flex: '1 1 200px', height: 'auto', objectFit: 'cover' }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

const viewBtnStyle: React.CSSProperties = {
  padding: '10px 20px',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 50,
  cursor: 'pointer',
  fontSize: '0.85rem',
  transition: 'all 0.3s',
}
