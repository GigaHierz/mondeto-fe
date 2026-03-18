'use client'
import React from 'react'
import { WIDTH, HEIGHT, DOT_RADIUS, ZERO_ADDRESS } from '@/constants/map'
import { idToXY } from '@/lib/pixelMath'
import { isLand } from '@/lib/landMask'
import type { PixelView } from '@/lib/mock'

// Warm heatmap: yellow → orange → red (used only for heatmap mode)
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
  isDark: boolean,
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
      ctx.beginPath()
      ctx.arc(x + 0.5, y + 0.5, DOT_RADIUS, 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    const unownedColor = isDark ? '#333333' : '#999999'

    for (let i = 0; i < pixelData.length; i++) {
      if (!isLand(i)) continue
      const pixel = pixelData[i]
      const { x, y } = idToXY(i)

      if (pixel.owner !== ZERO_ADDRESS) {
        // Owned pixel: use owner's color
        ctx.fillStyle = pixel.color || '#888888'
      } else {
        // Unowned land: neutral dot
        ctx.fillStyle = unownedColor
      }

      ctx.beginPath()
      ctx.arc(x + 0.5, y + 0.5, DOT_RADIUS, 0, Math.PI * 2)
      ctx.fill()
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
