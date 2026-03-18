'use client'

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
    <div style={{ display: 'flex', gap: 5, margin: '0 10px 8px' }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            flex: 1,
            background: '#faf7f2',
            border: '0.5px solid #e0d8ce',
            borderRadius: 8,
            padding: '5px 3px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 500, color: '#2d2520' }}>
            {card.value}
          </div>
          <div style={{ fontSize: 6, color: '#a09080', letterSpacing: 0.5, marginTop: 1 }}>
            {card.label}
          </div>
        </div>
      ))}
    </div>
  )
}
