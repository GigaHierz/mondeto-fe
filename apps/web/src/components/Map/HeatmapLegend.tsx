'use client'
import React from 'react'

interface HeatmapLegendProps {
  visible: boolean
}

export default function HeatmapLegend({ visible }: HeatmapLegendProps) {
  if (!visible) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 68,
        left: 10,
        right: 10,
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '6px 10px',
        zIndex: 5,
      }}
    >
      <div
        style={{
          height: 8,
          borderRadius: 4,
          background:
            'linear-gradient(to right, #ffe066, #ffaa33, #ff6633, #cc0000)',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 2,
        }}
      >
        <span style={{ fontSize: 6, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          1 sale
        </span>
        <span style={{ fontSize: 6, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          most sold
        </span>
      </div>
    </div>
  )
}
