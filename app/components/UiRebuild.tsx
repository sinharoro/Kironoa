'use client'

import { useEffect, useRef, useState } from 'react'
import { drawSwarmCursor, loadSwarmCursor, SWARM_COLORS } from './swarmCursor'

const AGENT_COUNT = 5
const INTRO_MS = 1250
const FADE_MS = 500
const TEXT_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'P', 'SPAN'])

type TargetKind = 'box' | 'clone'

type Target = {
  node: HTMLElement
  wire: HTMLDivElement
  left: number
  top: number
  width: number
  height: number
  kind: TargetKind
}

type Task = Target & {
  agent: number
  start: number
  duration: number
  started?: boolean
}

type TrailPoint = { x: number; y: number }

export default function UiRebuild({ theme, onDone }: { theme: string; onDone?: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const finishRef = useRef<() => void>(() => {})
  const themeRef = useRef(theme)
  const onDoneRef = useRef(onDone)
  themeRef.current = theme
  onDoneRef.current = onDone
  const [done, setDone] = useState(false)

  useEffect(() => {
    const overlay = overlayRef.current
    const layer = layerRef.current
    const canvas = canvasRef.current
    if (!overlay || !layer || !canvas) return

    let notified = false
    const notifyDone = () => {
      if (notified) return
      notified = true
      setDone(true)
      onDoneRef.current?.()
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      notifyDone()
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      notifyDone()
      return
    }

    const root = document.documentElement
    const previousRootOverflow = root.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    root.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    root.classList.add('lenis-stopped')

    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    let disposed = false
    let fading = false
    let captured = false
    let tasks: Task[] = []
    let maxEnd = 0
    let cursorImage: HTMLImageElement | null = null

    loadSwarmCursor().then((image) => {
      cursorImage = image
    })

    const outline = themeRef.current === 'light' ? 'rgba(8, 12, 11, 0.6)' : 'rgba(255, 255, 255, 0.8)'
    const wireColor = themeRef.current === 'light' ? 'rgba(0, 139, 86, 0.42)' : 'rgba(0, 245, 160, 0.38)'
    const startedAt = performance.now()
    const introEnd = startedAt + INTRO_MS

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    const agents = Array.from({ length: AGENT_COUNT }, (_, index) => ({
      color: SWARM_COLORS[index % SWARM_COLORS.length],
      size: 30 + (index % 3) * 2,
      trail: [] as TrailPoint[],
    }))

    const drawTrail = (trail: TrailPoint[], color: string, alpha: number) => {
      if (trail.length < 2 || alpha <= 0) return
      context.lineCap = 'round'
      for (let index = 1; index < trail.length; index++) {
        const progress = index / trail.length
        context.globalAlpha = progress * progress * 0.3 * alpha
        context.strokeStyle = color
        context.lineWidth = 1.6 * progress
        context.beginPath()
        context.moveTo(trail[index - 1].x, trail[index - 1].y)
        context.lineTo(trail[index].x, trail[index].y)
        context.stroke()
      }
      context.globalAlpha = 1
    }

    const isVisible = (element: Element, style: CSSStyleDeclaration, rect: DOMRect) => {
      if (style.display === 'none' || style.visibility === 'hidden') return false
      if (parseFloat(style.opacity) < 0.05) return false
      if (style.position === 'fixed' && parseInt(style.zIndex || '0', 10) < 0) return false
      if (rect.width < 4 || rect.height < 4) return false
      if (rect.bottom <= 0 || rect.top >= height || rect.right <= 0 || rect.left >= width) return false
      return true
    }

    const hasBox = (style: CSSStyleDeclaration) => {
      const background = style.backgroundColor
      const backgroundVisible =
        background !== 'transparent' && !/rgba\(\s*\d+,\s*\d+,\s*\d+,\s*0\s*\)/.test(background)
      const borderVisible = ['Top', 'Right', 'Bottom', 'Left'].some((side) => {
        const widthValue = parseFloat(style[`border${side}Width` as 'borderTopWidth'])
        const borderStyle = style[`border${side}Style` as 'borderTopStyle']
        return widthValue > 0 && borderStyle !== 'none' && borderStyle !== 'hidden'
      })
      return backgroundVisible || borderVisible
    }

    const createWire = (rect: DOMRect) => {
      const wire = document.createElement('div')
      wire.style.position = 'fixed'
      wire.style.left = `${rect.left}px`
      wire.style.top = `${rect.top}px`
      wire.style.width = `${rect.width}px`
      wire.style.height = `${rect.height}px`
      wire.style.border = `1px dashed ${wireColor}`
      wire.style.borderRadius = '3px'
      wire.style.boxSizing = 'border-box'
      wire.style.pointerEvents = 'none'
      wire.style.opacity = '0'
      wire.style.transition = 'opacity 180ms ease'
      wire.dataset.uiRebuild = 'wire'
      layer.appendChild(wire)
      requestAnimationFrame(() => {
        if (!disposed) wire.style.opacity = '1'
      })
      return wire
    }

    const addClone = (element: Element, rect: DOMRect, targets: Target[]) => {
      const wire = createWire(rect)
      const clone = element.cloneNode(true) as HTMLElement
      clone.removeAttribute('id')
      clone.querySelectorAll('[id]').forEach((child) => child.removeAttribute('id'))
      clone.style.position = 'fixed'
      clone.style.inset = 'auto'
      clone.style.left = `${rect.left}px`
      clone.style.top = `${rect.top}px`
      clone.style.width = `${rect.width}px`
      clone.style.height = `${rect.height}px`
      clone.style.margin = '0'
      clone.style.transform = 'none'
      clone.style.opacity = '1'
      clone.style.zIndex = 'auto'
      clone.style.animation = 'none'
      clone.style.transition = 'none'
      clone.style.pointerEvents = 'none'
      clone.style.clipPath = 'inset(0 100% 0 0)'
      clone.style.willChange = 'clip-path'
      clone.dataset.uiRebuild = 'clone'
      layer.appendChild(clone)
      targets.push({
        node: clone,
        wire,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        kind: 'clone',
      })
    }

    const addBox = (style: CSSStyleDeclaration, rect: DOMRect, targets: Target[]) => {
      if (rect.width >= width * 0.95 && rect.height >= height * 0.95) return
      const wire = createWire(rect)
      const box = document.createElement('div')
      box.style.position = 'fixed'
      box.style.left = `${rect.left}px`
      box.style.top = `${rect.top}px`
      box.style.width = `${rect.width}px`
      box.style.height = `${rect.height}px`
      box.style.background = style.backgroundColor
      box.style.border = `${style.borderTopWidth} ${style.borderTopStyle} ${style.borderTopColor}`
      box.style.borderRadius = style.borderRadius
      box.style.boxShadow = style.boxShadow === 'none' ? '' : style.boxShadow
      box.style.backdropFilter = style.backdropFilter === 'none' ? '' : style.backdropFilter
      box.style.pointerEvents = 'none'
      box.style.clipPath = 'inset(0 100% 0 0)'
      box.style.willChange = 'clip-path'
      box.dataset.uiRebuild = 'box'
      layer.appendChild(box)
      targets.push({
        node: box,
        wire,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        kind: 'box',
      })
    }

    const capture = (): Target[] => {
      const targets: Target[] = []

      const walk = (element: Element) => {
        if (disposed || fading) return
        if (element === overlay || element === layer || element === canvas) return
        if (overlay.contains(element)) return
        const tag = element.tagName
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'CANVAS' || tag === 'SVG') {
          return
        }
        if (
          element.classList.contains('noise-overlay') ||
          element.classList.contains('cursor-dot') ||
          element.classList.contains('cursor-ring')
        ) {
          return
        }

        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        if (!isVisible(element, style, rect)) return

        if (tag === 'IMG' || tag === 'BUTTON' || tag === 'A' || TEXT_TAGS.has(tag)) {
          addClone(element, rect, targets)
          return
        }

        if (element.childElementCount === 0 && element.textContent && element.textContent.trim().length > 0) {
          addClone(element, rect, targets)
          return
        }

        if (hasBox(style)) addBox(style, rect, targets)

        for (const child of Array.from(element.children)) walk(child)
      }

      walk(document.body)
      return targets.sort((a, b) => a.top - b.top || a.left - b.left)
    }

    const schedule = (targets: Target[]) => {
      const nextStart = new Array(AGENT_COUNT).fill(0)
      const entries: Task[] = targets.map((target, index) => {
        const agent = index % AGENT_COUNT
        const duration = Math.max(350, Math.min(750, target.width * 0.4 + target.height * 0.25 + 100))
        const start = introEnd + 260 + agent * 130 + nextStart[agent] + Math.random() * 50
        nextStart[agent] = start - introEnd + duration + 100
        return { ...target, agent, start, duration }
      })
      maxEnd = entries.reduce((latest, entry) => Math.max(latest, entry.start + entry.duration), introEnd)
      return entries
    }

    const drawIntro = (now: number) => {
      const alpha = Math.min(1, (now - startedAt) / 300, Math.max(0, (introEnd - now) / 260))
      const radiusX = Math.min(width, height) * 0.21
      const radiusY = radiusX * 0.52
      agents.forEach((agent, index) => {
        const angle = now * 0.0012 + index * ((Math.PI * 2) / AGENT_COUNT)
        const x = width / 2 + Math.cos(angle) * radiusX
        const y = height * 0.42 + Math.sin(angle * 1.12 + index) * radiusY
        agent.trail.push({ x, y })
        if (agent.trail.length > 12) agent.trail.shift()
        drawTrail(agent.trail, agent.color, alpha)
        drawSwarmCursor(context, cursorImage, agent.color, x, y, agent.size, alpha, outline)
      })
    }

    const drawBuild = (now: number) => {
      let activeCount = 0
      for (const task of tasks) {
        const progress = Math.max(0, Math.min(1, (now - task.start) / task.duration))
        if (progress <= 0) continue

        if (!task.started) {
          task.started = true
          agents[task.agent].trail = []
        }

        task.wire.style.opacity = '0'

        if (progress >= 1) {
          if (task.node.style.clipPath !== 'none') task.node.style.clipPath = 'none'
          continue
        }
        activeCount++
        const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2
        task.node.style.clipPath = `inset(0 ${100 * (1 - eased)}% 0 0)`

        const agent = agents[task.agent]
        const x = task.left + task.width * eased
        const y = task.top + (task.kind === 'box' ? Math.min(10, task.height / 2) : task.height / 2)
        agent.trail.push({ x, y })
        if (agent.trail.length > 12) agent.trail.shift()

        context.save()
        context.setLineDash([4, 4])
        context.globalAlpha = 0.42
        context.strokeStyle = agent.color
        context.lineWidth = 1
        context.strokeRect(task.left + 0.5, task.top + 0.5, task.width - 1, task.height - 1)
        context.restore()

        context.save()
        context.globalAlpha = 0.55
        context.strokeStyle = agent.color
        context.lineWidth = 2
        context.shadowColor = agent.color
        context.shadowBlur = 14
        context.beginPath()
        context.moveTo(x, task.top)
        context.lineTo(x, task.top + task.height)
        context.stroke()
        context.restore()

        drawTrail(agent.trail, agent.color, 1)
        drawSwarmCursor(context, cursorImage, agent.color, x, y, agent.size, 1, outline)

        context.save()
        context.globalAlpha = 0.55
        context.strokeStyle = agent.color
        context.lineWidth = 1
        context.setLineDash([3, 5])
        context.lineDashOffset = -now * 0.02
        context.beginPath()
        context.arc(x, y, agent.size * 0.62, 0, Math.PI * 2)
        context.stroke()
        context.restore()
      }

      const bar = progressRef.current
      if (bar) {
        const span = Math.max(1, maxEnd - introEnd)
        const progress = Math.min(1, Math.max(0, (now - introEnd) / span))
        bar.style.transform = `scaleX(${progress})`
        if (labelRef.current) {
          labelRef.current.textContent =
            progress >= 1 ? 'UI build complete' : `Building UI · ${Math.round(progress * 100)}%`
        }
      }

      if (activeCount === 0 && now < maxEnd) {
        agents.forEach((agent) => {
          agent.trail = []
        })
      }
    }

    const frame = (now: number) => {
      if (disposed || fading) return
      context.clearRect(0, 0, width, height)

      if (now < introEnd) {
        drawIntro(now)
      } else {
        if (!captured) {
          captured = true
          agents.forEach((agent) => {
            agent.trail = []
          })
          if (progressRef.current) {
            progressRef.current.style.opacity = '1'
            progressRef.current.style.transform = 'scaleX(0)'
          }
          tasks = schedule(capture())
          if (tasks.length === 0) {
            finishRef.current()
            return
          }
        }
        drawBuild(now)
        if (now >= maxEnd + 450) {
          finishRef.current()
          return
        }
      }

      raf = requestAnimationFrame(frame)
    }

    let fadeTimer = 0

    const finish = () => {
      if (disposed || fading) return
      fading = true
      window.clearTimeout(fadeTimer)
      overlay.style.transition = `opacity ${FADE_MS}ms ease`
      overlay.style.opacity = '0'
      fadeTimer = window.setTimeout(() => {
        disposed = true
        cancelAnimationFrame(raf)
        root.style.overflow = previousRootOverflow
        document.body.style.overflow = previousBodyOverflow
        root.classList.remove('lenis-stopped')
        notifyDone()
      }, FADE_MS + 40)
    }

    finishRef.current = finish

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(frame)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.clearTimeout(fadeTimer)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', resize)
      root.style.overflow = previousRootOverflow
      document.body.style.overflow = previousBodyOverflow
      root.classList.remove('lenis-stopped')
      finishRef.current = () => {}
    }
  }, [])

  if (done) return null

  const lineColor = theme === 'light' ? 'rgba(0, 139, 86, 0.09)' : 'rgba(0, 245, 160, 0.07)'

  return (
    <div
      ref={overlayRef}
      data-ui-rebuild="overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        backgroundColor: 'var(--color-bg)',
        backgroundImage: `linear-gradient(${lineColor} 1px, transparent 1px), linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        overflow: 'hidden',
        transition: 'opacity 0.6s ease',
      }}
    >
      <div
        ref={progressRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '3px',
          background: 'var(--color-accent)',
          boxShadow: '0 0 12px var(--color-accent)',
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
          opacity: 0,
          zIndex: 8,
        }}
      />
      <div ref={layerRef} data-ui-rebuild="layer" aria-hidden="true" style={{ position: 'fixed', inset: 0, overflow: 'hidden' }} />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />
      <div
        ref={labelRef}
        className="rebuild-hud"
        style={{
          position: 'fixed',
          left: 'clamp(1rem, 3vw, 2rem)',
          zIndex: 6,
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: '0.625rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
        }}
      >
        Building UI · 0%
      </div>
      <button
        className="rebuild-hud"
        onClick={() => finishRef.current()}
        style={{
          position: 'fixed',
          right: 'clamp(1rem, 3vw, 2rem)',
          zIndex: 7,
          padding: '0.55rem 0.9rem',
          border: '1px solid var(--color-border)',
          borderRadius: '6px',
          background: 'var(--color-bg-alt)',
          color: 'var(--color-text-muted)',
          fontSize: '0.625rem',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        Skip
      </button>
    </div>
  )
}
