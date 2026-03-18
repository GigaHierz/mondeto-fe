'use client'
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import {
  TransformWrapper,
  TransformComponent,
  useTransformContext,
} from 'react-zoom-pan-pinch'
import { WIDTH, HEIGHT, PAINT_SCALE } from '@/constants/map'
import { idToXY } from '@/lib/pixelMath'
import type { PixelView } from '@/lib/mock'
import type { LoadState } from '@/hooks/usePixelMap'
import PixelLayer, { drawPixels } from './PixelLayer'
import SelectionLayer from './SelectionLayer'

export interface WorldCanvasRef {
  drawInspectRing: (pixelId: number) => void
  clearInspectRing: () => void
}

interface WorldCanvasProps {
  pixelData: PixelView[]
  isHeatmap: boolean
  selectedIds: Set<number>
  onTogglePixel: (id: number) => void
  onAddPixel: (id: number) => void
  onInspectPixel?: (id: number) => void
  onScaleChange?: (scale: number) => void
  loadState: LoadState
}

interface InnerCanvasProps extends WorldCanvasProps {
  pixelCanvasRef: React.RefObject<HTMLCanvasElement | null>
  selectionCanvasRef: React.RefObject<HTMLCanvasElement | null>
}

function InnerCanvas({
  pixelData,
  isHeatmap,
  selectedIds,
  onTogglePixel,
  onAddPixel,
  onInspectPixel,
  onScaleChange,
  pixelCanvasRef,
}: InnerCanvasProps) {
  const context = useTransformContext()
  const prevScaleRef = useRef(1)

  useEffect(() => {
    const checkScale = () => {
      const currentScale = context.transformState.scale
      if (currentScale !== prevScaleRef.current) {
        prevScaleRef.current = currentScale
        onScaleChange?.(currentScale)
      }
    }

    const interval = setInterval(checkScale, 100)
    return () => clearInterval(interval)
  }, [context, onScaleChange])

  const scale = prevScaleRef.current
  const isPaintMode = scale >= PAINT_SCALE

  useEffect(() => {
    const canvas = pixelCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawPixels(ctx, pixelData, isHeatmap)
  }, [pixelData, isHeatmap, pixelCanvasRef])

  return (
    <div style={{ position: 'relative', width: WIDTH, height: HEIGHT }}>
      <img
        src="/world-map.png"
        width={WIDTH}
        height={HEIGHT}
        draggable={false}
        style={{ position: 'absolute', top: 0, left: 0, imageRendering: 'pixelated' }}
        alt="World map"
      />
      <PixelLayer
        pixelData={pixelData}
        isHeatmap={isHeatmap}
        canvasRef={pixelCanvasRef}
      />
      <SelectionLayer
        selectedIds={selectedIds}
        isPaintMode={isPaintMode}
        scale={scale}
        onTogglePixel={onTogglePixel}
        onAddPixel={onAddPixel}
        onInspectPixel={onInspectPixel}
      />
    </div>
  )
}

const WorldCanvas = forwardRef<WorldCanvasRef, WorldCanvasProps>(
  function WorldCanvas(props, ref) {
    const pixelCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const selectionCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const inspectRingRef = useRef<{
      x: number
      y: number
    } | null>(null)

    useImperativeHandle(ref, () => ({
      drawInspectRing(pid: number) {
        const canvas = selectionCanvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        // Clear previous inspect ring
        if (inspectRingRef.current) {
          const { x, y } = inspectRingRef.current
          ctx.clearRect(x - 0.5, y - 0.5, 2, 2)
        }
        const { x, y } = idToXY(pid)
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 0.2
        ctx.strokeRect(x + 0.05, y + 0.05, 0.9, 0.9)
        inspectRingRef.current = { x, y }
      },
      clearInspectRing() {
        const canvas = selectionCanvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        if (inspectRingRef.current) {
          const { x, y } = inspectRingRef.current
          ctx.clearRect(x - 0.5, y - 0.5, 2, 2)
          inspectRingRef.current = null
        }
      },
    }))

    const handleScaleChange = useCallback(
      (scale: number) => {
        props.onScaleChange?.(scale)
      },
      [props.onScaleChange],
    )

    return (
      <TransformWrapper
        minScale={1}
        maxScale={16}
        initialScale={1}
        wheel={{ step: 2 }}
        pinch={{ step: 5 }}
        doubleClick={{ step: 3 }}
        smooth
      >
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
        >
          <InnerCanvas
            {...props}
            onScaleChange={handleScaleChange}
            pixelCanvasRef={pixelCanvasRef}
            selectionCanvasRef={selectionCanvasRef}
          />
        </TransformComponent>
      </TransformWrapper>
    )
  },
)

export default WorldCanvas
