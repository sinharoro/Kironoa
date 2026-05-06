'use client'

import { useEffect, useRef, useState } from 'react'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
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

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <>
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
        <a href="#" style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.25rem',
          fontWeight: 500,
        }}>
          Portfolio
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

      <section
        ref={heroRef}
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
          background: 'linear-gradient(135deg, #faf9f7 0%, #f3f1ee 100%)',
        }}
      >
        <div className="container">
          <p
            className="fade-in stagger-1"
            style={{
              fontSize: '0.875rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: '1.5rem',
            }}
          >
            Creative Professional
          </p>
          <h1
            className="fade-in stagger-2"
            style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              marginBottom: '1.5rem',
              maxWidth: '800px',
              margin: '0 auto 1.5rem',
            }}
          >
            Crafting digital experiences with intention
          </h1>
          <p
            className="fade-in stagger-3"
            style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-muted)',
              maxWidth: '500px',
              margin: '0 auto 2.5rem',
            }}
          >
            I design and build thoughtful solutions that blend aesthetics with functionality
          </p>
          <div className="fade-in stagger-4" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="#projects" className="btn">
              View Work
            </a>
            <a href="#contact" className="btn" style={{ background: 'var(--color-text)', color: 'var(--color-bg)' }}>
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="section animate-on-scroll">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            <div style={{ aspectRatio: '4/5', background: 'var(--color-bg-alt)', borderRadius: '4px' }}>
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.5rem',
                fontStyle: 'italic',
              }}>
                Your Photo
              </div>
            </div>
            <div>
              <p style={{ fontSize: '1.25rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>{aboutBio}</p>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Based in [Location] • Available for freelance projects and collaborations
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <h2 className="section-title">Projects</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {projects.map((project, index) => (
              <article
                key={project.title}
                className="animate-on-scroll"
                style={{
                  background: 'var(--color-bg)',
                  padding: '2rem',
                  borderRadius: '4px',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
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
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="section animate-on-scroll">
        <div className="container">
          <h2 className="section-title">Skills</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
            {skills.map((skill) => (
              <div key={skill.name}>
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
                  <div style={{
                    height: '100%',
                    width: `${skill.level}%`,
                    background: 'var(--color-accent)',
                    borderRadius: '2px',
                    transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <h2 className="section-title">Experience</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {experiences.map((exp, index) => (
              <div
                key={exp.role}
                className="animate-on-scroll"
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
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section animate-on-scroll">
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
      </section>

      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          © {new Date().getFullYear()} Portfolio. Crafted with intention.
        </p>
      </footer>

      <style>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 768px) {
          nav div { display: none !important; }
          #experience .animate-on-scroll {
            grid-template-columns: 1fr !important;
            gap: 0.5rem !important;
          }
        }
      `}</style>
    </>
  )
}