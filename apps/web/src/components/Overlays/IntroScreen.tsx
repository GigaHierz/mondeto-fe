'use client'

import React, { useState, useEffect } from 'react'

export default function IntroScreen() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem('mondeto-intro-seen')
    if (!seen) setVisible(true)
  }, [])

  if (!visible) return null

  const dismiss = () => {
    sessionStorage.setItem('mondeto-intro-seen', '1')
    setVisible(false)
  }

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
        cursor: 'pointer',
      }}
    >
      <div style={{ maxWidth: 360, textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: 6, color: 'var(--text)', marginBottom: 24 }}>
          MONDETO
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.6 }}>
          own the world, one pixel at a time
        </div>

        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>Claim land</div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>buy pixels and paint the map your color</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>Hold your ground</div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>someone wants your land? they pay you double!</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>Hunt for deals</div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>land without buyers gets cheaper over time</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>Outrank others</div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>climb the leaderboard and win prizes</div>
          </div>
        </div>

        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text)', letterSpacing: 2, border: '1px solid var(--border)', borderRadius: 11, padding: '10px 24px', display: 'inline-block' }}>
          [ TAP TO START ]
        </div>

        <div style={{ fontSize: 7, color: 'var(--text-muted)', marginTop: 16 }}>
          one leaderboard — limitless strategies to get there
        </div>
      </div>
    </div>
  )
}
