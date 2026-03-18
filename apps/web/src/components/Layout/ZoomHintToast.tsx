'use client'
import React, { useState, useEffect } from 'react'

interface ZoomHintToastProps {
  hasZoomedPast4x: boolean
}

export default function ZoomHintToast({ hasZoomedPast4x }: ZoomHintToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (hasZoomedPast4x) return
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [hasZoomedPast4x])

  if (!visible || hasZoomedPast4x) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 68,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(45,37,32,0.68)',
        backdropFilter: 'blur(8px)',
        color: '#faf7f2',
        fontSize: 7,
        letterSpacing: 0.5,
        borderRadius: 12,
        padding: '5px 12px',
        zIndex: 5,
        whiteSpace: 'nowrap',
      }}
    >
      pinch to zoom + paint
    </div>
  )
}
