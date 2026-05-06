'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, X } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Seasons', href: '#seasons' },
  { label: 'Interests', href: '#interests' },
  { label: 'Games', href: '#games' },
  { label: 'Contact', href: '#contact' },
]

const aboutBio = `I'm a creative professional passionate about crafting meaningful digital experiences. With a focus on thoughtful design and clean code, I bring ideas to life through a blend of technical skill and artistic vision. I believe in the power of simplicity—of stripping away the unnecessary to reveal what truly matters.`

const projects = [
  {
    title: 'Brand Identity System',
    category: 'Design',
    description: 'A comprehensive brand identity for a modern lifestyle company, including logo, typography, and visual guidelines.',
    year: '2024',
  },
  {
    title: 'E-Commerce Platform',
    category: 'Development',
    description: 'A seamless shopping experience built with modern web technologies, focused on performance and user delight.',
    year: '2024',
  },
  {
    title: 'Editorial Design',
    category: 'Design',
    description: 'A magazine layout system combining traditional print aesthetics with digital interactivity.',
    year: '2023',
  },
  {
    title: 'Mobile Application',
    category: 'Development',
    description: 'An intuitive mobile app designed to simplify daily workflows with elegant UX solutions.',
    year: '2023',
  },
]

const skills = [
  { name: 'UI/UX Design', level: 95 },
  { name: 'Frontend Development', level: 90 },
  { name: 'Brand Strategy', level: 85 },
  { name: 'Motion Design', level: 80 },
  { name: 'Content Creation', level: 85 },
]

const experiences = [
  {
    role: 'Senior Creative Developer',
    company: 'Studio Nexus',
    period: '2022 — Present',
    description: 'Leading creative direction and technical implementation for premium client projects.',
  },
  {
    role: 'Creative Technologist',
    company: 'Digital Craft Co.',
    period: '2020 — 2022',
    description: 'Developed interactive experiences and innovative digital solutions for global brands.',
  },
  {
    role: 'UI Designer',
    company: 'Minimalist Labs',
    period: '2018 — 2020',
    description: 'Designed clean, purposeful interfaces for web and mobile applications.',
  },
]

const tracks = [
  { name: 'Bloody Ice', src: '/sounds/Bloody_Ice.mp3' },
  { name: 'Desert Scream', src: '/sounds/Desert_Scream.mp3' },
  { name: 'Green Despair', src: '/sounds/Green_Despair.mp3' },
  { name: 'Port Lux', src: '/sounds/Port_Lux.mp3' },
]

const seasonalImages = [
  { name: 'Spring', src: '/images/spring.jpg', color: '#90c9a7' },
  { name: 'Summer', src: '/images/summer.jpg', color: '#f4d35e' },
  { name: 'Autumn', src: '/images/autumn.jpg', color: '#d4853f' },
  { name: 'Winter', src: '/images/winter.jpg', color: '#a8c6d9' },
]

const saoVariants = [
  { name: 'Red', src: '/images/saored.png', color: '#e63946' },
  { name: 'Green', src: '/images/saogreen.png', color: '#2a9d8f' },
  { name: 'Purple', src: '/images/saopurple.png', color: '#7b2cbf' },
]

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      style={{
        scaleX,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'var(--color-accent)',
        transformOrigin: '0%',
        zIndex: 200,
      }}
    />
  )
}

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: -1,
      }}>
        <motion.img
          src="/images/bg.png"
          alt="Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            y,
            opacity: 0.15,
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(250,249,247,0.95) 0%, rgba(243,241,238,0.9) 100%)',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ zIndex: 1 }}
      >
        <motion.div
          style={{ y }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <img
            src="/images/Kiro.png"
            alt="Kiro - Portrait"
            style={{
              width: '280px',
              height: '280px',
              objectFit: 'cover',
              borderRadius: '50%',
              marginBottom: '2rem',
              boxShadow: '0 40px 80px rgba(26,26,26,0.15)',
            }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            fontSize: '0.875rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: '1.5rem',
          }}
        >
          Creative Professional
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            marginBottom: '1.5rem',
            maxWidth: '800px',
            margin: '0 auto 1.5rem',
          }}
        >
          Crafting digital experiences with intention
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-muted)',
            maxWidth: '500px',
            margin: '0 auto 2.5rem',
          }}
        >
          I design and build thoughtful solutions that blend aesthetics with functionality
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
        >
          <a href="#projects" className="btn">View Work</a>
          <a href="#contact" className="btn" style={{ background: 'var(--color-text)', color: 'var(--color-bg)' }}>Get in Touch</a>
        </motion.div>
      </motion.div>
    </section>
  )
}

function Nav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '1.5rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: scrolled ? 'rgba(250, 249, 247, 0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <a href="#">
        <img src="/images/MyLogo.png" alt="Logo" style={{ height: '40px' }} />
      </a>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              fontSize: '0.875rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              opacity: 0.7,
              transition: 'opacity 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

function SectionWrapper({ children, id, background, className }: { children: React.ReactNode; id?: string; background?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ padding: '6rem 0', background }}
    >
      {children}
    </motion.section>
  )
}

function AboutSection() {
  return (
    <SectionWrapper id="about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
            style={{ aspectRatio: '4/5', overflow: 'hidden', borderRadius: '4px' }}
          >
            <img
              src="/images/Kiro.png"
              alt="Kiro - Portrait"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </motion.div>
          <div>
            <p style={{ fontSize: '1.25rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>{aboutBio}</p>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Based in Tokyo • Available for freelance projects and collaborations
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

function ProjectsSection() {
  return (
    <SectionWrapper id="projects" background="var(--color-bg-alt)">
      <div className="container">
        <h2 className="section-title">Projects</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
              style={{
                background: 'var(--color-bg)',
                padding: '2rem',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <p style={{
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: '0.75rem',
              }}>
                {project.category} • {project.year}
              </p>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{project.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>{project.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

function SkillsSection() {
  return (
    <SectionWrapper id="skills">
      <div className="container">
        <h2 className="section-title">Skills</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1rem' }}>{skill.name}</span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{skill.level}%</span>
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
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

function SeasonsSection() {
  const [activeSeason, setActiveSeason] = useState<string | null>(null)

  return (
    <SectionWrapper id="seasons" background={activeSeason ? seasonalImages.find(s => s.name === activeSeason)?.color + '22' : undefined}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <img src="/images/4seasons.png" alt="Four Seasons" style={{ maxWidth: '300px', height: 'auto' }} />
          <h2 className="section-title" style={{ marginTop: '1rem' }}>Aesthetic Moods</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {seasonalImages.map((season, index) => (
            <motion.div
              key={season.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setActiveSeason(season.name)}
              onHoverEnd={() => setActiveSeason(null)}
              style={{
                aspectRatio: '3/4',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <img
                src={season.src}
                alt={season.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1.5rem',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                color: 'white',
              }}>
                <h3 style={{ fontSize: '1.5rem' }}>{season.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

function SAOSection() {
  const [activeVariant, setActiveVariant] = useState(0)

  return (
    <SectionWrapper id="interests" background="var(--color-bg-alt)">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 className="section-title">Interests & Inspirations</h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
            Exploring the worlds that shape my creativity
          </p>
        </motion.div>

        <div style={{
          position: 'relative',
          padding: '4rem 2rem',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '3rem',
        }}>
          <img
            src="/images/saobg.jpg"
            alt="SAO Background"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.3,
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVariant}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                style={{ textAlign: 'center' }}
              >
                <img
                  src="/images/sao.png"
                  alt="SAO"
                  style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '1rem' }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            {saoVariants.map((variant, index) => (
              <motion.button
                key={variant.name}
                onClick={() => setActiveVariant(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  background: activeVariant === index ? variant.color : 'rgba(255,255,255,0.1)',
                  color: activeVariant === index ? 'white' : 'var(--color-text)',
                  border: `2px solid ${variant.color}`,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                {variant.name}
              </motion.button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{ textAlign: 'center' }}
          >
            <img
              src="/images/keshi.png"
              alt="Keshi"
              style={{ width: '100%', maxWidth: '200px', height: 'auto', marginBottom: '1rem' }}
            />
            <p style={{ fontWeight: 500 }}>Keshi</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{ textAlign: 'center' }}
          >
            <img
              src="/images/saopic.jpg"
              alt="SAO Picture"
              style={{ width: '100%', maxWidth: '200px', height: 'auto', marginBottom: '1rem' }}
            />
            <p style={{ fontWeight: 500 }}>Aincrad</p>
          </motion.div>
          {saoVariants.map((variant) => (
            <motion.div
              key={variant.name}
              whileHover={{ scale: 1.05 }}
              style={{ textAlign: 'center' }}
            >
              <img
                src={variant.src}
                alt={variant.name}
                style={{ width: '100%', maxWidth: '200px', height: 'auto', marginBottom: '1rem' }}
              />
              <p style={{ fontWeight: 500 }}>{variant.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

function ExperienceSection() {
  return (
    <SectionWrapper id="experience" background="var(--color-bg-alt)">
      <div className="container">
        <h2 className="section-title">Experience</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.role}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 1fr',
                gap: '2rem',
                paddingBottom: index < experiences.length - 1 ? '2.5rem' : 0,
                borderBottom: index < experiences.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{exp.period}</span>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{exp.role}</h3>
                <p style={{ color: 'var(--color-accent)', marginBottom: '0.75rem' }}>{exp.company}</p>
                <p style={{ color: 'var(--color-text-muted)' }}>{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

function GamesSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SectionWrapper id="games">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 className="section-title">Mini Games</h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
            Take a break and enjoy some classic arcade action
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="btn"
          style={{ display: 'block', margin: '0 auto', fontSize: '1rem', padding: '1.5rem 3rem' }}
        >
          Play Space Invaders
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.9)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'absolute',
                  top: '2rem',
                  right: '2rem',
                  padding: '1rem',
                  background: 'white',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
              >
                <X size={24} />
              </motion.button>
              <iframe
                src="/games/SI.html"
                title="Space Invaders"
                style={{
                  width: '800px',
                  height: '600px',
                  border: 'none',
                  background: 'black',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  )
}

function ContactSection() {
  return (
    <SectionWrapper id="contact">
      <div className="container">
        <h2 className="section-title">Get in Touch</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
          <div>
            <p style={{ fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '400px' }}>
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
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
                    transition: 'border-color 0.3s',
                  }}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ fontSize: '0.875rem' }}>Name</label>
              <input
                type="text"
                id="name"
                style={{
                  padding: '1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0',
                  background: 'transparent',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="email" style={{ fontSize: '0.875rem' }}>Email</label>
              <input
                type="email"
                id="email"
                style={{
                  padding: '1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0',
                  background: 'transparent',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="message" style={{ fontSize: '0.875rem' }}>Message</label>
              <textarea
                id="message"
                rows={5}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0',
                  background: 'transparent',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>
            <button type="submit" className="btn" style={{ alignSelf: 'flex-start', background: 'var(--color-text)', color: 'var(--color-bg)' }}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </SectionWrapper>
  )
}

function Footer() {
  return (
    <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <img src="/images/minilogoKR.png" alt="Mini Logo" style={{ height: '30px' }} />
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          &copy; {new Date().getFullYear()} Kironoa. Crafted with intention.
        </p>
      </div>
    </footer>
  )
}

function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const playTrack = useCallback((index: number) => {
    if (audioRef.current) {
      audioRef.current.src = tracks[index].src
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {
        setIsPlaying(false)
      })
    }
  }, [])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      if (audioRef.current.src) {
        audioRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch(() => {})
      } else {
        playTrack(0)
      }
    }
  }

  const nextTrack = () => {
    const next = (currentTrack + 1) % tracks.length
    setCurrentTrack(next)
    playTrack(next)
  }

  const prevTrack = () => {
    const prev = (currentTrack - 1 + tracks.length) % tracks.length
    setCurrentTrack(prev)
    playTrack(prev)
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 50,
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      }}
    >
      <audio ref={audioRef} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {isPlaying && (
          <img
            src="/images/music_listening.gif"
            alt="Now Playing"
            style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}
          />
        )}
      </div>

      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Now Playing
        </p>
        <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{tracks[currentTrack].name}</p>
      </div>

      <div style={{ display: 'flex', gap: '0.25rem' }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={prevTrack}
          style={{ padding: '0.5rem', cursor: 'pointer' }}
        >
          <SkipBack size={18} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          style={{ padding: '0.5rem', cursor: 'pointer', background: 'var(--color-accent)', borderRadius: '50%', color: 'white' }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={nextTrack}
          style={{ padding: '0.5rem', cursor: 'pointer' }}
        >
          <SkipForward size={18} />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <ScrollProgress />
      <Nav scrolled={scrolled} />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <SeasonsSection />
      <SAOSection />
      <ExperienceSection />
      <GamesSection />
      <ContactSection />
      <Footer />
      <MusicPlayer />
      <style>{`
        @media (max-width: 768px) {
          nav div { display: none !important; }
          #experience > div {
            grid-template-columns: 1fr !important;
            gap: 0.5rem !important;
          }
        }
      `}</style>
    </>
  )
}