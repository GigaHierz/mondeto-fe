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
        background: 'var(--card-bg)',
        borderBottom: '1px solid var(--border)',
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
              color: isActive ? 'var(--text)' : 'var(--text-muted)',
              background: 'none',
              border: 'none',
              borderBottomWidth: 2,
              borderBottomStyle: 'solid',
              borderBottomColor: isActive ? 'var(--text)' : 'transparent',
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
