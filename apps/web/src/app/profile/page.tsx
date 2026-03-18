'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import ScreenHeader from '@/components/Layout/ScreenHeader'
import BottomNav from '@/components/Layout/BottomNav'
import AvatarBlock from '@/components/Profile/AvatarBlock'
import StatsRow from '@/components/Profile/StatsRow'
import ColorPicker from '@/components/Profile/ColorPicker'
import { useProfile } from '@/hooks/useProfile'
import { getAllPixels, type PixelView } from '@/lib/mock'
import { ZERO_ADDRESS } from '@/constants/map'
import { formatUSDT } from '@/lib/colorUtils'

export default function ProfilePage() {
  const { address } = useAccount()
  const addrStr = address as string | undefined
  const { name, setName, url, setUrl, color, setColor, saveState, save } = useProfile(addrStr)
  const [pixelData, setPixelData] = useState<PixelView[]>([])

  useEffect(() => {
    getAllPixels().then(setPixelData)
  }, [])

  const stats = useMemo(() => {
    if (!addrStr) return { pixels: 0, usdt: '0.00', rank: 0 }

    // Count pixels and total value for connected user
    let count = 0
    let totalValue = 0n
    for (const px of pixelData) {
      if (px.owner.toLowerCase() === addrStr.toLowerCase()) {
        count++
        totalValue += px.currentPrice
      }
    }

    // Compute rank by area
    const counts = new Map<string, number>()
    for (const px of pixelData) {
      if (px.owner === ZERO_ADDRESS) continue
      counts.set(px.owner, (counts.get(px.owner) ?? 0) + 1)
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])
    const rankIdx = sorted.findIndex(([owner]) => owner.toLowerCase() === addrStr.toLowerCase())
    const rank = rankIdx >= 0 ? rankIdx + 1 : 0

    return { pixels: count, usdt: formatUSDT(totalValue), rank }
  }, [pixelData, addrStr])

  const saveLabel =
    saveState === 'saving' ? '[ SAVING... ]' :
    saveState === 'saved' ? '[ SAVED \u2713 ]' :
    '[ SAVE ]'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <ScreenHeader title="PROFILE" />
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: '#f5f1ea',
          paddingBottom: 56,
        }}
      >
        <AvatarBlock color={color} name={name} />
        <StatsRow pixels={stats.pixels} usdt={stats.usdt} rank={stats.rank} />

        {/* Name field */}
        <div
          style={{
            background: '#faf7f2',
            border: '0.5px solid #e0d8ce',
            borderRadius: 8,
            padding: '6px 9px',
            margin: '0 10px 6px',
          }}
        >
          <div
            style={{
              fontSize: 6,
              color: '#a09080',
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 2,
            }}
          >
            NAME
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={32}
            placeholder="enter name..."
            style={{
              fontSize: 9,
              fontFamily: 'monospace',
              color: '#2d2520',
              background: 'transparent',
              border: 'none',
              width: '100%',
              outline: 'none',
            }}
          />
        </div>

        {/* URL field */}
        <div
          style={{
            background: '#faf7f2',
            border: '0.5px solid #e0d8ce',
            borderRadius: 8,
            padding: '6px 9px',
            margin: '0 10px 6px',
          }}
        >
          <div
            style={{
              fontSize: 6,
              color: '#a09080',
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 2,
            }}
          >
            URL
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            style={{
              fontSize: 9,
              fontFamily: 'monospace',
              color: url ? '#4a7fa5' : '#2d2520',
              background: 'transparent',
              border: 'none',
              width: '100%',
              outline: 'none',
            }}
          />
        </div>

        <ColorPicker color={color} onChange={setColor} />

        {/* Save button */}
        <button
          onClick={save}
          disabled={saveState === 'saving'}
          style={{
            display: 'block',
            margin: '6px 10px',
            width: 'calc(100% - 20px)',
            background: saveState === 'saving' ? '#6a5f54' : '#2d2520',
            color: '#faf7f2',
            borderRadius: 10,
            padding: 9,
            fontSize: 8,
            fontFamily: 'monospace',
            letterSpacing: 1.5,
            textAlign: 'center',
            border: 'none',
            cursor: saveState === 'saving' ? 'default' : 'pointer',
            pointerEvents: saveState === 'saving' ? 'none' : 'auto',
          }}
        >
          {saveLabel}
        </button>

        {!addrStr && (
          <div
            style={{
              fontSize: 7,
              color: '#a09080',
              textAlign: 'center',
              marginTop: 6,
            }}
          >
            connect wallet to save on-chain
          </div>
        )}
      </div>
      <BottomNav activeRoute="/profile" />
    </div>
  )
}
