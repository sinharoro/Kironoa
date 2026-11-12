'use client'

import { useEffect, useRef } from 'react'
import { drawSwarmCursor, loadSwarmCursor, SWARM_COLORS } from './swarmCursor'

const AGENT_COUNT = 5
const FADE_MS = 400
const MAX_BUILD_MS = 3600
const TEXT_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'P', 'SPAN'])
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CANVAS', 'SVG'])

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

export default function SectionRebuild({ name, enabled }: { name: string; enabled: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const host = hostRef.current
    const layer = layerRef.current
    const canvas = canvasRef.current
    const bar = barRef.current
    const label = labelRef.current
    if (!host || !layer || !canvas || !bar || !label) return

    const section = host.parentElement
    if (!section) return

    const context = canvas.getContext('2d')
    if (!context) return

    const theme = document.documentElement.getAttribute('data-theme')
    const outline = theme === 'light' ? 'rgba(8, 12, 11, 0.6)' : 'rgba(255, 255, 255, 0.8)'
    const wireColor = theme === 'light' ? 'rgba(0, 139, 86, 0.42)' : 'rgba(0, 245, 160, 0.38)'

    let sectionWidth = 0
    let sectionHeight = 0
    let dpr = 1
    let raf = 0
    let fadeTimer = 0
    let prepared = false
    let started = false
    let fading = false
    let observer: IntersectionObserver | null = null
    let done = false
    let disposed = false
    let targets: Target[] = []
    let tasks: Task[] = []
    let buildStart = 0
    let maxEnd = 0
    let cursorImage: HTMLImageElement | null = null

    loadSwarmCursor().then((image) => {
      cursorImage = image
    })

    const agents = Array.from({ length: AGENT_COUNT }, (_, index) => ({
      color: SWARM_COLORS[index % SWARM_COLORS.length],
      size: 28 + (index % 3) * 2,
      trail: [] as TrailPoint[],
    }))

    const measure = () => {
      sectionWidth = section.clientWidth
      sectionHeight = section.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(sectionWidth * dpr)
      canvas.height = Math.floor(sectionHeight * dpr)
      canvas.style.width = `${sectionWidth}px`
      canvas.style.height = `${sectionHeight}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

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

    const localPosition = (element: HTMLElement) => {
      let x = 0
      let y = 0
      let node: HTMLElement | null = element

      while (node && node !== section) {
        x += node.offsetLeft
        y += node.offsetTop
        const parent = node.offsetParent as HTMLElement | null
        if (!parent) break
        node = parent
      }

      if (node !== section) {
        const elementRect = element.getBoundingClientRect()
        const sectionRect = section.getBoundingClientRect()
        return {
          left: elementRect.left - sectionRect.left,
          top: elementRect.top - sectionRect.top,
          width: element.offsetWidth,
          height: element.offsetHeight,
        }
      }

      return { left: x, top: y, width: element.offsetWidth, height: element.offsetHeight }
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

    const createWire = (target: Omit<Target, 'wire' | 'kind' | 'node'>) => {
      const wire = document.createElement('div')
      wire.style.position = 'absolute'
      wire.style.left = `${target.left}px`
      wire.style.top = `${target.top}px`
      wire.style.width = `${target.width}px`
      wire.style.height = `${target.height}px`
      wire.style.border = `1px dashed ${wireColor}`
      wire.style.borderRadius = '3px'
      wire.style.boxSizing = 'border-box'
      wire.style.pointerEvents = 'none'
      wire.style.opacity = '0'
      wire.style.transition = 'opacity 180ms ease'
      wire.dataset.sectionBuild = 'wire'
      layer.appendChild(wire)
      requestAnimationFrame(() => {
        if (!disposed && !done) wire.style.opacity = '1'
      })
      return wire
    }

    const addClone = (element: Element, rect: { left: number; top: number; width: number; height: number }, targets: Target[]) => {
      const wire = createWire(rect)
      const clone = element.cloneNode(true) as HTMLElement
      clone.removeAttribute('id')
      clone.querySelectorAll('[id]').forEach((child) => child.removeAttribute('id'))
      clone.querySelectorAll('img').forEach((image) => {
        image.loading = 'eager'
        image.decoding = 'async'
      })
      clone.style.position = 'absolute'
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
      clone.dataset.sectionBuild = 'clone'
      layer.appendChild(clone)
      targets.push({ node: clone, wire, ...rect, kind: 'clone' })
    }

    const addBox = (style: CSSStyleDeclaration, rect: { left: number; top: number; width: number; height: number }, targets: Target[]) => {
      if (rect.width >= sectionWidth * 0.96 && rect.height >= sectionHeight * 0.96) return
      const wire = createWire(rect)
      const box = document.createElement('div')
      box.style.position = 'absolute'
      box.style.left = `${rect.left}px`
      box.style.top = `${rect.top}px`
      box.style.width = `${rect.width}px`
      box.style.height = `${rect.height}px`
      box.style.boxSizing = 'border-box'
      box.style.background = style.backgroundColor
      box.style.border = `${style.borderTopWidth} ${style.borderTopStyle} ${style.borderTopColor}`
      box.style.borderRadius = style.borderRadius
      box.style.boxShadow = style.boxShadow === 'none' ? '' : style.boxShadow
      box.style.backdropFilter = style.backdropFilter === 'none' ? '' : style.backdropFilter
      box.style.pointerEvents = 'none'
      box.style.clipPath = 'inset(0 100% 0 0)'
      box.style.willChange = 'clip-path'
      box.dataset.sectionBuild = 'box'
      layer.appendChild(box)
      targets.push({ node: box, wire, ...rect, kind: 'box' })
    }

    const capture = (): Target[] => {
      const targets: Target[] = []

      const walk = (element: Element) => {
        if (disposed || done) return
        if (element === host || element === layer || element === canvas) return
        if (host.contains(element)) return
        const tag = element.tagName
        if (SKIP_TAGS.has(tag)) return
        if (
          element.classList.contains('noise-overlay') ||
          element.classList.contains('cursor-dot') ||
          element.classList.contains('cursor-ring')
        ) {
          return
        }

        const style = getComputedStyle(element)
        if (style.display === 'none' || style.visibility === 'hidden') return
        if (style.position === 'fixed' || style.position === 'sticky') return

        const rect = localPosition(element as HTMLElement)
        if (rect.width < 4 || rect.height < 4) {
          for (const child of Array.from(element.children)) walk(child)
          return
        }

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

      for (const child of Array.from(section.children)) {
        if (child !== host) walk(child)
      }

      return targets.sort((a, b) => a.top - b.top || a.left - b.left)
    }

    const schedule = (targets: Target[], anchor: number) => {
      const nextStart = new Array(AGENT_COUNT).fill(0)
      const entries: Task[] = targets.map((target, index) => {
        const agent = index % AGENT_COUNT
        const duration = Math.max(340, Math.min(680, target.width * 0.4 + target.height * 0.22 + 100))
        const start = anchor + agent * 150 + nextStart[agent] + Math.random() * 40
        nextStart[agent] = start - anchor + duration + 80
        return { ...target, agent, start, duration }
      })

      const rawEnd = entries.reduce((latest, entry) => Math.max(latest, entry.start + entry.duration), anchor)
      const total = rawEnd - anchor
      if (total > MAX_BUILD_MS) {
        const ratio = MAX_BUILD_MS / total
        for (const entry of entries) {
          entry.start = anchor + (entry.start - anchor) * ratio
          entry.duration *= ratio
        }
      }

      maxEnd = entries.reduce((latest, entry) => Math.max(latest, entry.start + entry.duration), anchor)
      return entries
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

      const span = Math.max(1, maxEnd - buildStart)
      const progress = Math.min(1, Math.max(0, (now - buildStart) / span))
      bar.style.transform = `scaleX(${progress})`
      label.textContent =
        progress >= 1 ? 'Build complete' : `Building ${name} · ${Math.round(progress * 100)}%`

      if (activeCount === 0 && now < maxEnd) {
        agents.forEach((agent) => {
          agent.trail = []
        })
      }
    }

    let finished = false

    const finish = () => {
      if (disposed || fading || finished) return
      finished = true
      fading = true
      observer?.disconnect()
      window.clearTimeout(fadeTimer)
      cancelAnimationFrame(raf)
      context.clearRect(0, 0, sectionWidth, sectionHeight)
      section.classList.remove('section-rebuilding')

      host.style.transition = `opacity ${FADE_MS}ms ease`
      host.style.opacity = '0'
      fadeTimer = window.setTimeout(() => {
        host.style.display = 'none'
        host.style.opacity = ''
        host.style.transition = ''
        layer.replaceChildren()
        canvas.width = 0
        canvas.height = 0
        bar.style.transform = 'scaleX(0)'
        done = true
      }, FADE_MS + 30)
    }

    const frame = (now: number) => {
      if (disposed || fading || done) return
      context.clearRect(0, 0, sectionWidth, sectionHeight)

      drawBuild(now)

      if (now >= maxEnd + 320) {
        finish()
        return
      }

      raf = requestAnimationFrame(frame)
    }

    const prepare = () => {
      if (prepared || done || disposed) return
      prepared = true

      measure()

      targets = capture()
      if (targets.length === 0) {
        done = true
        return
      }

      section.classList.add('section-rebuilding')
      host.style.display = 'block'
      host.style.opacity = '1'
      label.textContent = `Building ${name} · 0%`
      bar.style.transform = 'scaleX(0)'
    }

    const startBuild = () => {
      if (!prepared || started || fading || done || disposed) return
      started = true
      buildStart = performance.now() + 450
      tasks = schedule(targets, buildStart)
      raf = requestAnimationFrame(frame)
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (!prepared) prepare()
          if (done) {
            observer?.disconnect()
            return
          }
          const enoughVisible =
            entry.intersectionRatio >= 0.22 ||
            entry.boundingClientRect.top <= window.innerHeight * 0.72
          if (enoughVisible) {
            startBuild()
            observer?.disconnect()
            return
          }
        }
      },
      {
        rootMargin: '0px 0px 2% 0px',
        threshold: [0, 0.22, 0.5, 0.75, 1],
      }
    )

    const onResize = () => {
      if (prepared && !done && Math.abs(section.clientWidth - sectionWidth) > 2) finish()
    }

    observer.observe(section)
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      observer?.disconnect()
      window.removeEventListener('resize', onResize)
      window.clearTimeout(fadeTimer)
      cancelAnimationFrame(raf)
      section.classList.remove('section-rebuilding')
      layer.replaceChildren()
      host.style.display = 'none'
      host.style.opacity = ''
      host.style.transition = ''
      bar.style.transform = 'scaleX(0)'
    }
  }, [enabled, name])

  return (
    <div
      ref={hostRef}
      data-section-build-host="true"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'none',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        ref={layerRef}
        style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2 }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />
      <div
        ref={barRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '3px',
          background: 'var(--color-accent)',
          boxShadow: '0 0 12px var(--color-accent)',
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
          zIndex: 5,
        }}
      />
      <div
        ref={labelRef}
        style={{
          position: 'absolute',
          top: '0.75rem',
          right: 'clamp(1rem, 3vw, 2rem)',
          zIndex: 4,
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: '0.625rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
          whiteSpace: 'nowrap',
        }}
      >
        Building {name} · 0%
      </div>
    </div>
  )
}
