'use client'

import React from 'react'
import { ConnectButton } from '@/components/connect-button'

interface TopBarProps {
  title: string
  children?: React.ReactNode
}

export default function TopBar({ title, children }: TopBarProps) {
  return (
    <div
      className="frosted-topbar"
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
          color: '#2d2520',
        }}
      >
        {title}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {children}
        <ConnectButton />
      </div>
    </div>
  )
}
