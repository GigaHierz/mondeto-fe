'use client'

import { useCallback } from 'react'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const handleColorInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  const handleHexInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      onChange(val)
    },
    [onChange],
  )

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '8px 9px',
        margin: '0 10px 6px',
      }}
    >
      <div
        style={{
          fontSize: 6,
          color: 'var(--text-muted)',
          letterSpacing: 1,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        COLOR
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 36, height: 36 }}>
          <input
            type="color"
            value={color}
            onChange={handleColorInput}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '2px solid var(--border)',
              appearance: 'none',
              WebkitAppearance: 'none',
              cursor: 'pointer',
              padding: 0,
              background: color,
            }}
          />
          <style>{`
            input[type=color]::-webkit-color-swatch-wrapper { padding: 0; }
            input[type=color]::-webkit-color-swatch { border: none; border-radius: 50%; }
          `}</style>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            style={{
              width: '100%',
              height: 18,
              borderRadius: 5,
              background: color,
            }}
          />
          <input
            type="text"
            value={color}
            onChange={handleHexInput}
            style={{
              fontSize: 8,
              fontFamily: 'monospace',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 4,
              padding: '3px 6px',
              width: '100%',
              color: 'var(--text)',
              outline: 'none',
            }}
          />
        </div>
      </div>
    </div>
  )
}
