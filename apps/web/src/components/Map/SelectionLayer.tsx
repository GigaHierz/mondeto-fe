'use client'
import React, { useRef, useEffect, useCallback } from 'react'
import { WIDTH, HEIGHT } from '@/constants/map'
import { idToXY, pixelId, screenToPixel } from '@/lib/pixelMath'

interface SelectionLayerProps {
  selectedIds: Set<number>
  isPaintMode: boolean
  scale: number
  onTogglePixel: (id: number) => void
  onAddPixel: (id: number) => void
  onInspectPixel?: (id: number) => void
}

export default function SelectionLayer({
  selectedIds,
  isPaintMode,
  scale,
  onTogglePixel,
  onAddPixel,
  onInspectPixel,
}: SelectionLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isPaintingRef = useRef(false)
  const startPosRef = useRef<{ x: number; y: number } | null>(null)
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressFiredRef = useRef(false)
  const movedRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, WIDTH, HEIGHT)

    selectedIds.forEach(id => {
      const { x, y } = idToXY(id)
      ctx.fillStyle = '#facc15'
      ctx.fillRect(x, y, 1, 1)
      ctx.strokeStyle = '#2d2520'
      ctx.lineWidth = 0.12
      ctx.strokeRect(x, y, 1, 1)
    })
  }, [selectedIds])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isPaintMode) return
      const canvas = canvasRef.current
      if (!canvas) return

      isPaintingRef.current = true
      movedRef.current = false
      longPressFiredRef.current = false
      startPosRef.current = { x: e.clientX, y: e.clientY }

      const pixel = screenToPixel(e.clientX, e.clientY, canvas, scale)
      if (!pixel) return

      longPressTimerRef.current = setTimeout(() => {
        if (!movedRef.current && onInspectPixel) {
          longPressFiredRef.current = true
          const pid = pixelId(pixel.x, pixel.y)
          onInspectPixel(pid)
        }
      }, 500)
    },
    [isPaintMode, scale, onInspectPixel],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isPaintingRef.current || !isPaintMode) return
      const canvas = canvasRef.current
      if (!canvas) return

      const start = startPosRef.current
      if (start) {
        const dx = e.clientX - start.x
        const dy = e.clientY - start.y
        if (Math.sqrt(dx * dx + dy * dy) > 3) {
          movedRef.current = true
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current)
            longPressTimerRef.current = null
          }
        }
      }

      if (movedRef.current) {
        const pixel = screenToPixel(e.clientX, e.clientY, canvas, scale)
        if (pixel) {
          onAddPixel(pixelId(pixel.x, pixel.y))
        }
      }
    },
    [isPaintMode, scale, onAddPixel],
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isPaintMode) return

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }

      if (!longPressFiredRef.current && !movedRef.current) {
        const canvas = canvasRef.current
        if (canvas) {
          const pixel = screenToPixel(e.clientX, e.clientY, canvas, scale)
          if (pixel) {
            onTogglePixel(pixelId(pixel.x, pixel.y))
          }
        }
      }

      isPaintingRef.current = false
      startPosRef.current = null
    },
    [isPaintMode, scale, onTogglePixel],
  )

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
        pointerEvents: isPaintMode ? 'auto' : 'none',
        imageRendering: 'pixelated',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  )
}
