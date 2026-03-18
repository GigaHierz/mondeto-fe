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
  const displayUrl = entry.url?.replace('https://', '').replace('http://', '').replace(/\/$/, '')

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 9,
        padding: '10px 12px',
        margin: '3px 7px',
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 500,
          width: 18,
          textAlign: 'right',
          color: rankColor(entry.rank),
          flexShrink: 0,
        }}
      >
        {entry.rank}
      </span>
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          background: entry.color || 'var(--text-muted)',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {entry.label || truncateAddress(entry.owner)}
        </div>
        {displayUrl && (
          <div style={{ fontSize: 7, color: 'var(--accent)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>
            {displayUrl}
          </div>
        )}
      </div>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {entry.value} {entry.unit}
      </span>
    </div>
  )
}
