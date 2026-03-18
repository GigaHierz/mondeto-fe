'use client'
import React from 'react'
import { WIDTH, HEIGHT, TILE_GAP, TILE_RADIUS, ZERO_ADDRESS } from '@/constants/map'
import { idToXY } from '@/lib/pixelMath'
import { interpolateHeatGradient } from '@/lib/colorUtils'
import { isLand } from '@/lib/landMask'
import type { PixelView } from '@/lib/mock'

// Warm heatmap: yellow → orange → red
function interpolateWarmGradient(ratio: number): string {
  const t = Math.max(0, Math.min(1, ratio))
  const stops = [
    { p: 0.0, r: 255, g: 224, b: 102 },  // light yellow
    { p: 0.3, r: 255, g: 170, b: 51 },    // orange
    { p: 0.6, r: 255, g: 102, b: 51 },    // red-orange
    { p: 1.0, r: 204, g: 0, b: 0 },       // deep red
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

export function drawPixels(
  ctx: CanvasRenderingContext2D,
  pixelData: PixelView[],
  isHeatmap: boolean,
) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  if (isHeatmap) {
    let maxPrice = 0n
    for (let i = 0; i < pixelData.length; i++) {
      if (pixelData[i].saleCount > 0 && pixelData[i].currentPrice > maxPrice) {
        maxPrice = pixelData[i].currentPrice
      }
    }
    const maxPriceNum = Number(maxPrice)

    for (let i = 0; i < pixelData.length; i++) {
      if (!isLand(i)) continue
      const pixel = pixelData[i]
      if (pixel.saleCount === 0) continue // only show pixels that have been bought
      const { x, y } = idToXY(i)
      const ratio = maxPriceNum > 0 ? Number(pixel.currentPrice) / maxPriceNum : 0
      const color = interpolateWarmGradient(ratio)
      ctx.fillStyle = color
      const gap = TILE_GAP
      const r = TILE_RADIUS
      ctx.beginPath()
      ctx.roundRect(x + gap / 2, y + gap / 2, 1 - gap, 1 - gap, r)
      ctx.fill()
    }
  } else {
    for (let i = 0; i < pixelData.length; i++) {
      if (!isLand(i)) continue
      const pixel = pixelData[i]
      if (pixel.owner === ZERO_ADDRESS) continue
      const { x, y } = idToXY(i)
      const gap = TILE_GAP
      const r = TILE_RADIUS
      const rx = x + gap / 2
      const ry = y + gap / 2
      const rw = 1 - gap
      const rh = 1 - gap

      // Base color
      ctx.fillStyle = pixel.color || '#888888'
      ctx.beginPath()
      ctx.roundRect(rx, ry, rw, rh, r)
      ctx.fill()

      // Lego highlight (top-left lighter edge)
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.fillRect(rx, ry, rw, 0.15)
      ctx.fillRect(rx, ry, 0.15, rh)

      // Lego shadow (bottom-right darker edge)
      ctx.fillStyle = 'rgba(0,0,0,0.2)'
      ctx.fillRect(rx, ry + rh - 0.15, rw, 0.15)
      ctx.fillRect(rx + rw - 0.15, ry, 0.15, rh)

      // Lego stud (center dot)
      ctx.fillStyle = 'rgba(255,255,255,0.25)'
      ctx.beginPath()
      ctx.arc(x + 0.5, y + 0.5, 0.18, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'
      ctx.lineWidth = 0.04
      ctx.stroke()
    }
  }
}

interface PixelLayerProps {
  pixelData: PixelView[]
  isHeatmap: boolean
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
