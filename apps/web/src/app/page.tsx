'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import WorldCanvas, { type WorldCanvasRef } from '@/components/Map/WorldCanvas'
import PaintModeBanner from '@/components/Map/PaintModeBanner'
import HeatmapLegend from '@/components/Map/HeatmapLegend'
import ZoomHintToast from '@/components/Layout/ZoomHintToast'
import BottomNav from '@/components/Layout/BottomNav'
import DimLayer from '@/components/Overlays/DimLayer'
import SelectionDrawer from '@/components/Overlays/SelectionDrawer'
import PixelInfoPanel from '@/components/Overlays/PixelInfoPanel'
import { usePixelMap } from '@/hooks/usePixelMap'
import { useSelection } from '@/hooks/useSelection'
import { usePixelPrice } from '@/hooks/usePixelPrice'
import { useBuyPixels } from '@/hooks/useBuyPixels'
import { useProfile } from '@/hooks/useProfile'
import { PAINT_SCALE } from '@/constants/map'

export default function Home() {
  const { address } = useAccount()
  const addrStr = address as string | undefined

  const { pixelDataRef, loadState, load, refresh } = usePixelMap()
  const {
    selectedIds,
    togglePixel,
    addPixel,
    clearSelection,
    pixelCount,
  } = useSelection()

  const { totalPrice, isLoading: priceLoading } = usePixelPrice(selectedIds)
  const buy = useBuyPixels()
  const profile = useProfile(addrStr)

  const [heatmapMode, setHeatmapMode] = useState(false)
  const [currentScale, setCurrentScale] = useState(1)
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'drawer' | 'info'>('none')
  const [tappedPixelId, setTappedPixelId] = useState<number | null>(null)

  const canvasRef = useRef<WorldCanvasRef | null>(null)
  const hasZoomedPast4xRef = useRef(false)

  const isPaintMode = currentScale >= PAINT_SCALE

  useEffect(() => {
    load()
  }, [load])

  // Check balance when price changes
  useEffect(() => {
    if (totalPrice > 0n) {
      buy.checkBalance(totalPrice)
    }
  }, [totalPrice, buy.checkBalance])

  const handleScaleChange = useCallback((scale: number) => {
    setCurrentScale(scale)
    if (scale >= PAINT_SCALE) {
      hasZoomedPast4xRef.current = true
    }
  }, [])

  const effectiveAddr = addrStr || '0xYOUR000000000000000000000000000000000001'

  // Skip pixels already owned by the current user
  const isOwnPixel = useCallback((id: number) => {
    const px = pixelDataRef.current[id]
    return px && px.owner.toLowerCase() === effectiveAddr.toLowerCase()
  }, [effectiveAddr, pixelDataRef])

  const handleAddPixel = useCallback((id: number) => {
    if (isOwnPixel(id)) return
    addPixel(id)
  }, [addPixel, isOwnPixel])

  const handleTogglePixel = useCallback((id: number) => {
    if (isOwnPixel(id)) return
    togglePixel(id)
  }, [togglePixel, isOwnPixel])

  const handleInspectPixel = useCallback((id: number) => {
    setTappedPixelId(id)
    setActiveOverlay('info')
    canvasRef.current?.drawInspectRing(id)
  }, [])

  const handleDismissOverlay = useCallback(() => {
    setActiveOverlay('none')
    setTappedPixelId(null)
    canvasRef.current?.clearInspectRing()
    buy.reset()
  }, [buy])

  const handleBuy = useCallback(async () => {
    await buy.execute(
      [...selectedIds],
      profile.color,
      profile.name,
      profile.url,
      effectiveAddr,
    )
  }, [effectiveAddr, selectedIds, profile.color, profile.name, profile.url, buy])

  const handleDone = useCallback(() => {
    clearSelection()
    setActiveOverlay('none')
    buy.reset()
    refresh()
  }, [clearSelection, buy, refresh])

  const handleClear = useCallback(() => {
    clearSelection()
    setActiveOverlay('none')
  }, [clearSelection])

  const handleBuyThisPixel = useCallback((id: number) => {
    clearSelection()
    addPixel(id)
    setActiveOverlay('drawer')
    canvasRef.current?.clearInspectRing()
    setTappedPixelId(null)
  }, [clearSelection, addPixel])

  // Open drawer only when user taps the review pill
  const handleOpenDrawer = useCallback(() => {
    setActiveOverlay('drawer')
  }, [])

  const tappedPixel = tappedPixelId !== null ? pixelDataRef.current[tappedPixelId] ?? null : null
  const showDim = activeOverlay !== 'none'
  const isDrawerLocked = buy.step === 'approving' || buy.step === 'buying' || buy.step === 'confirming'

  return (
    <div
      data-heatmap={heatmapMode}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: heatmapMode ? '#0a0a0a' : 'var(--cream-50)',
      }}
    >
      {/* Top bar */}
      <div
        className={heatmapMode ? 'frosted-topbar-dark' : 'frosted-topbar'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 36,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 3,
            color: heatmapMode ? '#faf7f2' : '#2d2520',
          }}
        >
          MONDETO
        </span>

        {/* Pixel counter in top bar (paint mode) */}
        {isPaintMode && pixelCount > 0 && (
          <span style={{ fontSize: 7, color: '#a09080' }}>
            {pixelCount} selected
          </span>
        )}

        <button
          onClick={() => setHeatmapMode(h => !h)}
          style={{
            fontSize: 7,
            letterSpacing: 0.5,
            borderRadius: 10,
            padding: '3px 8px',
            background: heatmapMode ? '#2d2520' : 'rgba(200,190,175,0.25)',
            color: heatmapMode ? '#faf7f2' : '#2d2520',
            border: heatmapMode ? '0.5px solid #2d2520' : '0.5px solid #c0b8ae',
            cursor: 'pointer',
          }}
        >
          heatmap
        </button>
      </div>

      {/* WorldCanvas */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          bottom: 56,
          left: 0,
          right: 0,
        }}
      >
        <WorldCanvas
          ref={canvasRef}
          pixelData={pixelDataRef.current}
          isHeatmap={heatmapMode}
          selectedIds={selectedIds}
          onTogglePixel={handleTogglePixel}
          onAddPixel={handleAddPixel}
          onInspectPixel={handleInspectPixel}
          onScaleChange={handleScaleChange}
          loadState={loadState}
        />
      </div>

      {/* Paint mode banner */}
      <PaintModeBanner
        visible={isPaintMode}
        scale={Math.round(currentScale)}
        pixelCount={pixelCount}
      />

      {/* Heatmap legend */}
      <HeatmapLegend visible={heatmapMode} />

      {/* Zoom hint toast */}
      <ZoomHintToast hasZoomedPast4x={hasZoomedPast4xRef.current} />

      {/* Selection review pill — user taps this to open drawer */}
      {pixelCount > 0 && activeOverlay === 'none' && (
        <button
          onClick={handleOpenDrawer}
          style={{
            position: 'absolute',
            bottom: 70,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 15,
            background: '#2d2520',
            color: '#faf7f2',
            fontSize: 9,
            fontFamily: 'monospace',
            letterSpacing: 1,
            padding: '8px 20px',
            borderRadius: 11,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          [ REVIEW {pixelCount} PIXELS ]
        </button>
      )}

      {/* Dim layer — only rendered when an overlay is active */}
      {activeOverlay !== 'none' && (
        <DimLayer
          visible={true}
          locked={isDrawerLocked}
          onDismiss={handleDismissOverlay}
        />
      )}

      {/* Selection drawer — only rendered when open */}
      {activeOverlay === 'drawer' && (
        <SelectionDrawer
          visible={true}
          pixelCount={pixelCount}
          totalPrice={totalPrice}
          priceLoading={priceLoading}
          insufficientBalance={buy.insufficientBalance}
          txStep={buy.step}
          txHash={buy.txHash}
          onClear={handleClear}
          onBuy={handleBuy}
          onDone={handleDone}
        />
      )}

      {/* Pixel info panel — only rendered when open */}
      {activeOverlay === 'info' && (
        <PixelInfoPanel
          visible={true}
          pixel={tappedPixel}
          pixelId={tappedPixelId ?? 0}
          onBuyThisPixel={handleBuyThisPixel}
          onDismiss={handleDismissOverlay}
        />
      )}

      {/* Bottom nav */}
      <BottomNav activeRoute="/" isHeatmap={heatmapMode} />
    </div>
  )
}
