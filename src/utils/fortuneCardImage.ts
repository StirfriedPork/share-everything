import type { AppId } from '../apps/types'
import type { Locale } from '../i18n/types'
import { buildAppEntryUrl } from './siteUrl'
import { drawCircularQrCode, resolveQrLogo } from './circularQrCode'

export interface FortuneCardImageInput {
  locale: Locale
  emoji: string
  level: string
  body: string
  tier: 'excellent' | 'good'
  appId: AppId
  appIconSrc?: string
  appIconEmoji?: string
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split('')
  const lines: string[] = []
  let line = ''

  for (const ch of words) {
    const test = line + ch
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = ch
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

export async function generateFortuneCardImage(input: FortuneCardImageInput): Promise<Blob> {
  const width = 540
  const height = 720
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  const gradient = ctx.createLinearGradient(0, 0, width, height)
  if (input.tier === 'excellent') {
    gradient.addColorStop(0, '#fff9ee')
    gradient.addColorStop(0.45, '#e8f7fd')
    gradient.addColorStop(1, '#f0fdf8')
  } else {
    gradient.addColorStop(0, '#f0fdf8')
    gradient.addColorStop(1, '#e8f7fd')
  }
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  const ribbon = ctx.createLinearGradient(0, 0, width, 0)
  ribbon.addColorStop(0, '#3ecf9a')
  ribbon.addColorStop(0.5, '#5ec8f2')
  ribbon.addColorStop(1, '#ffd89a')
  ctx.fillStyle = ribbon
  ctx.fillRect(0, 0, width, 6)

  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = 'rgba(42, 120, 95, 0.12)'
  ctx.shadowBlur = 24
  ctx.shadowOffsetY = 8
  roundRect(ctx, 40, 56, width - 80, height - 112, 24)
  ctx.fill()
  ctx.shadowColor = 'transparent'

  ctx.textAlign = 'center'
  ctx.fillStyle = '#1a3d34'
  ctx.font = '64px sans-serif'
  ctx.fillText(input.emoji, width / 2, 150)

  ctx.font = 'bold 36px sans-serif'
  ctx.fillStyle = '#1a3d34'
  ctx.fillText(input.level, width / 2, 210)

  ctx.font = '22px sans-serif'
  ctx.fillStyle = '#2d4a42'
  const lines = wrapText(ctx, input.body, width - 140)
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, 270 + i * 34)
  })

  const cardTop = 56
  const cardHeight = height - 112
  const cardBottom = cardTop + cardHeight
  const textBottom = 270 + lines.length * 34
  const bottomPadding = 16
  const topGap = 18
  const available = cardBottom - bottomPadding - textBottom - topGap
  const qrRadius = Math.min(98, Math.max(86, Math.floor(available / 2)))
  const qrCenterY = cardBottom - bottomPadding - qrRadius

  const qrLogo = await resolveQrLogo(input.appIconSrc, input.appIconEmoji)
  drawCircularQrCode(
    ctx,
    width / 2,
    qrCenterY,
    qrRadius,
    buildAppEntryUrl(input.appId),
    qrLogo,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to create image'))
    }, 'image/png')
  })
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export function downloadBlob(blob: Blob, filename: string) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}
