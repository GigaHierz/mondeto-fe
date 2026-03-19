'use client'
import React from 'react'
import { WIDTH, HEIGHT, TILE_GAP, TILE_RADIUS, ZERO_ADDRESS } from '@/constants/map'
import { idToXY } from '@/lib/pixelMath'
import { isLand } from '@/lib/landMask'
import type { PixelView } from '@/lib/mock'

// Warm heatmap: yellow → orange → red
function interpolateWarmGradient(ratio: number): string {
  const t = Math.max(0, Math.min(1, ratio))
  const stops = [
    { p: 0.0, r: 255, g: 224, b: 102 },
    { p: 0.3, r: 255, g: 170, b: 51 },
    { p: 0.6, r: 255, g: 102, b: 51 },
    { p: 1.0, r: 204, g: 0, b: 0 },
  ]
  let lo = stops[0], hi = stops[stops.length - 1]
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].p && t <= stops[i + 1].p) { lo = stops[i]; hi = stops[i + 1]; break }
  }
  const f = hi.p === lo.p ? 0 : (t - lo.p) / (hi.p - lo.p)
  const r = Math.round(lo.r + (hi.r - lo.r) * f)
  const g = Math.round(lo.g + (hi.g - lo.g) * f)
  const b = Math.round(lo.b + (hi.b - lo.b) * f)
  return `rgb(${r},${g},${b})`
}

// Brighten a hex color by a factor (1.0 = no change, 1.3 = 30% brighter)
function brighten(hex: string, factor: number): string {
  const m = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (!m) return hex
  const r = Math.min(255, Math.round(parseInt(m[1], 16) * factor))
  const g = Math.min(255, Math.round(parseInt(m[2], 16) * factor))
  const b = Math.min(255, Math.round(parseInt(m[3], 16) * factor))
  return `rgb(${r},${g},${b})`
}

export function drawPixels(
  ctx: CanvasRenderingContext2D,
  pixelData: PixelView[],
  isHeatmap: boolean,
  isDark: boolean,
  userAddress?: string,
) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  const gap = TILE_GAP
  const rad = TILE_RADIUS
  const userAddr = userAddress?.toLowerCase()

  if (isHeatmap) {
    // Find max sale count for gradient normalization
    let maxSales = 0
    for (let i = 0; i < pixelData.length; i++) {
      if (pixelData[i].saleCount > maxSales) {
        maxSales = pixelData[i].saleCount
      }
    }

    const unownedColor = isDark ? '#dddddd' : '#555555'

    for (let i = 0; i < pixelData.length; i++) {
      if (!isLand(i)) continue
      const pixel = pixelData[i]
      const { x, y } = idToXY(i)

      if (pixel.saleCount === 0) {
        // Unowned land — same subtle color as normal map
        ctx.fillStyle = unownedColor
      } else {
        // Owned land — gradient by sale count for clear differentiation
        const ratio = maxSales > 0 ? pixel.saleCount / maxSales : 0
        ctx.fillStyle = interpolateWarmGradient(ratio)
      }

      ctx.beginPath()
      ctx.roundRect(x + gap / 2, y + gap / 2, 1 - gap, 1 - gap, rad)
      ctx.fill()
    }
  } else {
    const unownedColor = isDark ? '#dddddd' : '#555555'

    for (let i = 0; i < pixelData.length; i++) {
      if (!isLand(i)) continue
      const pixel = pixelData[i]
      const { x, y } = idToXY(i)
      const isOwned = pixel.owner !== ZERO_ADDRESS
      const isMine = userAddr && isOwned && pixel.owner.toLowerCase() === userAddr

      if (isOwned) {
        // Brighten own pixels
        ctx.fillStyle = isMine ? brighten(pixel.color || '#888888', 1.3) : (pixel.color || '#888888')
      } else {
        ctx.fillStyle = unownedColor
      }

      ctx.beginPath()
      ctx.roundRect(x + gap / 2, y + gap / 2, 1 - gap, 1 - gap, rad)
      ctx.fill()

      // Draw brighter edge for own pixels
      if (isMine) {
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'
        ctx.lineWidth = 0.06
        ctx.beginPath()
        ctx.roundRect(x + gap / 2, y + gap / 2, 1 - gap, 1 - gap, rad)
        ctx.stroke()
      }
    }
  }
}

interface PixelLayerProps {
  pixelData: PixelView[]
  isHeatmap: boolean
  isDark: boolean
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}

export default function PixelLayer({ canvasRef }: PixelLayerProps) {
  return (
    <canvas
      ref={el => { canvasRef.current = el }}
      width={WIDTH}
      height={HEIGHT}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: WIDTH,
        height: HEIGHT,
        pointerEvents: 'none',
        imageRendering: 'pixelated',
      }}
    />
  )
}
