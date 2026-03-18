'use client'

import React, { useMemo } from 'react'
import type { PixelView } from '@/lib/mock'
import type { TxStep } from '@/hooks/useBuyPixels'
import { ZERO_ADDRESS } from '@/constants/map'
import { formatUSDT } from '@/lib/colorUtils'
import TxProgress from './TxProgress'
import SuccessState from './SuccessState'

interface OwnerGroup {
  owner: string
  color: string
  label: string
  url: string
  count: number
  price: bigint
  pixelIds: number[]
}

interface SelectionDrawerProps {
  visible: boolean
  selectedIds: Set<number>
  pixelData: PixelView[]
  totalPrice: bigint
  priceLoading: boolean
  insufficientBalance: boolean
  userBalance: bigint
  txStep: TxStep
  txHash: string | null
  onRemovePixels: (ids: number[]) => void
  onClear: () => void
  onBuy: () => void
  onDone: () => void
}

function truncAddr(addr: string): string {
  return addr.slice(0, 6) + '...' + addr.slice(-3)
}

export default function SelectionDrawer({
  visible,
  selectedIds,
  pixelData,
  totalPrice,
  priceLoading,
  insufficientBalance,
  userBalance,
  txStep,
  txHash,
  onRemovePixels,
  onClear,
  onBuy,
  onDone,
}: SelectionDrawerProps) {
  const isTxActive = txStep === 'approving' || txStep === 'buying' || txStep === 'confirming'
  const pixelCount = selectedIds.size

  // Group selected pixels by owner
  const groups = useMemo(() => {
    const map = new Map<string, OwnerGroup>()
    for (const id of selectedIds) {
      const px = pixelData[id]
      if (!px) continue
      const existing = map.get(px.owner)
      if (existing) {
        existing.count++
        existing.price += px.currentPrice
        existing.pixelIds.push(id)
      } else {
        map.set(px.owner, {
          owner: px.owner,
          color: px.color,
          label: px.label,
          url: px.url,
          count: 1,
          price: px.currentPrice,
          pixelIds: [id],
        })
      }
    }
    // Sort: unowned first, then by price desc
    return Array.from(map.values()).sort((a, b) => {
      if (a.owner === ZERO_ADDRESS) return -1
      if (b.owner === ZERO_ADDRESS) return 1
      return Number(b.price - a.price)
    })
  }, [selectedIds, pixelData])

  const ownerCount = groups.filter(g => g.owner !== ZERO_ADDRESS).length

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
        maxHeight: '55vh',
        paddingBottom: 14,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Drag handle */}
      <div style={{ width: 32, height: 3, borderRadius: 2, background: '#c0b8ae', margin: '10px auto 8px', flexShrink: 0 }} />

      {/* Success state */}
      {txStep === 'success' && txHash && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <SuccessState pixelCount={pixelCount} totalPaid={`${formatUSDT(totalPrice)} USDT`} txHash={txHash} onDone={onDone} />
        </div>
      )}

      {/* TX in progress */}
      {isTxActive && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 6, color: '#a09080', letterSpacing: 1 }}>TOTAL COST</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: '#2d2520' }}>{formatUSDT(totalPrice)} USDT</div>
            </div>
          </div>
          <TxProgress step={txStep} />
          <div style={{ flex: 1 }} />
          <button disabled style={{ background: '#6a5f54', color: '#faf7f2', borderRadius: 11, padding: 12, fontSize: 10, fontFamily: 'monospace', letterSpacing: 1.5, textAlign: 'center', width: '100%', border: 'none', pointerEvents: 'none' }}>
            [ PROCESSING... ]
          </button>
        </div>
      )}

      {/* Idle / error — full buy view with breakdown */}
      {(txStep === 'idle' || txStep === 'error') && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 14px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4, flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 6, color: '#a09080', letterSpacing: 1 }}>TOTAL COST</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: '#2d2520' }}>
                {priceLoading ? '...' : `${formatUSDT(totalPrice)}`} <span style={{ fontSize: 10, color: '#a09080' }}>USDT</span>
              </div>
              <div style={{ fontSize: 7, color: '#a09080', marginTop: 2 }}>
                {pixelCount} pixels · {ownerCount > 0 ? `${ownerCount} owner${ownerCount > 1 ? 's' : ''} to pay` : 'all unowned'}
              </div>
            </div>
            <button
              onClick={onClear}
              style={{ fontSize: 7, color: '#a09080', border: '0.5px solid #e0d8ce', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', background: 'transparent' }}
            >
              ✕ clear
            </button>
          </div>

          {/* Balance */}
          <div style={{ fontSize: 7, color: insufficientBalance ? '#e74c3c' : '#a09080', marginBottom: 6, flexShrink: 0 }}>
            balance: {formatUSDT(userBalance)} USDT
            {insufficientBalance && <span style={{ marginLeft: 6, color: '#e74c3c' }}>— insufficient</span>}
          </div>

          {/* Breakdown list */}
          <div style={{ fontSize: 6, color: '#a09080', letterSpacing: 1, marginBottom: 4, flexShrink: 0 }}>BREAKDOWN</div>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: 8 }}>
            {groups.map((group) => {
              const isUnowned = group.owner === ZERO_ADDRESS
              return (
                <div
                  key={group.owner}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '5px 0',
                    borderBottom: '0.5px solid #f5f0e8',
                  }}
                >
                  {/* Color dot */}
                  {isUnowned ? (
                    <div style={{ width: 12, height: 12, borderRadius: 3, border: '0.5px dashed #c0b8ae', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: group.color || '#888', flexShrink: 0 }} />
                  )}

                  {/* Name + link */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 8, color: isUnowned ? '#a09080' : '#2d2520', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {isUnowned ? 'unowned' : (group.label || truncAddr(group.owner))}
                    </div>
                    {!isUnowned && group.url && (
                      <div style={{ fontSize: 6, color: '#4a7fa5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {group.url.replace('https://', '')}
                      </div>
                    )}
                  </div>

                  {/* Count + price */}
                  <span style={{ fontSize: 7, color: '#a09080', flexShrink: 0 }}>{group.count} px</span>
                  <span style={{ fontSize: 8, fontWeight: 500, color: '#2d2520', flexShrink: 0 }}>{formatUSDT(group.price)}</span>

                  {/* Remove button */}
                  <button
                    onClick={() => onRemovePixels(group.pixelIds)}
                    style={{ fontSize: 8, color: '#a09080', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', flexShrink: 0 }}
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>

          {/* Error */}
          {txStep === 'error' && (
            <div style={{ fontSize: 7, color: '#e74c3c', marginBottom: 4, flexShrink: 0 }}>
              Transaction failed. Try again.
            </div>
          )}

          {/* Buy button */}
          <button
            onClick={onBuy}
            style={{
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
            {priceLoading ? '[ CALCULATING... ]' : `[ BUY ALL — ${formatUSDT(totalPrice)} USDT ]`}
          </button>
        </div>
      )}
    </div>
  )
}
