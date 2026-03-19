'use client'

import Link from 'next/link'

interface BottomNavProps {
  activeRoute: string
}

const navItems = [
  {
    label: 'RANKS',
    href: '/ranks',
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0012 0V2z" />
      </svg>
    ),
  },
  {
    label: 'MAP',
    href: '/',
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={12} cy={12} r={10} />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    label: 'PROFILE',
    href: '/profile',
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx={12} cy={7} r={4} />
      </svg>
    ),
  },
]

export default function BottomNav({ activeRoute }: BottomNavProps) {
  return (
    <nav
      className="theme-bar-bottom"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        zIndex: 40,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      {navItems.map((item) => {
        const isActive = activeRoute === item.href
        const strokeColor = isActive ? 'var(--text)' : 'var(--text-muted)'
        const labelColor = isActive ? 'var(--text)' : 'var(--text-muted)'
        const barBg = 'var(--text)'

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              textDecoration: 'none',
            }}
          >
            <span style={{ stroke: strokeColor, display: 'flex' }}>{item.icon}</span>
            <div
              style={{
                width: 16,
                height: 2,
                borderRadius: 1,
                background: isActive ? barBg : 'transparent',
              }}
            />
          </Link>
        )
      })}
    </nav>
  )
}
