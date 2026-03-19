'use client'

import type { LeaderboardTab } from '@/hooks/useLeaderboard'

interface LeaderboardTabsProps {
  activeTab: LeaderboardTab
  onTabChange: (tab: LeaderboardTab) => void
}

const tabConfig: { key: LeaderboardTab; label: string; description: string }[] = [
  {
    key: 'AREA',
    label: 'LAND',
    description: 'Who owns the most pixels on the map.',
  },
  {
    key: 'EMPIRE',
    label: 'EMPIRE',
    description: 'Largest connected territory held by a single owner.',
  },
  {
    key: 'TYCOONS',
    label: 'TYCOONS',
    description: 'Who holds the single most valuable pixel.',
  },
]

export default function LeaderboardTabs({ activeTab, onTabChange }: LeaderboardTabsProps) {
  const active = tabConfig.find(t => t.key === activeTab)

  return (
    <div>
      <div
        style={{
          height: 34,
          background: 'var(--card-bg)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
        }}
      >
        {tabConfig.map((tab) => {
          const isActive = tab.key === activeTab
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 8,
                fontFamily: "'Press Start 2P', monospace",
                letterSpacing: 2,
                lineHeight: '34px',
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
              {tab.label}
            </button>
          )
        })}
      </div>
      {active && (
        <div
          style={{
            padding: '8px 12px',
            fontSize: 7,
            color: 'var(--text-muted)',
            fontFamily: "'Press Start 2P', monospace",
            letterSpacing: 1,
            borderBottom: '1px solid var(--border)',
            background: 'var(--card-bg)',
          }}
        >
          {active.description}
        </div>
      )}
    </div>
  )
}
