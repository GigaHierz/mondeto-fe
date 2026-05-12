'use client'

import TopBar from '@/components/Layout/TopBar'
import BottomNav from '@/components/Layout/BottomNav'
import { useAnalytics } from '@/hooks/useAnalytics'
import { formatUSDT } from '@/lib/colorUtils'

const PIXEL_FONT = "'Press Start 2P', monospace"

function Stat({
  label,
  value,
  unit,
  loading,
}: {
  label: string
  value: string
  unit?: string
  loading: boolean
}) {
  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '14px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div
        style={{
          fontSize: 6,
          fontFamily: PIXEL_FONT,
          color: 'var(--text-muted)',
          letterSpacing: 2,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span
          style={{
            fontSize: 18,
            fontFamily: PIXEL_FONT,
            color: 'var(--text)',
            letterSpacing: 1,
          }}
        >
          {loading ? '…' : value}
        </span>
        {unit && (
          <span
            style={{
              fontSize: 8,
              fontFamily: PIXEL_FONT,
              color: 'var(--text-muted)',
              letterSpacing: 1,
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}

function SectionHeader({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: 7,
        fontFamily: PIXEL_FONT,
        color: 'var(--text-muted)',
        letterSpacing: 3,
        marginTop: 18,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  )
}

export default function AnalyticsPage() {
  const a = useAnalytics()

  const feePct = a.feeRateBps / 100

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        paddingTop: 60,
        paddingBottom: 56,
      }}
    >
      <TopBar title="MONDETO" />

      <div
        style={{
          flex: 1,
          background: 'var(--bg)',
          padding: '12px 16px',
          maxWidth: 720,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontFamily: PIXEL_FONT,
            letterSpacing: 3,
            color: 'var(--text)',
            marginBottom: 6,
          }}
        >
          ANALYTICS
        </div>
        <div
          style={{
            fontSize: 7,
            fontFamily: PIXEL_FONT,
            color: 'var(--text-muted)',
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          mondeto on-chain · celo mainnet
        </div>

        {a.error && (
          <div
            style={{
              fontSize: 8,
              color: 'var(--error)',
              border: '1px solid var(--error)',
              borderRadius: 8,
              padding: 10,
              marginBottom: 12,
              fontFamily: PIXEL_FONT,
              letterSpacing: 1,
            }}
          >
            failed to load: {a.error}
          </div>
        )}

        <SectionHeader>PLAYERS</SectionHeader>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 10,
          }}
        >
          <Stat label="DAILY ACTIVE" value={a.dailyActiveUsers.toString()} loading={a.loading} />
          <Stat label="WEEKLY ACTIVE" value={a.weeklyActiveUsers.toString()} loading={a.loading} />
          <Stat label="ALL-TIME PLAYERS" value={a.allTimePlayers.toString()} loading={a.loading} />
        </div>

        <SectionHeader>TRANSACTIONS</SectionHeader>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 10,
          }}
        >
          <Stat label="24H" value={a.txCount24h.toString()} loading={a.loading} />
          <Stat label="7D" value={a.txCount7d.toString()} loading={a.loading} />
          <Stat label="ALL-TIME" value={a.txCountAllTime.toString()} loading={a.loading} />
        </div>

        <SectionHeader>VOLUME</SectionHeader>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 10,
          }}
        >
          <Stat label="24H VOLUME" value={formatUSDT(a.volume24h)} unit="USDT" loading={a.loading} />
          <Stat label="7D VOLUME" value={formatUSDT(a.volume7d)} unit="USDT" loading={a.loading} />
          <Stat label="ALL-TIME VOLUME" value={formatUSDT(a.volumeAllTime)} unit="USDT" loading={a.loading} />
        </div>

        <SectionHeader>PLATFORM REVENUE</SectionHeader>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 10,
          }}
        >
          <Stat
            label={`FEES @ ${feePct.toFixed(2)}%`}
            value={formatUSDT(a.revenueAllTime)}
            unit="USDT"
            loading={a.loading}
          />
        </div>

        <div
          style={{
            fontSize: 6,
            fontFamily: PIXEL_FONT,
            color: 'var(--text-muted)',
            letterSpacing: 1,
            marginTop: 18,
            lineHeight: 1.6,
          }}
        >
          window: blocks {a.windowStartBlock.toString()}–{a.windowEndBlock.toString()} ·
          fee rate read live from contract · revenue is an estimate
          (volume × fee%); actual withdrawable balance lives on-chain
        </div>
      </div>

      <BottomNav activeRoute="/analytics" />
    </div>
  )
}
