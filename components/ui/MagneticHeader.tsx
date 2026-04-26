'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MagneticHeaderProps {
  children: React.ReactNode
  strength?: number
}

export default function MagneticHeader({ children, strength = 20 }: MagneticHeaderProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150, mass: 0.5 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (e.clientX - centerX) / rect.width
      const deltaY = (e.clientY - centerY) / rect.height
      
      const moveX = deltaX * strength
      const moveY = deltaY * strength
      
      x.set(-moveX)
      y.set(-moveY)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    window.addEventListener('mousemove', handleMouseMove)
    ref.current?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      ref.current?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength, x, y])

  return (
    <motion.h1
      ref={ref}
      style={{ x: springX, y: springY }}
      className="magnetic-title"
    >
      {children}
    </motion.h1>
  )
}