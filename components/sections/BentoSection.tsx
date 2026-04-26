'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Sortable from 'sortablejs'
import MagneticHeader from '@/components/ui/MagneticHeader'
import TimeCard from '@/components/cards/TimeCard'
import ProfileCard from '@/components/cards/ProfileCard'
import LivePulseStatusCard from '@/components/cards/LivePulseStatusCard'
import HarmonyCard from '@/components/cards/HarmonyCard'
import ContactCard from '@/components/cards/ContactCard'
import SkillsCard from '@/components/cards/SkillsCard'
import MusicCard from '@/components/cards/MusicCard'
import GameCard from '@/components/cards/GameCard'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 22,
    },
  },
}

const cardOrder = [
  { children: <TimeCard />, colSpan: 'col-span-1 sm:col-span-2' },
  { children: <ProfileCard />, colSpan: '' },
  { children: <LivePulseStatusCard />, colSpan: '' },
  { children: <SkillsCard />, colSpan: '' },
  { children: <HarmonyCard />, colSpan: '' },
  { children: <ContactCard />, colSpan: '' },
  { children: <div className="glass-card p-6 sm:p-8 cursor-default"><h3 className="font-semibold mb-1">Reminder</h3><p className="text-sm opacity-60">You can click and drag the cards.</p></div>, colSpan: '' },
  { children: <GameCard />, colSpan: '' },
  { children: <MusicCard />, colSpan: '' },
]

function BentoCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      whileTap={{ scale: 0.98 }}
      className="bento-card"
    >
      {children}
    </motion.div>
  )
}

export default function BentoSection() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return
    const sortable = Sortable.create(gridRef.current, {
      animation: 300,
      handle: '.glass-card',
      ghostClass: 'sortable-ghost',
    })
    return () => sortable.destroy()
  }, [])

  return (
    <section id="bento-section" className="portfolio-section">
      <motion.div
        className="hero-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <p className="font-mono">Portfolio · 2025</p>
        <MagneticHeader strength={20}>
          KIRO<br />
          <em className="text-orange-400 italic" style={{ WebkitTextFillColor: 'initial' }}>NOA</em>
        </MagneticHeader>
        <p className="subtitle tracking-[0.2em]">
          Full Stack Developer · Vibe Coder · Computer Science
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-[1200px] px-4"
        ref={gridRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cardOrder.map((card, i) => (
          <motion.div
            key={i}
            className={card.colSpan}
            variants={itemVariants}
            layout
          >
            <BentoCard>{card.children}</BentoCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}