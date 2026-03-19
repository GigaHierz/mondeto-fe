'use client'

const PIXEL_FONT = "'Press Start 2P', monospace"

interface StatsRowProps {
  pixels: number
  usdt: string
  rank: number
}

export default function StatsRow({ pixels, usdt, rank }: StatsRowProps) {
  const cards = [
    { value: String(pixels), label: 'PIXELS' },
    { value: usdt, label: 'USDT' },
    { value: rank > 0 ? `#${rank}` : '-', label: 'RANK' },
  ]

  return (
    <div style={{ display: 'flex', gap: 8, margin: '0 auto 12px', maxWidth: 460, padding: '0 16px', width: '100%' }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            flex: 1,
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '10px 6px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 14, fontFamily: PIXEL_FONT, letterSpacing: 2, color: 'var(--text)' }}>
            {card.value}
          </div>
          <div style={{ fontSize: 6, fontFamily: PIXEL_FONT, letterSpacing: 2, color: 'var(--text-muted)', marginTop: 4 }}>
            {card.label}
          </div>
        </div>
      ))}
    </div>
  )
}
