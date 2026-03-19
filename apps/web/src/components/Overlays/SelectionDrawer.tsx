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
  userAddress?: string
  profilesMap?: Map<string, { label: string; url: string }>
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
  userAddress,
  profilesMap,
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
        background: 'var(--card-bg)',
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
              <div style={{ fontSize: 6, color: 'var(--text-muted)', letterSpacing: 1 }}>THE DAMAGE</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--text)' }}>{formatUSDT(totalPrice)} USDT</div>
            </div>
          </div>
          <TxProgress step={txStep} />
          <div style={{ flex: 1 }} />
          <button disabled style={{ background: 'var(--button-bg)', color: 'var(--button-text)', opacity: 0.5, borderRadius: 11, padding: 12, fontSize: 8, fontFamily: "'Press Start 2P', monospace", letterSpacing: 2, textAlign: 'center', width: '100%', border: 'none', pointerEvents: 'none' }}>
            [ MAKING MOVES... ]
          </button>
        </div>
      )}

      {/* Idle / error — full buy view with breakdown */}
      {(txStep === 'idle' || txStep === 'error') && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 20px', overflow: 'hidden', maxWidth: 500, margin: '0 auto', width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 8, flexShrink: 0 }}>
            <div style={{ fontSize: 7, fontFamily: "'Press Start 2P', monospace", color: 'var(--text-muted)', letterSpacing: 2, marginBottom: 6 }}>THE DAMAGE</div>
            <div style={{ fontSize: 18, fontFamily: "'Press Start 2P', monospace", color: 'var(--text)' }}>
              {priceLoading ? '...' : `${formatUSDT(totalPrice)}`} <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>USDT</span>
            </div>
            <div style={{ fontSize: 7, fontFamily: "'Press Start 2P', monospace", color: 'var(--text-muted)', marginTop: 6, letterSpacing: 1 }}>
              {pixelCount} spots · {ownerCount > 0 ? `${ownerCount} player${ownerCount > 1 ? 's' : ''} to outbid` : 'free real estate'}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6, flexShrink: 0 }}>
            <button
              onClick={onClear}
              style={{ fontSize: 6, fontFamily: "'Press Start 2P', monospace", color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 8, padding: '3px 8px', cursor: 'pointer', background: 'transparent', letterSpacing: 1 }}
            >
              x clear
            </button>
          </div>

          {/* Balance + warnings */}
          <div style={{ fontSize: 7, fontFamily: "'Press Start 2P', monospace", color: 'var(--text-muted)', marginBottom: 4, flexShrink: 0, textAlign: 'center', letterSpacing: 1 }}>
            balance: {formatUSDT(userBalance)} USDT
          </div>
          {insufficientBalance && (
            <div style={{ fontSize: 7, color: 'var(--error)', marginBottom: 2, flexShrink: 0 }}>
              not enough balance — you need {formatUSDT(totalPrice)} but only have {formatUSDT(userBalance)}
            </div>
          )}
          {userAddress && groups.some(g => g.owner.toLowerCase() === userAddress.toLowerCase()) && (
            <div style={{ fontSize: 7, color: '#e6a817', marginBottom: 2, flexShrink: 0 }}>
              ⚠ you already own some of these pixels — buying again will increase their price
            </div>
          )}

          {/* Breakdown list */}
          <div style={{ fontSize: 6, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 4, flexShrink: 0 }}>THE LOWDOWN</div>
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
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {/* Color dot — owner colors stay as-is */}
                  {isUnowned ? (
                    <div style={{ width: 12, height: 12, borderRadius: 3, border: '0.5px dashed #c0b8ae', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: group.color || '#888', flexShrink: 0 }} />
                  )}

                  {/* Name + link */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {(() => {
                      const prof = profilesMap?.get(group.owner.toLowerCase())
                      const name = prof?.label || group.label || (isUnowned ? 'unowned' : truncAddr(group.owner))
                      const url = prof?.url || group.url
                      return (
                        <>
                          <div style={{ fontSize: 8, color: isUnowned ? 'var(--text-muted)' : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {name}
                          </div>
                          {!isUnowned && url && (
                            <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 6, color: 'var(--accent)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', textDecoration: 'none' }}>
                              {url.replace('https://', '').replace('http://', '').replace(/\/$/, '')}
                            </a>
                          )}
                        </>
                      )
                    })()}
                  </div>

                  {/* Count + price */}
                  <span style={{ fontSize: 7, color: 'var(--text-muted)', flexShrink: 0 }}>{group.count} px</span>
                  <span style={{ fontSize: 8, fontWeight: 500, color: 'var(--text)', flexShrink: 0 }}>{formatUSDT(group.price)}</span>

                  {/* Remove button */}
                  <button
                    onClick={() => onRemovePixels(group.pixelIds)}
                    style={{ fontSize: 8, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', flexShrink: 0 }}
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>

          {/* Error */}
          {txStep === 'error' && (
            <div style={{ fontSize: 7, color: 'var(--error)', marginBottom: 4, flexShrink: 0 }}>
              That didn't work. Try again?
            </div>
          )}

          {/* Buy button */}
          <button
            onClick={onBuy}
            style={{
              background: 'var(--button-bg)',
              color: 'var(--button-text)',
              opacity: insufficientBalance || priceLoading ? 0.5 : 1,
              borderRadius: 11,
              padding: 14,
              fontSize: 8,
              fontFamily: "'Press Start 2P', monospace",
              letterSpacing: 2,
              textAlign: 'center',
              border: 'none',
              cursor: insufficientBalance || priceLoading ? 'default' : 'pointer',
              width: '100%',
              pointerEvents: insufficientBalance || priceLoading ? 'none' : 'auto',
              flexShrink: 0,
            }}
          >
            {priceLoading ? '[ CHECKING PRICES... ]' : insufficientBalance ? '[ NOT ENOUGH FUNDS ]' : `[ LOCK IT IN — ${formatUSDT(totalPrice)} USDT ]`}
          </button>
        </div>
      )}
    </div>
  )
}
