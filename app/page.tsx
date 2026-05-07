'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'

const aboutBio = `Crafting digital experiences with precision and intention. Based in Misamis Occidental, Philippines.`

const projects = [
  {
    title: 'Brand Identity',
    category: 'Design',
    year: '2024',
  },
  {
    title: 'E-Commerce Platform',
    category: 'Development',
    year: '2024',
  },
  {
    title: 'Editorial Design',
    category: 'Design',
    year: '2023',
  },
  {
    title: 'Mobile Application',
    category: 'Development',
    year: '2023',
  },
]

const skills = [
  { name: 'Design', level: 95 },
  { name: 'Development', level: 90 },
  { name: 'Strategy', level: 85 },
]

const experiences = [
  { role: 'Senior Developer', company: 'Studio Nexus', period: '2022 — Present' },
  { role: 'Creative Technologist', company: 'Digital Craft', period: '2020 — 2022' },
  { role: 'Designer', company: 'Minimalist Labs', period: '2018 — 2020' },
]

function NoiseOverlay() {
  return <div className="noise-overlay" />
}

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const mousePos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX - 4}px`
        dotRef.current.style.top = `${e.clientY - 4}px`
      }
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsHovering(true)
      }
    }

    const handleMouseOut = () => {
      setIsHovering(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseOut)

    const animate = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x - 20) * 0.15
      ringPos.current.y += (mousePos.current.y - ringPos.current.y - 20) * 0.15
      
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
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div 
        ref={ringRef} 
        className="cursor-ring"
        style={{
          transform: isHovering ? 'scale(2)' : 'scale(1)',
          background: isHovering ? 'rgba(0, 245, 160, 0.1)' : 'transparent'
        }}
      />
    </>
  )
}

function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
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

function BentoBox({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
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
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function HeroSection({ theme }: { theme: string }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '6rem 6em',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div style={{ y, opacity }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', marginBottom: '2rem' }}>
          <img 
            src="/images/minilogoKR.png" 
            alt="Kironoa Logo" 
            style={{ width: '80px', height: '80px', objectFit: 'contain' }}
          />
          <TextReveal>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                fontSize: '0.875rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
              }}
            >
              Creative Developer
            </motion.p>
          </TextReveal>
        </div>

        <div style={{ overflow: 'hidden', marginBottom: '0.5rem' }}>
          <TextReveal delay={0.1}>
            <h1 style={{
              fontSize: 'clamp(4rem, 12vw, 10rem)',
              color: 'var(--color-text)',
              margin: 0,
              lineHeight: 0.9,
            }}>
              KIRONOA
            </h1>
          </TextReveal>
        </div>

        <div style={{ overflow: 'hidden', marginBottom: '2rem' }}>
          <TextReveal delay={0.2}>
            <h1 style={{
              fontSize: 'clamp(4rem, 12vw, 10rem)',
              color: 'var(--color-text)',
              margin: 0,
              lineHeight: 0.9,
            }}>
              RORO
            </h1>
          </TextReveal>
        </div>

        <TextReveal delay={0.3}>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--color-text-muted)',
            maxWidth: '400px',
            lineHeight: 1.6,
          }}>
            {aboutBio}
          </p>
        </TextReveal>

        <div style={{ marginTop: '3rem' }}>
          <TextReveal delay={0.4}>
            <MagneticButton>View Work</MagneticButton>
          </TextReveal>
        </div>
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          right: '5rem',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(0, 245, 160, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
<div className="profile-container" style={{ position: 'relative', width: '300px', height: '300px' }}>
          <img 
            src={theme === 'dark' ? '/images/Kironoa.png' : '/images/KironoaL.png'} 
            alt="Kironoa Roro" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
              border: '1px solid var(--color-border)',
              opacity: 1,
            }}
          />
        </div>
      </motion.div>
    </section>
  )
}

function AboutSection() {
  return (
    <section style={{ padding: '8rem 3rem' }}>
      <div className="container">
        <TextReveal>
          <h2 className="section-title">About</h2>
        </TextReveal>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
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

function ProjectsSection() {
  return (
    <section style={{ padding: '8rem 3rem', background: 'var(--color-bg-alt)' }}>
      <div className="container">
        <TextReveal>
          <h2 className="section-title">Projects</h2>
        </TextReveal>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem',
        }}>
          {projects.map((project, index) => (
            <BentoBox key={project.title}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  letterSpacing: '0.1em', 
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                }}>
                  {project.category}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  {project.year}
                </span>
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {project.title}
              </h3>
            </BentoBox>
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillsSection() {
  return (
    <section style={{ padding: '8rem 3rem' }}>
      <div className="container">
        <TextReveal>
          <h2 className="section-title">Skills</h2>
        </TextReveal>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
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
    <section style={{ padding: '8rem 3rem', background: 'var(--color-bg-alt)' }}>
      <div className="container">
        <TextReveal>
          <h2 className="section-title">Experience</h2>
        </TextReveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {experiences.map((exp, index) => (
            <BentoBox key={exp.role} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '2rem', alignItems: 'center' }}>
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

function ContactSection() {
  return (
    <section style={{ padding: '8rem 3rem' }}>
      <div className="container">
        <TextReveal>
          <h2 className="section-title">Contact</h2>
        </TextReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <BentoBox>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
              Available for freelance projects and collaborations. Let's create something remarkable together.
            </p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a
                  key={social}
                  href="#"
                  style={{
                    fontSize: '0.875rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '2px',
                    transition: 'border-color 0.3s, color 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-accent)'
                    e.currentTarget.style.color = 'var(--color-accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.color = 'inherit'
                  }}
                >
                  {social}
                </a>
              ))}
            </div>
          </BentoBox>
          
          <BentoBox>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Name"
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
              <input
                type="email"
                placeholder="Email"
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
              <MagneticButton>Send Message</MagneticButton>
            </form>
          </BentoBox>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ padding: '3rem', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
        © {new Date().getFullYear()} Kironoa Roro
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

function ThemeToggle({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const [bgIndex, setBgIndex] = useState(0)
  const backgrounds = ['/images/saogreen.png', '/images/saopurple.png', '/images/saored.png']

  useEffect(() => {
    if (theme === 'light') {
      const interval = setInterval(() => {
        setBgIndex((prev) => (prev + 1) % backgrounds.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [theme])

  return (
    <>
      {theme === 'light' && (
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
            transition: 'background-image 1s ease-in-out',
          }}
        />
      )}
      <button 
        className="theme-toggle" 
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  if (!mounted) return null

  return (
    <SmoothScroll>
      <PageTransition>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <CustomCursor />
        <HeroSection theme={theme} />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <ContactSection />
        <Footer />
      </PageTransition>
    </SmoothScroll>
  )
}