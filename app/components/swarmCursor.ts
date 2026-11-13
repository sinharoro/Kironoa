import { asset } from '../site'

export const SWARM_CURSOR_SRC = asset('/images/swarm-cursor.png')
export const SWARM_HOTSPOT_X = 23 / 32
export const SWARM_HOTSPOT_Y = 4 / 32

export const SWARM_COLORS = [
  '#00F5A0',
  '#4ADE80',
  '#22D3EE',
  '#38BDF8',
  '#818CF8',
  '#A78BFA',
  '#E879F9',
  '#F472B6',
  '#FB7185',
  '#FBBF24',
  '#FB923C',
  '#A3E635',
  '#F8FAFC',
]

let cursorImage: HTMLImageElement | null = null
let cursorRequest: Promise<HTMLImageElement | null> | null = null

export function loadSwarmCursor(): Promise<HTMLImageElement | null> {
  if (cursorImage) return Promise.resolve(cursorImage)
  if (cursorRequest) return cursorRequest

  cursorRequest = new Promise((resolve) => {
    const image = new Image()
    image.src = SWARM_CURSOR_SRC
    image.onload = () => {
      cursorImage = image
      resolve(image)
    }
    image.onerror = () => resolve(null)
  })

  return cursorRequest
}

const tintCache = new Map<string, HTMLCanvasElement>()

function tintCursor(image: HTMLImageElement, color: string) {
  const cached = tintCache.get(color)
  if (cached) return cached

  const buffer = document.createElement('canvas')
  buffer.width = image.naturalWidth
  buffer.height = image.naturalHeight
  const context = buffer.getContext('2d')

  if (context) {
    context.drawImage(image, 0, 0)
    context.globalCompositeOperation = 'source-in'
    context.fillStyle = color
    context.fillRect(0, 0, buffer.width, buffer.height)
  }

  tintCache.set(color, buffer)
  return buffer
}

export function drawSwarmCursor(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  color: string,
  x: number,
  y: number,
  size: number,
  alpha: number,
  outline: string
) {
  if (alpha <= 0.01) return

  context.save()
  context.globalAlpha = alpha

  if (image) {
    const tinted = tintCursor(image, color)
    context.shadowColor = color
    context.shadowBlur = size * 0.4
    context.drawImage(
      tinted,
      x - size * SWARM_HOTSPOT_X,
      y - size * SWARM_HOTSPOT_Y,
      size,
      size
    )
    context.restore()
    return
  }

  context.shadowColor = color
  context.shadowBlur = size * 0.4
  context.translate(x, y)
  context.scale(size / 20, size / 20)
  context.fillStyle = color
  context.strokeStyle = outline
  context.lineWidth = 1.5
  context.lineJoin = 'round'
  context.beginPath()
  context.moveTo(0, 0)
  context.lineTo(0, 17)
  context.lineTo(4.2, 13.2)
  context.lineTo(6.8, 19.2)
  context.lineTo(10.2, 17.7)
  context.lineTo(7.7, 11.8)
  context.lineTo(12.8, 11.7)
  context.closePath()
  context.fill()
  context.stroke()
  context.restore()
}
