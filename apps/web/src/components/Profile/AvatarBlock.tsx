'use client'

interface AvatarBlockProps {
  color: string
  name: string
}

export default function AvatarBlock({ color, name }: AvatarBlockProps) {
  const letter = name ? name[0].toUpperCase() : '?'
  const textColor = name ? 'white' : '#a09080'

  return (
    <div
      style={{
        width: 54,
        height: 54,
        borderRadius: 14,
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '12px auto 8px',
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 500, color: textColor }}>
        {letter}
      </span>
    </div>
  )
}
