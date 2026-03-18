'use client'

import type { LeaderboardEntry } from '@/hooks/useLeaderboard'

interface LeaderboardRowProps {
  entry: LeaderboardEntry
}

function rankColor(rank: number): string {
  if (rank === 1) return '#c9962a'
  if (rank === 2) return '#8a9aaa'
  if (rank === 3) return '#a07050'
  return 'var(--text-muted)'
}

function truncateAddress(addr: string): string {
  return `0x${addr.slice(2, 6)}...${addr.slice(-3)}`
}

export default function LeaderboardRow({ entry }: LeaderboardRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 9,
        padding: '7px 10px',
        margin: '3px 7px',
      }}
    >
      <span
        style={{
          fontSize: 9,
          fontWeight: 500,
          width: 14,
          textAlign: 'right',
          color: rankColor(entry.rank),
        }}
      >
        {entry.rank}
      </span>
      <div
        style={{
          width: 13,
          height: 13,
          borderRadius: 3,
          background: entry.color,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 8, flex: 1, color: 'var(--text)' }}>
        {entry.label || truncateAddress(entry.owner)}
      </span>
      <span style={{ fontSize: 8, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
        {entry.value} {entry.unit}
      </span>
    </div>
  )
}
