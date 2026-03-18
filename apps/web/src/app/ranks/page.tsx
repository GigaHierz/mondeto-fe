'use client'

import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import TopBar from '@/components/Layout/TopBar'
import BottomNav from '@/components/Layout/BottomNav'
import LeaderboardTabs from '@/components/Leaderboard/LeaderboardTabs'
import LeaderboardRow from '@/components/Leaderboard/LeaderboardRow'
import { useLeaderboard, type LeaderboardTab, type OwnerProfileData } from '@/hooks/useLeaderboard'
import { getAllPixels, type PixelView } from '@/lib/mock'
import { fetchAllPixelsFromContract } from '@/lib/contractReads'
import { MONDETO_ADDRESS, MONDETO_ABI } from '@/lib/contract'
import { ZERO_ADDRESS } from '@/constants/map'
import { uint24ToHex } from '@/lib/colorUtils'

export default function RanksPage() {
  const publicClient = usePublicClient()
  const [pixelData, setPixelData] = useState<PixelView[]>([])
  const [profilesMap, setProfilesMap] = useState<Map<string, OwnerProfileData>>(new Map())
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('AREA')
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      let data: PixelView[]
      try {
        if (publicClient) {
          data = await fetchAllPixelsFromContract(
            publicClient.readContract.bind(publicClient) as Parameters<typeof fetchAllPixelsFromContract>[0]
          )
        } else {
          data = await getAllPixels()
        }
      } catch (e) {
        console.warn('Failed to fetch from contract, using mock:', e)
        data = await getAllPixels()
      }
      setPixelData(data)

      // Fetch profiles for unique owners
      if (publicClient) {
        const uniqueOwners = new Set<string>()
        for (const px of data) {
          if (px.owner !== ZERO_ADDRESS && px.owner !== '0x0000000000000000000000000000000000000000') {
            uniqueOwners.add(px.owner.toLowerCase())
          }
        }

        const profiles = new Map<string, OwnerProfileData>()
        const ownerArray = [...uniqueOwners]

        // Fetch profiles in parallel (batches of 10)
        for (let i = 0; i < ownerArray.length; i += 10) {
          const batch = ownerArray.slice(i, i + 10)
          const results = await Promise.allSettled(
            batch.map(addr =>
              publicClient.readContract({
                address: MONDETO_ADDRESS,
                abi: MONDETO_ABI,
                functionName: 'profiles',
                args: [addr as `0x${string}`],
              })
            )
          )
          for (let j = 0; j < results.length; j++) {
            const result = results[j]
            if (result.status === 'fulfilled' && result.value) {
              const [color, labelBytes, urlBytes] = result.value as [number, string, string]
              let label = ''
              let url = ''
              try {
                if (labelBytes && labelBytes !== '0x') {
                  label = Buffer.from(labelBytes.slice(2), 'hex').toString('utf-8')
                }
                if (urlBytes && urlBytes !== '0x') {
                  url = Buffer.from(urlBytes.slice(2), 'hex').toString('utf-8')
                }
              } catch {
                if (typeof labelBytes === 'string' && !labelBytes.startsWith('0x')) label = labelBytes
                if (typeof urlBytes === 'string' && !urlBytes.startsWith('0x')) url = urlBytes
              }
              profiles.set(batch[j], {
                label,
                url,
                color: color ? uint24ToHex(color) : '',
              })
            }
          }
        }
        setProfilesMap(profiles)
      }
      setLoading(false)
    }
    load()
  }, [publicClient])

  const { area, empire, hotPx } = useLeaderboard(pixelData, profilesMap)

  const dataMap: Record<LeaderboardTab, typeof area> = {
    AREA: area,
    EMPIRE: empire,
    HOT_PX: hotPx,
  }

  const currentData = dataMap[activeTab]
  const displayData = showAll ? currentData : currentData.slice(0, 20)
  const hasOwned = currentData.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingTop: 36 }}>
      <TopBar title="RANKS" />
      <LeaderboardTabs activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setShowAll(false) }} />
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: 'var(--bg)',
          padding: '5px 0',
          paddingBottom: 56,
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '40%', gap: 8 }}>
            <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="var(--text-muted)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 2s linear infinite' }}>
              <circle cx={12} cy={12} r={10} />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            <span style={{ fontSize: 7, color: 'var(--text-muted)', letterSpacing: 0.5 }}>loading on-chain data</span>
          </div>
        ) : hasOwned ? (
          <>
            {displayData.map((entry) => (
              <LeaderboardRow key={entry.owner} entry={entry} />
            ))}
            {!showAll && currentData.length > 20 && (
              <button
                onClick={() => setShowAll(true)}
                style={{
                  display: 'block',
                  margin: '8px auto',
                  fontSize: 7,
                  fontFamily: 'monospace',
                  color: 'var(--text-muted)',
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '5px 12px',
                  cursor: 'pointer',
                  letterSpacing: 0.5,
                }}
              >
                show more
              </button>
            )}
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60%',
              gap: 8,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={32}
              height={32}
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx={12} cy={12} r={10} />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>no claims yet</span>
            <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>be the first to own the world</span>
          </div>
        )}
      </div>
      <BottomNav activeRoute="/ranks" />
    </div>
  )
}
