'use client'

import React from 'react'

interface DimLayerProps {
  visible: boolean
  locked?: boolean
  onDismiss: () => void
}

export default function DimLayer({ visible, locked, onDismiss }: DimLayerProps) {
  return (
    <div
      onClick={locked ? undefined : onDismiss}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 56,
        zIndex: 45,
        background: 'rgba(45,37,32,0.28)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 250ms ease',
      }}
    />
  )
}
