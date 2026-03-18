'use client'
import React from 'react'

interface PaintModeBannerProps {
  visible: boolean
  scale: number
  pixelCount: number
}

export default function PaintModeBanner({
  visible,
  scale,
  pixelCount,
}: PaintModeBannerProps) {
  if (!visible) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 22,
        background: 'var(--card-bg)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px',
        zIndex: 15,
        opacity: visible ? 1 : 0,
        transition: 'opacity 150ms ease',
      }}
    >
      <span
        style={{
          fontSize: 7,
          color: 'var(--text)',
          letterSpacing: 1,
        }}
      >
        PAINT MODE — drag to select pixels
      </span>
      <span style={{ fontSize: 7, color: 'var(--text-muted)' }}>
        {pixelCount} selected
      </span>
    </div>
  )
}
