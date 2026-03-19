'use client'
import React, { useRef, useEffect } from 'react'
import { WIDTH, HEIGHT, TILE_GAP, TILE_RADIUS, ZERO_ADDRESS } from '@/constants/map'
import { idToXY } from '@/lib/pixelMath'
import { isLand } from '@/lib/landMask'
import type { PixelView } from '@/lib/mock'

interface OwnershipPulseProps {
  pixelData: PixelView[]
  userAddress?: string
}

export default function OwnershipPulse({ pixelData, userAddress }: OwnershipPulseProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!userAddress) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const addr = userAddress.toLowerCase()
    const gap = TILE_GAP
    const rad = TILE_RADIUS

    // Collect owned pixel positions
    const ownedPixels: { x: number; y: number }[] = []
    for (let i = 0; i < pixelData.length; i++) {
      if (!isLand(i)) continue
      if (pixelData[i].owner.toLowerCase() === addr) {
        ownedPixels.push(idToXY(i))
      }
    }

    if (ownedPixels.length === 0) return

    const animate = () => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT)
      // Subtle breathing glow: sine wave over 2 seconds
      const t = (Date.now() % 2000) / 2000
      const alpha = 0.08 + 0.12 * Math.sin(t * Math.PI * 2)

      ctx.fillStyle = `rgba(255,255,255,${alpha})`
      for (const { x, y } of ownedPixels) {
        ctx.beginPath()
        ctx.roundRect(x + gap / 2, y + gap / 2, 1 - gap, 1 - gap, rad)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [pixelData, userAddress])

  if (!userAddress) return null

  return (
    <canvas
      ref={canvasRef}
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
