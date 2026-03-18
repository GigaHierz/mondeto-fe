'use client'

import React from 'react'
import type { TxStep } from '@/hooks/useBuyPixels'
import { formatUSDT } from '@/lib/colorUtils'
import TxProgress from './TxProgress'
import SuccessState from './SuccessState'

interface SelectionDrawerProps {
  visible: boolean
  pixelCount: number
  totalPrice: bigint
  priceLoading: boolean
  insufficientBalance: boolean
  txStep: TxStep
  txHash: string | null
  onClear: () => void
  onBuy: () => void
  onDone: () => void
}

export default function SelectionDrawer({
  visible,
  pixelCount,
  totalPrice,
  priceLoading,
  insufficientBalance,
  txStep,
  txHash,
  onClear,
  onBuy,
  onDone,
}: SelectionDrawerProps) {
  const isTxActive = txStep === 'approving' || txStep === 'buying' || txStep === 'confirming'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 56,
        left: 0,
        right: 0,
        zIndex: 50,
        background: '#faf7f2',
        borderRadius: '18px 18px 0 0',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
        height: '30vh',
        paddingBottom: 20,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Drag handle */}
      <div
        style={{
          width: 32,
          height: 3,
          borderRadius: 2,
          background: '#c0b8ae',
          margin: '10px auto 8px',
          flexShrink: 0,
        }}
      />

      {/* Success state */}
      {txStep === 'success' && txHash && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <SuccessState
            pixelCount={pixelCount}
            totalPaid={`${formatUSDT(totalPrice)} USDT`}
            txHash={txHash}
            onDone={onDone}
          />
        </div>
      )}

      {/* TX in progress */}
      {isTxActive && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 6, color: '#a09080', letterSpacing: 1 }}>SELECTED</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#2d2520' }}>{pixelCount} pixels</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 6, color: '#a09080', letterSpacing: 1 }}>TOTAL COST</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#2d2520' }}>{formatUSDT(totalPrice)} USDT</div>
            </div>
          </div>
          <TxProgress step={txStep} />
          <div style={{ flex: 1 }} />
          <button
            disabled
            style={{
              margin: '0 0 14px',
              background: '#6a5f54',
              color: '#faf7f2',
              borderRadius: 11,
              padding: 12,
              fontSize: 10,
              fontFamily: 'monospace',
              letterSpacing: 1.5,
              textAlign: 'center',
              width: '100%',
              border: 'none',
              pointerEvents: 'none',
              flexShrink: 0,
            }}
          >
            [ PROCESSING... ]
          </button>
        </div>
      )}

      {/* Idle / error — simple buy view */}
      {(txStep === 'idle' || txStep === 'error') && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 14px' }}>
          {/* Header: pixels + price + clear */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <div>
              <div style={{ fontSize: 6, color: '#a09080', letterSpacing: 1 }}>SELECTED</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: '#2d2520' }}>{pixelCount} pixels</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 6, color: '#a09080', letterSpacing: 1 }}>TOTAL COST</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: '#2d2520' }}>
                {priceLoading ? '...' : `${formatUSDT(totalPrice)} USDT`}
              </div>
            </div>
            <button
              onClick={onClear}
              style={{
                fontSize: 7,
                color: '#a09080',
                border: '0.5px solid #e0d8ce',
                borderRadius: 8,
                padding: '4px 8px',
                cursor: 'pointer',
                background: 'transparent',
                alignSelf: 'flex-start',
              }}
            >
              ✕ clear
            </button>
          </div>

          {/* Insufficient balance warning */}
          {insufficientBalance && (
            <div style={{ fontSize: 7, color: '#e74c3c', marginBottom: 4 }}>
              insufficient balance
            </div>
          )}

          {/* Error */}
          {txStep === 'error' && (
            <div style={{ fontSize: 7, color: '#e74c3c', marginBottom: 4 }}>
              Transaction failed. Try again.
            </div>
          )}

          {/* Spacer pushes button to bottom */}
          <div style={{ flex: 1 }} />

          {/* Buy button — always at bottom of drawer */}
          <button
            onClick={onBuy}
            style={{
              margin: '0 0 14px',
              background: insufficientBalance || priceLoading ? '#6a5f54' : '#2d2520',
              color: '#faf7f2',
              borderRadius: 11,
              padding: 14,
              fontSize: 11,
              fontFamily: 'monospace',
              letterSpacing: 1.5,
              textAlign: 'center',
              border: 'none',
              cursor: insufficientBalance || priceLoading ? 'default' : 'pointer',
              width: '100%',
              pointerEvents: insufficientBalance || priceLoading ? 'none' : 'auto',
              flexShrink: 0,
            }}
          >
            {priceLoading
              ? '[ CALCULATING... ]'
              : `[ BUY LAND — ${formatUSDT(totalPrice)} USDT ]`}
          </button>
        </div>
      )}
    </div>
  )
}
