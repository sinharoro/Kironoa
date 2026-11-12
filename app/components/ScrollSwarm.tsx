'use client'

import { useEffect, useRef } from 'react'
import { drawSwarmCursor, loadSwarmCursor, SWARM_COLORS } from './swarmCursor'

type TrailPoint = { x: number; y: number }

type Agent = {
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
  nextTarget: number
  size: number
  color: string
  alpha: number
  seed: number
  trail: TrailPoint[]
}

export default function ScrollSwarm({ theme }: { theme: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    let running = false
    let cursorImage: HTMLImageElement | null = null

    loadSwarmCursor().then((image) => {
      cursorImage = image
    })

    const outline = theme === 'light' ? 'rgba(8, 12, 11, 0.6)' : 'rgba(255, 255, 255, 0.8)'

    const randomTarget = (dir: number) => {
      const bias = dir >= 0 ? 0.64 : 0.36
      return {
        x: 40 + Math.random() * (width - 80),
        y: height * (bias - 0.24 + Math.random() * 0.48),
      }
    }

    const makeAgent = (): Agent => {
      const target = randomTarget(1)
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        tx: target.x,
        ty: target.y,
        nextTarget: 0,
        size: 18 + Math.random() * 12,
        color: SWARM_COLORS[Math.floor(Math.random() * SWARM_COLORS.length)],
        alpha: 0,
        seed: Math.random() * Math.PI * 2,
        trail: [],
      }
    }

    const agentCount = Math.max(8, Math.min(16, Math.round(width / 110)))
    const agents: Agent[] = Array.from({ length: agentCount }, makeAgent)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    let lastY = window.scrollY
    let lastEvent = performance.now()
    let activeUntil = 0
    let lastBurst = 0
    let scrollDir = 1

    const drawTrail = (agent: Agent) => {
      const points = agent.trail
      if (points.length < 2 || agent.alpha < 0.01) return
      ctx.lineCap = 'round'
      for (let i = 1; i < points.length; i++) {
        const progress = i / points.length
        ctx.globalAlpha = progress * progress * 0.3 * agent.alpha
        ctx.strokeStyle = agent.color
        ctx.lineWidth = 1.6 * progress
        ctx.beginPath()
        ctx.moveTo(points[i - 1].x, points[i - 1].y)
        ctx.lineTo(points[i].x, points[i].y)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    const frame = (now: number) => {
      const idle = now > activeUntil

      for (const agent of agents) {
        if (!idle) {
          const dx = agent.tx - agent.x
          const dy = agent.ty - agent.y
          const distance = Math.hypot(dx, dy)
          if (distance < 18 || now > agent.nextTarget) {
            const target = randomTarget(scrollDir)
            agent.tx = target.x
            agent.ty = target.y
            agent.nextTarget = now + 800 + Math.random() * 1100
          }
          agent.vx += dx * 0.0022
          agent.vy += dy * 0.0022
          agent.vx += Math.sin(now * 0.0011 + agent.seed) * 0.06
          agent.vy += Math.cos(now * 0.0013 + agent.seed * 1.7) * 0.06
        }

        agent.vx *= 0.92
        agent.vy *= 0.92
        const speed = Math.hypot(agent.vx, agent.vy)
        if (speed > 13) {
          agent.vx = (agent.vx / speed) * 13
          agent.vy = (agent.vy / speed) * 13
        }

        agent.x += agent.vx
        agent.y += agent.vy

        if (agent.x < -30) agent.x = width + 30
        if (agent.x > width + 30) agent.x = -30
        if (agent.y < -40) agent.y = height + 40
        if (agent.y > height + 40) agent.y = -40

        const goal = idle ? 0 : 1
        agent.alpha += (goal - agent.alpha) * (idle ? 0.055 : 0.11)

        if (!idle) {
          agent.trail.push({ x: agent.x, y: agent.y })
          if (agent.trail.length > 9) agent.trail.shift()
        } else if (agent.trail.length > 0 && Math.random() > 0.9) {
          agent.trail.shift()
        }
      }

      for (let i = 0; i < agents.length; i++) {
        for (let j = i + 1; j < agents.length; j++) {
          const a = agents[i]
          const b = agents[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const distance = Math.hypot(dx, dy)
          if (distance > 0 && distance < 62) {
            const push = ((62 - distance) / 62) * 0.6
            a.vx -= (dx / distance) * push
            a.vy -= (dy / distance) * push
            b.vx += (dx / distance) * push
            b.vy += (dy / distance) * push
          }
        }
      }

      ctx.clearRect(0, 0, width, height)
      for (const agent of agents) drawTrail(agent)
      for (const agent of agents) {
        drawSwarmCursor(ctx, cursorImage, agent.color, agent.x, agent.y, agent.size, agent.alpha, outline)
      }

      const stillFading = agents.some((agent) => agent.alpha > 0.02)
      if (idle && !stillFading) {
        for (const agent of agents) {
          agent.alpha = 0
          agent.trail = []
        }
        ctx.clearRect(0, 0, width, height)
        running = false
        return
      }
      raf = requestAnimationFrame(frame)
    }

    const ensureLoop = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(frame)
    }

    const onScroll = () => {
      const now = performance.now()
      const y = window.scrollY
      const delta = y - lastY
      lastY = y
      if (Math.abs(delta) < 1) return

      const elapsed = Math.max(16, now - lastEvent)
      lastEvent = now
      const speed = Math.abs(delta) / elapsed
      scrollDir = delta >= 0 ? 1 : -1
      activeUntil = now + 800 + Math.min(700, speed * 900)

      if (now - lastBurst > 55) {
        lastBurst = now
        const burst = Math.min(7, 2 + Math.round(Math.abs(delta) / 16 + speed * 2))
        for (let i = 0; i < burst; i++) {
          const agent = agents[Math.floor(Math.random() * agents.length)]
          const target = randomTarget(scrollDir)
          agent.tx = target.x
          agent.ty = target.y
          agent.nextTarget = now + 800 + Math.random() * 1100
        }
      }

      ensureLoop()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
      ctx.clearRect(0, 0, width, height)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9998,
      }}
    />
  )
}
