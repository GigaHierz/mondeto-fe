'use client'

import React from 'react'

interface SuccessStateProps {
  pixelCount: number
  totalPaid: string
  txHash: string
  onDone: () => void
}

export default function SuccessState({ pixelCount, totalPaid, txHash, onDone }: SuccessStateProps) {
  const truncatedHash = txHash.slice(0, 8) + '...' + txHash.slice(-6)

  return (
    <div>
      {/* Success icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: '#2d6a4f',
          margin: '0 auto 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 20, color: 'white' }}>✓</span>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: 'var(--text)',
          letterSpacing: 1,
          textAlign: 'center',
        }}
      >
        LAND CLAIMED
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 8,
          color: 'var(--text-muted)',
          marginTop: 4,
          textAlign: 'center',
        }}
      >
        {pixelCount} pixels now yours
      </div>

      {/* Receipt */}
      <div style={{ fontSize: 8, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
        paid {totalPaid}
      </div>

      {/* Done button */}
      <button
        onClick={onDone}
        style={{
          margin: '8px 14px 0',
          background: '#2d6a4f',
          color: '#faf7f2',
          borderRadius: 11,
          padding: 10,
          fontSize: 9,
          fontFamily: 'monospace',
          letterSpacing: 1.5,
          textAlign: 'center',
          width: 'calc(100% - 28px)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        [ DONE ]
      </button>
    </div>
  )
}
