'use client'
import React, { useEffect, useRef, useState } from 'react'
import { MAX_SELECT } from '@/constants/map'

interface PaintModeBannerProps {
  visible: boolean
  scale: number
  pixelCount: number
  limitBump?: number
}

export default function PaintModeBanner({
  visible,
  scale,
  pixelCount,
  limitBump = 0,
}: PaintModeBannerProps) {
  const isAtLimit = pixelCount >= MAX_SELECT
  const [shaking, setShaking] = useState(false)
  const prevBumpRef = useRef(limitBump)

  // Trigger shake each time limitBump increments
  useEffect(() => {
    if (limitBump > prevBumpRef.current) {
      setShaking(true)
      const t = setTimeout(() => setShaking(false), 400)
      prevBumpRef.current = limitBump
      return () => clearTimeout(t)
    }
    prevBumpRef.current = limitBump
  }, [limitBump])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 56,
        left: 0,
        right: 0,
        height: 30,
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
          fontSize: 9,
          fontWeight: 600,
          color: 'var(--text)',
          letterSpacing: 1,
        }}
      >
        PAINT MODE — drag to select pixels
      </span>
      <span
        className={shaking ? 'animate-shake' : ''}
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: isAtLimit ? 'var(--error)' : 'var(--text)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {isAtLimit && (
          <span
            style={{
              fontSize: 7,
              fontWeight: 700,
              background: 'var(--error)',
              color: '#fff',
              padding: '1px 4px',
              borderRadius: 3,
              letterSpacing: 0.5,
            }}
          >
            MAX
          </span>
        )}
        {pixelCount} / {MAX_SELECT}
      </span>
    </div>
  )
}
