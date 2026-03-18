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
          color: '#2d2520',
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
          color: '#a09080',
          marginTop: 4,
          textAlign: 'center',
        }}
      >
        {pixelCount} pixels now yours
      </div>

      {/* Receipt card */}
      <div
        style={{
          background: '#f5f1ea',
          border: '0.5px solid #e0d8ce',
          borderRadius: 10,
          padding: '10px 12px',
          margin: '12px 14px',
        }}
      >
        {/* PAID row */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 7, color: '#a09080', letterSpacing: 1 }}>PAID</span>
          <span style={{ fontSize: 9, color: '#2d2520' }}>{totalPaid}</span>
        </div>

        {/* TX row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 7, color: '#a09080', letterSpacing: 1 }}>TX</span>
          <span style={{ fontSize: 9, color: '#4a7fa5' }}>{truncatedHash}</span>
        </div>
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
