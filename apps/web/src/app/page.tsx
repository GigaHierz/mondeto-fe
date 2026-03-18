'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import WorldCanvas, { type WorldCanvasRef } from '@/components/Map/WorldCanvas'
import TopBar from '@/components/Layout/TopBar'
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
import { getUSDTBalance } from '@/lib/mock'
import { useUSDTBalance } from '@/hooks/useUSDTBalance'
import { fetchLandMaskFromContract } from '@/lib/landMask'
import { MONDETO_ADDRESS, MONDETO_ABI } from '@/lib/contract'
import { PAINT_SCALE } from '@/constants/map'
import { useTheme } from '@/lib/theme'

export default function Home() {
  const { isDark } = useTheme()
  const { address } = useAccount()
  const addrStr = address as string | undefined
  const publicClient = usePublicClient()

  const { pixelDataRef, loadState, load, refresh, version } = usePixelMap()
  const {
    selectedIds,
    togglePixel,
    addPixel,
    removePixel,
    clearSelection,
    pixelCount,
  } = useSelection()

  const { totalPrice, isLoading: priceLoading } = usePixelPrice(selectedIds)
  const buy = useBuyPixels()
  const profile = useProfile(addrStr)

  const walletBalance = useUSDTBalance()

  const [heatmapMode, setHeatmapMode] = useState(false)
  const [currentScale, setCurrentScale] = useState(1)
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'drawer' | 'info'>('none')
  const [tappedPixelId, setTappedPixelId] = useState<number | null>(null)
  const [userBalance, setUserBalance] = useState(0n)

  const canvasRef = useRef<WorldCanvasRef | null>(null)
  const hasZoomedPast4xRef = useRef(false)

  const isPaintMode = currentScale >= PAINT_SCALE

  useEffect(() => {
    load()
    if (!walletBalance.isConnected) {
      getUSDTBalance().then(setUserBalance)
    }
    // Fetch land mask from contract (replaces static fallback)
    if (publicClient) {
      fetchLandMaskFromContract(
        publicClient.readContract.bind(publicClient) as Parameters<typeof fetchLandMaskFromContract>[0],
        MONDETO_ADDRESS,
        MONDETO_ABI,
      ).then(() => {
        // Reload pixel data after mask is updated so rendering uses new mask
        load()
      })
    }
  }, [load, walletBalance.isConnected, publicClient])

  // Use real on-chain balance when wallet connected
  useEffect(() => {
    if (walletBalance.isConnected && walletBalance.balance) {
      const parsed = Math.floor(parseFloat(walletBalance.balance) * 1_000_000)
      setUserBalance(BigInt(parsed))
    }
  }, [walletBalance.isConnected, walletBalance.balance])

  // Check balance when price changes
  useEffect(() => {
    if (totalPrice > 0n) {
      buy.checkBalance(totalPrice, userBalance)
    }
  }, [totalPrice, userBalance, buy.checkBalance])

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

  const handleBuy = useCallback(() => {
    buy.execute([...selectedIds], totalPrice)
  }, [selectedIds, totalPrice, buy])

  const handleDone = useCallback(() => {
    clearSelection()
    setActiveOverlay('none')
    buy.reset()
    refresh()
  }, [clearSelection, buy, refresh])

  const handleRemovePixels = useCallback((ids: number[]) => {
    for (const id of ids) removePixel(id)
  }, [removePixel])

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
    buy.reset()
    setActiveOverlay('drawer')
  }, [buy])

  const tappedPixel = tappedPixelId !== null ? pixelDataRef.current[tappedPixelId] ?? null : null
  const showDim = activeOverlay !== 'none'
  const isDrawerLocked = buy.step === 'approving' || buy.step === 'buying' || buy.step === 'confirming'

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--bg)',
      }}
    >
      {/* Top bar */}
      <TopBar title="MONDETO">
        {isPaintMode && pixelCount > 0 && (
          <span style={{ fontSize: 7, color: 'var(--text-muted)' }}>
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
            background: heatmapMode ? 'var(--button-bg)' : 'transparent',
            color: heatmapMode ? 'var(--button-text)' : 'var(--text)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
          }}
        >
          heatmap
        </button>
      </TopBar>

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
          isDark={isDark}
          selectedIds={selectedIds}
          onTogglePixel={handleTogglePixel}
          onAddPixel={handleAddPixel}
          onInspectPixel={handleInspectPixel}
          onScaleChange={handleScaleChange}
          version={version}
          loadState={loadState}
        />
      </div>

      {/* Zoom +/- buttons */}
      <div
        style={{
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <button
          onClick={() => canvasRef.current?.zoomIn()}
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--card-bg)', border: '1px solid var(--border)',
            fontSize: 16, color: 'var(--text)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >+</button>
        <button
          onClick={() => canvasRef.current?.zoomOut()}
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--card-bg)', border: '1px solid var(--border)',
            fontSize: 16, color: 'var(--text)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >{'\u2212'}</button>
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
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
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
          selectedIds={selectedIds}
          pixelData={pixelDataRef.current}
          totalPrice={totalPrice}
          priceLoading={priceLoading}
          insufficientBalance={buy.insufficientBalance}
          userBalance={userBalance}
          txStep={buy.step}
          txHash={buy.txHash}
          userAddress={effectiveAddr}
          onRemovePixels={handleRemovePixels}
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
      <BottomNav activeRoute="/" />
    </div>
  )
}
