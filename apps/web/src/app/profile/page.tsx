'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import TopBar from '@/components/Layout/TopBar'
import BottomNav from '@/components/Layout/BottomNav'
import AvatarBlock from '@/components/Profile/AvatarBlock'
import StatsRow from '@/components/Profile/StatsRow'
import ColorPicker from '@/components/Profile/ColorPicker'
import { useProfile } from '@/hooks/useProfile'
import { useUSDTBalance } from '@/hooks/useUSDTBalance'
import { MONDETO_ADDRESS, MONDETO_ABI } from '@/lib/contract'
import { WIDTH, HEIGHT, ZERO_ADDRESS } from '@/constants/map'
import { formatUSDT } from '@/lib/colorUtils'
import { isLand } from '@/lib/landMask'

export default function ProfilePage() {
  const { address } = useAccount()
  const addrStr = address as string | undefined
  const { name, setName, url, setUrl, color, setColor, saveState, save } = useProfile(addrStr)
  const walletBalance = useUSDTBalance()
  const publicClient = usePublicClient()

  const [pixelCount, setPixelCount] = useState(0)
  const [rank, setRank] = useState(0)
  const [spent, setSpent] = useState(0n)
  const [earned, setEarned] = useState(0n)

  // Fetch owned pixel count from contract
  useEffect(() => {
    if (!publicClient || !addrStr) return

    async function fetchStats() {
      try {
        // Fetch pixel batch for the full map
        const batchData = await publicClient!.readContract({
          address: MONDETO_ADDRESS,
          abi: MONDETO_ABI,
          functionName: 'getPixelBatch',
          args: [0, 0, WIDTH, HEIGHT],
        }) as `0x${string}`

        // Decode packed bytes: 24 bytes per land pixel
        const hex = batchData.slice(2) // remove 0x
        const byteCount = hex.length / 2
        const recordCount = Math.floor(byteCount / 24)

        // Count pixels owned by current user and track all owners for rank
        const ownerCounts = new Map<string, number>()
        let myCount = 0

        for (let i = 0; i < recordCount; i++) {
          const offset = i * 48 // 24 bytes = 48 hex chars
          const ownerHex = '0x' + hex.slice(offset, offset + 40)
          if (ownerHex === '0x0000000000000000000000000000000000000000') continue

          const count = (ownerCounts.get(ownerHex.toLowerCase()) ?? 0) + 1
          ownerCounts.set(ownerHex.toLowerCase(), count)

          if (ownerHex.toLowerCase() === addrStr!.toLowerCase()) {
            myCount++
          }
        }

        setPixelCount(myCount)

        // Compute rank
        const sorted = [...ownerCounts.entries()].sort((a, b) => b[1] - a[1])
        const rankIdx = sorted.findIndex(([owner]) => owner === addrStr!.toLowerCase())
        setRank(rankIdx >= 0 ? rankIdx + 1 : 0)
      } catch (e) {
        console.warn('Failed to fetch pixel stats from contract:', e)
      }
    }

    fetchStats()

    // Fetch P&L from PixelsPurchased events
    async function fetchPnL() {
      try {
        const { parseAbiItem } = await import('viem')
        const currentBlock = await publicClient!.getBlockNumber()
        // Search last 500k blocks (~1 week on Celo)
        const fromBlock = currentBlock > 500000n ? currentBlock - 500000n : 0n

        const logs = await publicClient!.getLogs({
          address: MONDETO_ADDRESS,
          event: parseAbiItem('event PixelsPurchased(address indexed buyer, uint256[] ids, uint256 totalCost)'),
          fromBlock,
          toBlock: currentBlock,
        })

        const addr = addrStr!.toLowerCase()
        let totalSpent = 0n
        let totalEarned = 0n

        // Track pixel ownership over time to compute earnings
        const ownerOf = new Map<string, string>()

        for (const log of logs) {
          const buyer = (log.args.buyer as string).toLowerCase()
          const ids = log.args.ids as bigint[]
          const totalCost = log.args.totalCost as bigint

          if (buyer === addr) {
            totalSpent += totalCost
          }

          const perPixelCost = ids.length > 0 ? totalCost / BigInt(ids.length) : 0n

          for (const id of ids) {
            const idStr = id.toString()
            const prevOwner = ownerOf.get(idStr)
            if (prevOwner === addr) {
              totalEarned += perPixelCost
            }
            ownerOf.set(idStr, buyer)
          }
        }

        setSpent(totalSpent)
        setEarned(totalEarned)
      } catch (e) {
        console.warn('Failed to fetch P&L:', e)
      }
    }

    fetchPnL()
  }, [publicClient, addrStr])

  const saveLabel =
    saveState === 'saving' ? '[ SAVING... ]' :
    saveState === 'confirming' ? '[ CONFIRMING... ]' :
    saveState === 'saved' ? '[ SAVED \u2713 ]' :
    '[ SAVE ]'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingTop: 60 }}>
      <TopBar title="MONDETO" />
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: 'var(--bg)',
          paddingBottom: 56,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AvatarBlock color={color} name={name} />
        <StatsRow
          pixels={pixelCount}
          usdt={parseFloat(walletBalance.balance) < 1 ? parseFloat(walletBalance.balance).toFixed(4) : parseFloat(walletBalance.balance) >= 100 ? Math.floor(parseFloat(walletBalance.balance)).toString() : parseFloat(walletBalance.balance).toFixed(2)}
          rank={rank}
          spent={formatUSDT(spent)}
          earned={formatUSDT(earned)}
        />

        <div style={{ width: '100%', maxWidth: 460, padding: '0 16px' }}>
          {/* Name field */}
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '10px 12px',
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 6, fontFamily: "'Press Start 2P', monospace", color: 'var(--text-muted)', letterSpacing: 2, marginBottom: 6 }}>
              NAME
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={32}
              placeholder="enter name..."
              style={{ fontSize: 10, fontFamily: "'Press Start 2P', monospace", letterSpacing: 1, color: 'var(--text)', background: 'transparent', border: 'none', width: '100%', outline: 'none' }}
            />
          </div>

          {/* URL field */}
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '10px 12px',
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 6, fontFamily: "'Press Start 2P', monospace", color: 'var(--text-muted)', letterSpacing: 2, marginBottom: 6 }}>
              URL
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              style={{ fontSize: 9, fontFamily: "'Press Start 2P', monospace", letterSpacing: 1, color: url ? 'var(--accent)' : 'var(--text)', background: 'transparent', border: 'none', width: '100%', outline: 'none' }}
            />
          </div>

          <ColorPicker color={color} onChange={setColor} />

          {/* Save button */}
          <button
            onClick={save}
            disabled={saveState === 'saving' || saveState === 'confirming'}
            style={{
              display: 'block',
              margin: '8px 0',
              width: '100%',
              background: (saveState === 'saving' || saveState === 'confirming') ? 'var(--text-muted)' : 'var(--button-bg)',
              color: 'var(--button-text)',
              borderRadius: 10,
              padding: 12,
              fontSize: 8,
              fontFamily: "'Press Start 2P', monospace",
              letterSpacing: 2,
              textAlign: 'center',
              border: 'none',
              cursor: (saveState === 'saving' || saveState === 'confirming') ? 'default' : 'pointer',
            }}
          >
            {saveLabel}
          </button>

          {!addrStr && (
            <div style={{ fontSize: 7, fontFamily: "'Press Start 2P', monospace", color: 'var(--text-muted)', textAlign: 'center', marginTop: 8, letterSpacing: 1 }}>
              connect wallet to save on-chain
            </div>
          )}
        </div>
      </div>
      <BottomNav activeRoute="/profile" />
    </div>
  )
}
