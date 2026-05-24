'use client'

import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const aboutBio = `Crafting digital experiences with precision and intention. Based in Misamis Occidental, Philippines.`

const projects = [
  {
    title: 'Meteor Blast',
    category: 'Game',
    year: '2026',
    link: 'https://meteor-blast.vercel.app/',
    logo: '/images/MBlast logo.png',
    showcase: '/images/Mblast showcase card.png',
  },
  {
    title: 'The Den',
    category: 'E-Commerce Platform',
    year: '2026',
    link: 'https://thedenpagadiancity.vercel.app/',
    logo: '/images/The Den logo.jpg',
    showcase: '/images/The Den showcase card.png',
  },
]

const skills = [
  { name: 'Imagination', level: 98 },
  { name: 'Problem solving', level: 100 },
  { name: 'Adaptability', level: 96 },
  { name: 'Strategy', level: 85 },
]

const experiences = [
  { role: 'Vibe Coder', company: 'Self-taught', period: 'January 2026 — Present' },
  { role: 'School Projects', company: 'BS Computer Science 2nd Year', period: 'January 2026 — Present' },
]

function NoiseOverlay() {
  return <div className="noise-overlay" />
}

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isProjectHover, setIsProjectHover] = useState(false)
  const mousePos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX - 4}px`
        dotRef.current.style.top = `${e.clientY - 4}px`
      }
      if (textRef.current) {
        textRef.current.style.left = `${e.clientX + 20}px`
        textRef.current.style.top = `${e.clientY - 10}px`
      }
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHovering(true)
      }
      // Check for project card hover
      if (target.closest('[data-project-card="true"]')) {
        setIsProjectHover(true)
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHovering(false)
      }
      // Check for project card mouse out
      if (target.closest('[data-project-card="true"]')) {
        setIsProjectHover(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseOut)

    const animate = () => {
      // Different follow speed for project hover (slower = smoother)
      const speed = isProjectHover ? 0.08 : 0.15
      const offset = isProjectHover ? 40 : 20
      
      ringPos.current.x += (mousePos.current.x - ringPos.current.x - offset) * speed
      ringPos.current.y += (mousePos.current.y - ringPos.current.y - offset) * speed
      
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`
        ringRef.current.style.top = `${ringPos.current.y}px`
      }
      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseOut)
    }
  }, [isProjectHover])

return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: isProjectHover ? 0 : 1, willChange: 'left, top' }} />
      <div 
        ref={ringRef} 
        className="cursor-ring"
        style={{
          transform: isHovering ? 'scale(2)' : isProjectHover ? 'scale(1)' : 'scale(1)',
          background: isHovering ? 'rgba(0, 245, 160, 0.1)' : isProjectHover ? 'rgba(0, 245, 160, 0.08)' : 'transparent',
          borderRadius: isProjectHover ? '6px' : '50%',
          width: isProjectHover ? '100px' : '40px',
          height: isProjectHover ? '100px' : '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: isProjectHover ? '1.5px solid var(--color-accent)' : '1px solid var(--color-accent)',
          willChange: 'left, top, transform, width, height',
        }}
      >
        {isProjectHover && (
          <span 
            ref={textRef}
            style={{
              color: '#000000',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              opacity: 0,
              animation: 'fadeIn 0.2s ease forwards',
            }}
          >
            View Project
          </span>
        )}
      </div>
    </>
  )
}

function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
      wheelMultiplier: 1,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

function MagneticButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      const distance = Math.sqrt(x * x + y * y)
      const maxDistance = 30
      
      if (distance < 100) {
        const factor = Math.max(0, 1 - distance / 100) * maxDistance
        const moveX = (x / distance) * factor
        const moveY = (y / distance) * factor
        
        element.style.transform = `translate(${moveX}px, ${moveY}px)`
      }
    }

    const handleMouseLeave = () => {
      element.style.transform = 'translate(0px, 0px)'
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <button ref={ref} onClick={onClick} className="btn" style={{ transition: 'transform 0.3s ease-out' }}>
      {children}
    </button>
  )
}

function TextReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <div 
      ref={ref}
      style={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay 
        }}
        style={{
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

const BentoBox = memo(function BentoBox({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ boxShadow: '0 0 20px rgba(0, 245, 160, 0.05)' }}
      style={{
        ...style,
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '2rem',
        background: 'var(--color-bg-alt)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        willChange: 'transform, opacity',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
})

function HeroSection({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--hero-section-padding)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div style={{ y, opacity, display: 'flex', flexDirection: 'var(--hero-fd)', width: '100%', alignItems: 'center', gap: 'clamp(2rem, 5vw, 6rem)', position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 2vw, 2rem)', marginBottom: '2rem' }}>
            <img 
              src="/images/minilogoKR.png" 
              alt="Kironoa Logo" 
              width={70}
              height={70}
              loading="eager"
              style={{ width: 'clamp(40px, 8vw, 70px)', height: 'clamp(40px, 8vw, 70px)', objectFit: 'contain' }}
            />
            <TextReveal>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{
                  fontSize: 'clamp(0.65rem, 1.2vw, 0.875rem)',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                }}
              >
                Creative Developer
              </motion.p>
            </TextReveal>
          </div>

          <div style={{ overflow: 'hidden', marginBottom: '0.25rem' }}>
            <TextReveal delay={0.1}>
              <h1 style={{
                fontSize: 'clamp(2.5rem, 8vw, 8rem)',
                color: 'var(--color-text)',
                margin: 0,
                lineHeight: 0.9,
              }}>
                KIRONOA
              </h1>
            </TextReveal>
          </div>

          <TextReveal delay={0.2}>
            <p style={{
              fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
              color: 'var(--color-text-muted)',
              maxWidth: 'clamp(250px, 40vw, 400px)',
              lineHeight: 1.6,
            }}>
              {aboutBio}
            </p>
          </TextReveal>

          <div style={{ marginTop: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
            <TextReveal delay={0.4}>
              <MagneticButton onClick={toggleTheme}>
                {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              </MagneticButton>
            </TextReveal>
          </div>
        </div>

        <div style={{ 
          flex: '0 0 auto',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingRight: 'clamp(0.5rem, 2vw, 2rem)',
          order: 'var(--hero-img-order)',
        }}>
          <div style={{
            position: 'relative',
            width: 'clamp(180px, 25vw, 320px)',
            height: 'clamp(180px, 25vw, 320px)',
            flexShrink: 0,
          }}>
            <img 
              src={theme === 'dark' ? '/images/Kironoa.png' : '/images/KironoaL.png'} 
              alt="Kironoa Roro" 
              width={320}
              height={320}
              loading="eager"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
                border: '1px solid var(--color-border)',
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" style={{ padding: 'clamp(3rem, 8vh, 8rem) clamp(1.5rem, 5vw, 6em)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <TextReveal>
            <h2 className="section-title">About</h2>
          </TextReveal>
          <MagneticButton onClick={() => window.open('https://aboutroro.vercel.app/', '_blank')}>
            Access Profile
          </MagneticButton>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'var(--about-bio-grid)', 
          gap: '1.5rem',
        }}>
          <BentoBox>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: 'var(--color-text-muted)' }}>
              Crafting digital experiences with precision and intention. Based in Misamis Occidental, Philippines.
            </p>
          </BentoBox>
          <BentoBox>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: 'var(--color-text-muted)' }}>
              Design-driven developer focused on creating memorable digital products that merge aesthetics with functionality.
            </p>
          </BentoBox>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'var(--about-stats-grid)', gap: '1.5rem', marginTop: '1.5rem' }}>
          <BentoBox>
            <p style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-accent)', marginBottom: '0.5rem' }}>2+</p>
            <p style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Months Experience</p>
          </BentoBox>
          <BentoBox>
            <p style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-accent)', marginBottom: '0.5rem' }}>10+</p>
            <p style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Projects Completed</p>
          </BentoBox>
        </div>
      </div>
    </section>
  )
}

function ProjectShowcaseBox({ project, index, theme }: { project: typeof projects[0]; index: number; theme: string }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      key={project.title}
      data-project-card="true"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => project.link && window.open(project.link, '_blank')}
      style={{
        position: 'relative',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'var(--color-bg-alt)',
        cursor: project.link ? 'pointer' : 'default',
        aspectRatio: '4/3',
      }}
    >
      {isHovered && project.showcase ? (
        <img
          src={project.showcase}
          alt="Showcase"
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
        }}>
          {project.logo && (
            <img 
              src={project.logo}
              alt={project.title}
              width={120}
              height={120}
              loading="lazy"
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'contain',
                borderRadius: '12px',
              }}
            />
          )}
          <div style={{ textAlign: 'center' }}>
            <span style={{ 
              fontSize: '0.7rem', 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
            }}>
              {project.category}
            </span>
            <h3 style={{ 
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', 
              fontWeight: 700, 
              color: 'var(--color-text)',
              marginTop: '0.5rem',
            }}>
              {project.title}
            </h3>
            <span style={{ 
              fontSize: '0.75rem', 
              color: 'var(--color-text-muted)',
              display: 'block',
              marginTop: '0.5rem',
            }}>
              {project.year}
            </span>
          </div>
          <span style={{
            position: 'absolute',
            bottom: '1rem',
            fontSize: '0.65rem',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.1em',
            opacity: 0.6,
          }}>
            Hover to explore
          </span>
        </div>
      )}
    </motion.div>
  )
}

function ProjectsSection() {
  const [theme, setTheme] = useState('dark')
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
  }, [])

  return (
    <section id="projects" style={{ padding: 'clamp(3rem, 8vh, 8rem) clamp(1.5rem, 5vw, 6em)', background: 'var(--color-bg-alt)' }}>
      <div className="container">
        <TextReveal>
          <h2 className="section-title">Projects</h2>
        </TextReveal>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'var(--projects-grid)', 
          gap: '1.5rem',
        }}>
          {projects.map((project, index) => (
            <ProjectShowcaseBox 
              key={project.title} 
              project={project} 
              index={index}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillsSection() {
  return (
    <section id="skills" style={{ padding: 'clamp(3rem, 8vh, 8rem) clamp(1.5rem, 5vw, 6em)' }}>
      <div className="container">
        <TextReveal>
          <h2 className="section-title">Skills</h2>
        </TextReveal>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'var(--skills-grid)', 
          gap: '1.5rem',
        }}>
          {skills.map((skill, index) => (
            <BentoBox key={skill.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{skill.name}</span>
                <span style={{ color: 'var(--color-accent)', fontSize: '1.5rem', fontWeight: 700 }}>{skill.level}%</span>
              </div>
              <div style={{
                height: '4px',
                background: 'var(--color-border)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                  style={{
                    height: '100%',
                    background: 'var(--color-accent)',
                    borderRadius: '2px',
                  }}
                />
              </div>
            </BentoBox>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExperienceSection() {
  return (
    <section id="experience" style={{ padding: 'clamp(3rem, 8vh, 8rem) clamp(1.5rem, 5vw, 6em)', background: 'var(--color-bg-alt)' }}>
      <div className="container">
        <TextReveal>
          <h2 className="section-title">Experience</h2>
        </TextReveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {experiences.map((exp, index) => (
            <BentoBox key={exp.role} style={{ display: 'grid', gridTemplateColumns: 'var(--experience-grid)', gap: '2rem', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{exp.period}</span>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>{exp.role}</h3>
                <p style={{ color: 'var(--color-accent)' }}>{exp.company}</p>
              </div>
            </BentoBox>
          ))}
        </div>
      </div>
    </section>
  )
}

function MessagesSection() {
  const [messages, setMessages] = useState<{ id: number; nickname: string; message: string; created_at: string }[]>([])

  useEffect(() => {
    fetch(`${API_BASE}/messages.php`)
      .then(res => res.json())
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  return (
    <section id="messages" style={{ padding: 'clamp(3rem, 8vh, 8rem) clamp(1.5rem, 5vw, 6em)' }}>
      <div className="container">
        <TextReveal>
          <h2 className="section-title">Messages</h2>
        </TextReveal>

        <BentoBox>
          {messages.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ padding: '0.75rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-accent)' }}>{msg.nickname}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{msg.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>
              No messages yet. Be the first to send one!
            </p>
          )}
        </BentoBox>
      </div>
    </section>
  )
}

function ContactSection() {
  const [nickname, setNickname] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccess('')
    setError('')

    try {
      const res = await fetch(`${API_BASE}/messages.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, message }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess('Message sent successfully!')
        setNickname('')
        setMessage('')
      } else {
        setError(data.error || 'Failed to send message')
      }
    } catch {
      setError('Network error. Is the API server running?')
    }
    setSubmitting(false)
  }

  return (
    <section id="contact" style={{ padding: 'clamp(3rem, 8vh, 8rem) clamp(1.5rem, 5vw, 6em)' }}>
      <div className="container">
        <TextReveal>
          <h2 className="section-title">Contact</h2>
        </TextReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'var(--contact-grid)', gap: '1.5rem' }}>
          <BentoBox>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
              Available for freelance projects and collaborations. Let's create something remarkable together.
            </p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              {[
                { 
                  name: 'Facebook', 
                  url: 'https://www.facebook.com/SinhaRoro',
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                },
                { 
                  name: 'Instagram', 
                  url: 'https://www.instagram.com/sinharoro/',
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                },
                { 
                  name: 'Gmail', 
                  url: 'mailto:kirigayaroro@gmail.com',
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.875rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '2px',
                    transition: 'border-color 0.3s, color 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--color-text-muted)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-accent)'
                    e.currentTarget.style.color = 'var(--color-accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.color = 'var(--color-text-muted)'
                  }}
                >
                  {social.icon}
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </BentoBox>
          
          <BentoBox>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {success && (
                <div style={{ padding: '0.75rem', background: 'rgba(0, 245, 160, 0.1)', border: '1px solid var(--color-accent)', borderRadius: '4px', color: 'var(--color-accent)', fontSize: '0.875rem' }}>
                  {success}
                </div>
              )}
              {error && (
                <div style={{ padding: '0.75rem', background: 'rgba(255, 68, 68, 0.1)', border: '1px solid #ff4444', borderRadius: '4px', color: '#ff4444', fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}
              <input
                type="text"
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                style={{
                  padding: '1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  background: 'transparent',
                  color: 'var(--color-text)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
              />
              <textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  background: 'transparent',
                  color: 'var(--color-text)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
              <MagneticButton>{submitting ? 'Sending...' : 'Send Message'}</MagneticButton>
            </form>

          </BentoBox>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const [visitCount, setVisitCount] = useState<number | null>(null)
  const [visitLoading, setVisitLoading] = useState(true)
  const [visitError, setVisitError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const initVisits = async () => {
      try {
        await fetch(`${API_BASE}/visits.php`, {
          method: 'POST',
          signal: controller.signal,
        })
        const res = await fetch(`${API_BASE}/visits.php`, {
          signal: controller.signal,
        })
        const data = await res.json()
        if (data.count !== undefined) {
          setVisitCount(data.count)
        }
      } catch {
        if (!controller.signal.aborted) setVisitError(true)
      }
      setVisitLoading(false)
    }

    initVisits()
    return () => controller.abort()
  }, [])

  return (
    <footer style={{ padding: '3rem', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
        © {new Date().getFullYear()} Kironoa Roro
      </p>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginTop: '0.75rem' }}>
        {visitLoading ? 'Loading visits...' : visitError ? '' : `Total Visits: ${visitCount}`}
      </p>
    </footer>
  )
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

const navItems = [
  { label: 'Home', id: 'home' },
  { label: 'Projects', id: 'projects' },
  { label: 'Skills', id: 'skills' },
  { label: 'Experience', id: 'experience' },
  { label: 'About', id: 'about' },
  { label: 'Messages', id: 'messages' },
  { label: 'Contact', id: 'contact' },
]

const FloatingClock = memo(function FloatingClock({ theme }: { theme: string }) {
  const [time, setTime] = useState({ time: '', date: '' })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }
      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }
      setTime({
        time: now.toLocaleTimeString('en-US', options),
        date: now.toLocaleDateString('en-US', dateOptions),
      })
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        top: 'clamp(0.75rem, 2vw, 1.5rem)',
        left: 'clamp(0.75rem, 2vw, 1.5rem)',
        padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 2.5vw, 1.5rem)',
        background: theme === 'dark' ? 'rgba(8, 12, 11, 0.6)' : 'rgba(255, 255, 255, 0.7)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.15rem',
        cursor: 'pointer',
      }}
    >
      {isHovered && (
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            bottom: '-28px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 'clamp(0.5rem, 1vw, 0.625rem)',
            color: 'var(--color-accent)',
            whiteSpace: 'nowrap',
            padding: '0.25rem 0.5rem',
            background: theme === 'dark' ? 'rgba(8, 12, 11, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: '4px',
            border: '1px solid var(--color-border)',
          }}
        >
          This is my timezone
        </motion.span>
      )}
      <span style={{
        fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
        fontWeight: 600,
        color: 'var(--color-accent)',
        letterSpacing: '0.1em',
        fontFamily: "'SF Mono', 'Fira Code', monospace",
      }}>
        {time.time}
      </span>
      <span style={{
        fontSize: 'clamp(0.625rem, 1.25vw, 0.75rem)',
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
      }}>
        {time.date}
      </span>
      <span style={{
        fontSize: 'clamp(0.5rem, 1vw, 0.625rem)',
        color: 'var(--color-accent)',
        opacity: 0.6,
        letterSpacing: '0.1em',
      }}>
        PHT
      </span>
    </motion.div>
  )
})

function FloatingNav() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav style={{
      position: 'fixed',
      bottom: 'clamp(0.5rem, 2vw, 2rem)',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 'clamp(0.1rem, 1vw, 0.25rem)',
      padding: 'clamp(0.3rem, 1vw, 0.5rem)',
      background: 'rgba(8, 12, 11, 0.4)',
      border: '1px solid var(--color-border)',
      borderRadius: '50px',
      backdropFilter: 'blur(10px)',
      zIndex: 100,
      opacity: 0.7,
      transition: 'opacity 0.3s ease',
      flexWrap: 'wrap',
      justifyContent: 'center',
      maxWidth: 'calc(100vw - 2rem)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.opacity = '1'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.opacity = '0.7'
    }}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          style={{
            padding: 'clamp(0.4rem, 1.5vw, 0.6rem) clamp(0.5rem, 2vw, 1.25rem)',
            borderRadius: '50px',
            border: 'none',
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: 'clamp(0.6rem, 2vw, 0.8rem)',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            opacity: 0.7,
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-accent)'
            e.currentTarget.style.color = 'var(--color-bg)'
            e.currentTarget.style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'
            e.currentTarget.style.opacity = '0.7'
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}

const ThemeToggle = memo(function ThemeToggle({ theme }: { theme: string }) {
  const [bgIndex, setBgIndex] = useState(0)
  const backgrounds = ['/images/saogreen.png', '/images/saopurple.png', '/images/saored.png']

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const isLight = theme === 'light'

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -3,
          backgroundImage: `url('/images/saobg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isLight ? 0 : 1,
          transition: 'opacity 0.8s ease',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2,
          backgroundImage: `url(${backgrounds[bgIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isLight ? 1 : 0,
          transition: 'opacity 0.8s ease, background-image 1s ease-in-out',
          willChange: 'opacity',
        }}
      />
    </>
  )
})

const LoadingScreen = memo(function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        willChange: 'opacity',
      }}
    >
      <img 
        src="/images/one-piece-luffy.gif" 
        alt="Loading" 
        style={{
          width: 'clamp(100px, 30vw, 200px)',
          height: 'auto',
        }}
      />
    </motion.div>
  )
})

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
    return () => clearTimeout(timer)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  if (!mounted) return null

  if (loading) return <LoadingScreen />

  return (
    <SmoothScroll>
      <PageTransition>
        <FloatingClock theme={theme} />
        <FloatingNav />
        <ThemeToggle theme={theme} />
        <CustomCursor />
        <HeroSection theme={theme} toggleTheme={toggleTheme} />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <AboutSection />
        <MessagesSection />
        <ContactSection />
        <Footer />
      </PageTransition>
    </SmoothScroll>
  )
}