'use client'

import React from 'react'
import { ConnectButton } from '@/components/connect-button'
import { useTheme } from '@/lib/theme'

interface TopBarProps {
  title: string
  children?: React.ReactNode
}

export default function TopBar({ title, children }: TopBarProps) {
  const { toggleTheme, isDark } = useTheme()

  return (
    <div
      className="theme-bar-top"
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 3,
            color: 'var(--text)',
          }}
        >
          {title}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#35d07f',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: 6,
              letterSpacing: 0.5,
              color: 'var(--text-muted)',
            }}
          >
            CELO
          </span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {children}
        <button
          onClick={toggleTheme}
          style={{
            fontSize: 12,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 4px',
            color: 'var(--text)',
          }}
          aria-label="Toggle theme"
        >
          {isDark ? '\u263E' : '\u2600'}
        </button>
        <ConnectButton />
      </div>
    </div>
  )
}
