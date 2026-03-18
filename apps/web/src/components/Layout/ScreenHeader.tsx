'use client'

interface ScreenHeaderProps {
  title: string
}

export default function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <div
      style={{
        height: 42,
        background: 'var(--card-bg)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: 2,
          color: 'var(--text)',
        }}
      >
        {title}
      </span>
    </div>
  )
}
