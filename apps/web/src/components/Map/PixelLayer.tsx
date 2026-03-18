'use client'
import React from 'react'
import { WIDTH, HEIGHT, TILE_GAP, TILE_RADIUS, ZERO_ADDRESS } from '@/constants/map'
import { idToXY } from '@/lib/pixelMath'
import { interpolateHeatGradient } from '@/lib/colorUtils'
import type { PixelView } from '@/lib/mock'

export function drawPixels(
  ctx: CanvasRenderingContext2D,
  pixelData: PixelView[],
  isHeatmap: boolean,
) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  if (isHeatmap) {
    let maxPrice = 0n
    for (let i = 0; i < pixelData.length; i++) {
      if (pixelData[i].currentPrice > maxPrice) {
        maxPrice = pixelData[i].currentPrice
      }
    }
    const maxPriceNum = Number(maxPrice)

    for (let i = 0; i < pixelData.length; i++) {
      const pixel = pixelData[i]
      const { x, y } = idToXY(i)
      const ratio = maxPriceNum > 0 ? Number(pixel.currentPrice) / maxPriceNum : 0
      const color =
        pixel.owner === ZERO_ADDRESS
          ? '#4444ff'
          : interpolateHeatGradient(ratio)
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x + 0.5, y + 0.5, 0.35, 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    for (let i = 0; i < pixelData.length; i++) {
      const pixel = pixelData[i]
      if (pixel.owner === ZERO_ADDRESS) continue
      const { x, y } = idToXY(i)
      ctx.fillStyle = pixel.color || '#888888'
      const gap = TILE_GAP
      const r = TILE_RADIUS
      const rx = x + gap / 2
      const ry = y + gap / 2
      const rw = 1 - gap
      const rh = 1 - gap
      ctx.beginPath()
      ctx.roundRect(rx, ry, rw, rh, r)
      ctx.fill()
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
