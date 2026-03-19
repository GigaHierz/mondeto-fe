'use client'

import { useMemo } from 'react'

interface SuccessStateProps {
  pixelCount: number
  totalPaid: string
  txHash: string
  onDone: () => void
}

const PF = "'Press Start 2P', monospace"

const TITLES = [
  'POWER MOVE',
  'NAILED IT',
  'BIG FLEX',
  'NICE ONE',
]

const CELEBRATIONS = [
  'World domination in progress...',
  'The map looks better with you on it.',
  "You're on the map — literally.",
  "Someone's gonna be mad about this.",
  'Plot twist: it\'s yours now.',
  'Main character energy.',
  "They didn't see that coming.",
  'New spot unlocked. Looking good.',
  'Power move. Respect.',
  "Flex. They'll notice.",
  'Smooth operator.',
  "That's how you play the game.",
]

export default function SuccessState({ pixelCount, totalPaid, txHash, onDone }: SuccessStateProps) {
  const title = useMemo(() => TITLES[Math.floor(Math.random() * TITLES.length)], [])
  const celebration = useMemo(() => CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)], [])

  return (
    <div style={{ textAlign: 'center', padding: '0 20px', maxWidth: 500, margin: '0 auto', width: '100%' }}>
      {/* Title */}
      <div style={{ fontSize: 12, fontFamily: PF, letterSpacing: 2, color: 'var(--text)', marginBottom: 8 }}>
        {title}
      </div>

      {/* Celebration */}
      <div style={{ fontSize: 7, fontFamily: PF, color: 'var(--text-muted)', letterSpacing: 1, fontStyle: 'italic', marginBottom: 12 }}>
        {celebration}
      </div>

      {/* Stats */}
      <div style={{ fontSize: 9, fontFamily: PF, color: 'var(--text)', letterSpacing: 1, marginBottom: 4 }}>
        +{pixelCount} spots grabbed
      </div>

      {/* Receipt */}
      <div style={{ fontSize: 7, fontFamily: PF, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 12 }}>
        paid {totalPaid}
      </div>

      {/* Done button — matches LOCK IT IN style */}
      <button
        onClick={onDone}
        style={{
          background: 'var(--button-bg)',
          color: 'var(--button-text)',
          borderRadius: 11,
          padding: 14,
          fontSize: 8,
          fontFamily: PF,
          letterSpacing: 2,
          textAlign: 'center',
          width: '100%',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        [ LET'S GO ]
      </button>
    </div>
  )
}
