'use client'

interface ScreenHeaderProps {
  title: string
}

export default function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <div
      style={{
        height: 42,
        background: '#faf7f2',
        borderBottom: '0.5px solid #e0d8ce',
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
          color: '#2d2520',
        }}
      >
        {title}
      </span>
    </div>
  )
}
