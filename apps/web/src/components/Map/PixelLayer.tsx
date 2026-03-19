'use client'
import React from 'react'
import { WIDTH, HEIGHT, TILE_GAP, TILE_RADIUS, ZERO_ADDRESS } from '@/constants/map'
import { idToXY } from '@/lib/pixelMath'
import { isLand } from '@/lib/landMask'
import type { PixelView } from '@/lib/mock'

export type MapView = 'normal' | 'heatmap' | 'myland'

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

export function drawPixels(
  ctx: CanvasRenderingContext2D,
  pixelData: PixelView[],
  mapView: MapView,
  isDark: boolean,
  userAddress?: string,
) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  const gap = TILE_GAP
  const rad = TILE_RADIUS
  const userAddr = userAddress?.toLowerCase()
  const unownedColor = isDark ? '#dddddd' : '#555555'
  const fadedColor = isDark ? 'rgba(221,221,221,0.25)' : 'rgba(85,85,85,0.25)'

  if (mapView === 'heatmap') {
    let maxSales = 0
    for (let i = 0; i < pixelData.length; i++) {
      if (pixelData[i].saleCount > maxSales) {
        maxSales = pixelData[i].saleCount
      }
    }

    for (let i = 0; i < pixelData.length; i++) {
      if (!isLand(i)) continue
      const pixel = pixelData[i]
      const { x, y } = idToXY(i)

      if (pixel.saleCount === 0) {
        ctx.fillStyle = unownedColor
      } else {
        const ratio = maxSales > 0 ? pixel.saleCount / maxSales : 0
        ctx.fillStyle = interpolateWarmGradient(ratio)
      }

      ctx.beginPath()
      ctx.roundRect(x + gap / 2, y + gap / 2, 1 - gap, 1 - gap, rad)
      ctx.fill()
    }
  } else if (mapView === 'myland') {
    for (let i = 0; i < pixelData.length; i++) {
      if (!isLand(i)) continue
      const pixel = pixelData[i]
      const { x, y } = idToXY(i)
      const isOwned = pixel.owner !== ZERO_ADDRESS
      const isMine = userAddr && isOwned && pixel.owner.toLowerCase() === userAddr

      if (isMine) {
        // My pixels: full color
        ctx.fillStyle = pixel.color || '#888888'
      } else {
        // Everything else: faded out
        ctx.fillStyle = fadedColor
      }

      ctx.beginPath()
      ctx.roundRect(x + gap / 2, y + gap / 2, 1 - gap, 1 - gap, rad)
      ctx.fill()
    }
  } else {
    for (let i = 0; i < pixelData.length; i++) {
      if (!isLand(i)) continue
      const pixel = pixelData[i]
      const { x, y } = idToXY(i)
      const isOwned = pixel.owner !== ZERO_ADDRESS

      if (isOwned) {
        ctx.fillStyle = pixel.color || '#888888'
      } else {
        ctx.fillStyle = unownedColor
      }

      ctx.beginPath()
      ctx.roundRect(x + gap / 2, y + gap / 2, 1 - gap, 1 - gap, rad)
      ctx.fill()
    }
  }
}

interface PixelLayerProps {
  pixelData: PixelView[]
  mapView: MapView
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
