'use client'

import type { LeaderboardTab } from '@/hooks/useLeaderboard'

interface LeaderboardTabsProps {
  activeTab: LeaderboardTab
  onTabChange: (tab: LeaderboardTab) => void
}

const tabs: LeaderboardTab[] = ['AREA', 'EMPIRE', 'HOT_PX']

export default function LeaderboardTabs({ activeTab, onTabChange }: LeaderboardTabsProps) {
  return (
    <div
      style={{
        height: 30,
        background: '#faf7f2',
        borderBottom: '0.5px solid #e0d8ce',
        display: 'flex',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab === activeTab
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 7,
              fontFamily: 'monospace',
              letterSpacing: 0.3,
              lineHeight: '30px',
              cursor: 'pointer',
              color: isActive ? '#2d2520' : '#a09080',
              borderBottom: isActive ? '2px solid #2d2520' : '2px solid transparent',
              background: 'none',
              border: 'none',
              borderBottomWidth: 2,
              borderBottomStyle: 'solid',
              borderBottomColor: isActive ? '#2d2520' : 'transparent',
              padding: 0,
            }}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
