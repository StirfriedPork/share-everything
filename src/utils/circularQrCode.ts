import QRCode from 'qrcode'

export interface CircularQrLogo {
  image?: CanvasImageSource
  emoji?: string
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

export async function resolveQrLogo(
  iconSrc?: string,
  iconEmoji?: string,
): Promise<CircularQrLogo | undefined> {
  if (iconSrc) {
    try {
      const image = await loadImage(iconSrc)
      return { image }
    } catch {
      // fall through to emoji
    }
  }
  if (iconEmoji) return { emoji: iconEmoji }
  return undefined
}

function isInLogoZone(
  row: number,
  col: number,
  count: number,
  logoHalfModules: number,
): boolean {
  const center = (count - 1) / 2
  return Math.abs(row - center) <= logoHalfModules && Math.abs(col - center) <= logoHalfModules
}

export function drawCircularQrCode(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  outerRadius: number,
  url: string,
  logo?: CircularQrLogo,
) {
  const qr = QRCode.create(url, { errorCorrectionLevel: 'H' })
  const count = qr.modules.size
  const logoHalfModules = Math.max(2, Math.floor(count * 0.11))

  // Inscribed square keeps all three finder patterns intact for reliable scanning.
  const qrBoxSize = outerRadius * Math.SQRT2 * 0.9
  const cellSize = qrBoxSize / count
  const originX = centerX - qrBoxSize / 2
  const originY = centerY - qrBoxSize / 2
  const dotRadius = cellSize * 0.44

  ctx.save()

  ctx.beginPath()
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()

  ctx.fillStyle = '#1a3d34'
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!qr.modules.get(row, col)) continue
      if (isInLogoZone(row, col, count, logoHalfModules)) continue

      const x = originX + (col + 0.5) * cellSize
      const y = originY + (row + 0.5) * cellSize
      ctx.beginPath()
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.restore()

  const logoRadius = outerRadius * 0.18
  ctx.beginPath()
  ctx.arc(centerX, centerY, logoRadius + 4, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.strokeStyle = '#e4efe9'
  ctx.lineWidth = 2
  ctx.stroke()

  if (logo?.image) {
    const size = logoRadius * 1.5
    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, logoRadius, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(logo.image, centerX - size / 2, centerY - size / 2, size, size)
    ctx.restore()
  } else if (logo?.emoji) {
    ctx.font = `${logoRadius * 1.3}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#1a3d34'
    ctx.fillText(logo.emoji, centerX, centerY + 1)
  }

  ctx.beginPath()
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2)
  ctx.strokeStyle = '#d8ebe3'
  ctx.lineWidth = 3
  ctx.stroke()
}
