'use client'

import type { LeaderboardEntry } from '@/hooks/useLeaderboard'

interface LeaderboardRowProps {
  entry: LeaderboardEntry
}

const PIXEL_FONT = "'Press Start 2P', monospace"

function rankSuffix(rank: number): string {
  if (rank === 1) return '1ST'
  if (rank === 2) return '2ND'
  if (rank === 3) return '3RD'
  return `${rank}TH`
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
  const isTop3 = entry.rank <= 3

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: isTop3 ? '14px 16px' : '10px 16px',
        borderBottom: '1px solid var(--border)',
        maxWidth: 500,
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Rank */}
      <span
        style={{
          fontSize: isTop3 ? 12 : 9,
          fontWeight: 700,
          width: 40,
          textAlign: 'right',
          color: rankColor(entry.rank),
          flexShrink: 0,
          fontFamily: PIXEL_FONT,
          letterSpacing: 2,
        }}
      >
        {rankSuffix(entry.rank)}
      </span>

      {/* Name + URL */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: isTop3 ? 10 : 8,
            fontFamily: PIXEL_FONT,
            letterSpacing: 2,
            color: 'var(--text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {entry.label || truncateAddress(entry.owner)}
        </div>
        {displayUrl && (
          <a
            href={entry.url.startsWith('http') ? entry.url : `https://${entry.url}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 7,
              color: 'var(--accent)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: 3,
              display: 'block',
              textDecoration: 'none',
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {displayUrl}
          </a>
        )}
      </div>

      {/* Score */}
      <span
        style={{
          fontSize: isTop3 ? 12 : 9,
          letterSpacing: 2,
          color: 'var(--text)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          fontFamily: PIXEL_FONT,
        }}
      >
        {entry.value}
      </span>

      {/* Unit */}
      <span
        style={{
          fontSize: 7,
          color: 'var(--text-muted)',
          flexShrink: 0,
          fontFamily: PIXEL_FONT,
        }}
      >
        {entry.unit}
      </span>
    </div>
  )
}
