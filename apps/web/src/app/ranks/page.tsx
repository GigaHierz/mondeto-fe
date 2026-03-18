'use client'

import { useState, useEffect } from 'react'
import TopBar from '@/components/Layout/TopBar'
import BottomNav from '@/components/Layout/BottomNav'
import LeaderboardTabs from '@/components/Leaderboard/LeaderboardTabs'
import LeaderboardRow from '@/components/Leaderboard/LeaderboardRow'
import { useLeaderboard, type LeaderboardTab } from '@/hooks/useLeaderboard'
import { getAllPixels, type PixelView } from '@/lib/mock'

export default function RanksPage() {
  const [pixelData, setPixelData] = useState<PixelView[]>([])
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('AREA')
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    getAllPixels().then(setPixelData)
  }, [])

  const { area, empire, hotPx } = useLeaderboard(pixelData)

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
      <TopBar title="LEADERBOARD" />
      <LeaderboardTabs activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setShowAll(false) }} />
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: '#f5f1ea',
          padding: '5px 0',
          paddingBottom: 56,
        }}
      >
        {hasOwned ? (
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
                  color: '#a09080',
                  background: 'none',
                  border: '0.5px solid #e0d8ce',
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
              stroke="#c0b8ae"
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx={12} cy={12} r={10} />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            <span style={{ fontSize: 8, color: '#a09080' }}>no claims yet</span>
            <span style={{ fontSize: 8, color: '#a09080' }}>be the first to own the world</span>
          </div>
        )}
      </div>
      <BottomNav activeRoute="/ranks" />
    </div>
  )
}
