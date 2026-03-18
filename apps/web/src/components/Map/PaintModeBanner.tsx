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
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            fontSize: 7,
            padding: '2px 6px',
            borderRadius: 9999,
          }}
        >
          {scale}{'\u00d7'}
        </span>
        <span style={{ fontSize: 7, color: 'var(--text-muted)' }}>
          {pixelCount} selected
        </span>
      </div>
    </div>
  )
}
