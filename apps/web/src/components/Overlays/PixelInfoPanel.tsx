'use client'

import React from 'react'
import type { PixelView } from '@/lib/mock'
import { formatUSDT } from '@/lib/colorUtils'

interface PixelInfoPanelProps {
  visible: boolean
  pixel: PixelView | null
  pixelId: number
  onBuyThisPixel: (id: number) => void
  onDismiss: () => void
}

function truncateAddress(addr: string): string {
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

export default function PixelInfoPanel({
  visible,
  pixel,
  pixelId,
  onBuyThisPixel,
  onDismiss,
}: PixelInfoPanelProps) {
  if (!pixel) return null

  const firstLetter = pixel.label ? pixel.label[0].toUpperCase() : '?'
  const firstLetterColor = pixel.label ? 'white' : '#a09080'
  const prevPrice = pixel.currentPrice / 2n
  const ownerDisplay = pixel.label || truncateAddress(pixel.owner)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 56,
        left: 0,
        right: 0,
        zIndex: 50,
        background: '#faf7f2',
        borderRadius: '18px 18px 0 0',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      {/* Drag handle */}
      <div
        style={{
          width: 32,
          height: 3,
          borderRadius: 2,
          background: '#c0b8ae',
          margin: '10px auto 0',
        }}
      />

      {/* Owner row */}
      <div
        style={{
          padding: '8px 14px 10px',
          borderBottom: '0.5px solid #f0ebe3',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 11,
            background: pixel.color || '#e0d8ce',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 500, color: firstLetterColor }}>
            {firstLetter}
          </span>
        </div>

        {/* Middle */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#2d2520' }}>{ownerDisplay}</div>
          <div style={{ fontSize: 7, color: '#a09080', letterSpacing: 0.5 }}>
            {truncateAddress(pixel.owner)}
          </div>
        </div>

        {/* Sale count */}
        <div>
          <div style={{ fontSize: 6, color: '#a09080', letterSpacing: 0.5 }}>SALE #</div>
          <div style={{ fontSize: 8, color: '#2d2520' }}>{pixel.saleCount}</div>
        </div>
      </div>

      {/* Label field */}
      <div style={{ padding: '7px 14px', borderBottom: '0.5px solid #f0ebe3' }}>
        <div style={{ fontSize: 6, color: '#a09080', letterSpacing: 1 }}>LABEL</div>
        <div style={{ fontSize: 9, color: '#2d2520' }}>{pixel.label || '—'}</div>
      </div>

      {/* URL field */}
      <div style={{ padding: '7px 14px', borderBottom: '0.5px solid #f0ebe3' }}>
        <div style={{ fontSize: 6, color: '#a09080', letterSpacing: 1 }}>URL</div>
        <div style={{ fontSize: 9, color: '#4a7fa5' }}>
          {pixel.url ? `${pixel.url} →` : '—'}
        </div>
      </div>

      {/* Price cards row */}
      <div style={{ padding: '8px 14px', display: 'flex', gap: 8 }}>
        {/* BUY PRICE */}
        <div
          style={{
            flex: 1,
            background: '#f5f1ea',
            border: '0.5px solid #e0d8ce',
            borderRadius: 8,
            padding: '6px 8px',
          }}
        >
          <div style={{ fontSize: 6, color: '#a09080', letterSpacing: 1, marginBottom: 2 }}>
            BUY PRICE
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#2d2520' }}>
            {formatUSDT(pixel.currentPrice)}
          </div>
          <div style={{ fontSize: 6, color: '#a09080', marginTop: 1 }}>USDT</div>
        </div>

        {/* PREV SALE */}
        <div
          style={{
            flex: 1,
            background: '#f5f1ea',
            border: '0.5px solid #e0d8ce',
            borderRadius: 8,
            padding: '6px 8px',
          }}
        >
          <div style={{ fontSize: 6, color: '#a09080', letterSpacing: 1, marginBottom: 2 }}>
            PREV SALE
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#2d2520' }}>
            {formatUSDT(prevPrice)}
          </div>
          <div style={{ fontSize: 6, color: '#a09080', marginTop: 1 }}>USDT</div>
        </div>

        {/* SOLD */}
        <div
          style={{
            flex: 1,
            background: '#f5f1ea',
            border: '0.5px solid #e0d8ce',
            borderRadius: 8,
            padding: '6px 8px',
          }}
        >
          <div style={{ fontSize: 6, color: '#a09080', letterSpacing: 1, marginBottom: 2 }}>
            SOLD
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#2d2520' }}>
            {pixel.saleCount}
          </div>
          <div style={{ fontSize: 6, color: '#a09080', marginTop: 1 }}>×</div>
        </div>
      </div>

      {/* Buy button */}
      <button
        onClick={() => onBuyThisPixel(pixelId)}
        style={{
          margin: '2px 14px 0',
          background: '#2d2520',
          color: '#faf7f2',
          borderRadius: 11,
          padding: 10,
          fontSize: 9,
          fontFamily: 'monospace',
          letterSpacing: 1.5,
          textAlign: 'center',
          border: 'none',
          cursor: 'pointer',
          width: 'calc(100% - 28px)',
        }}
      >
        [ BUY THIS PIXEL ]
      </button>

      {/* Note */}
      <div
        style={{
          fontSize: 7,
          color: '#a09080',
          textAlign: 'center',
          marginTop: 5,
          paddingBottom: 14,
        }}
      >
        previous owner gets {formatUSDT(pixel.currentPrice)} USDT instantly
      </div>
    </div>
  )
}
