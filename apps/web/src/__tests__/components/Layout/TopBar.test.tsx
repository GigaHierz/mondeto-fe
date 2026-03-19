import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TopBar from '@/components/Layout/TopBar'

vi.mock('@/components/connect-button', () => ({
  ConnectButton: () => <button>Connect</button>,
}))

vi.mock('@/lib/theme', () => ({
  useTheme: () => ({ theme: 'dark', toggleTheme: () => {}, isDark: true }),
}))

describe('TopBar', () => {
  it('renders the title', () => {
    render(<TopBar title="MONDETO" />)
    expect(screen.getByText('MONDETO')).toBeInTheDocument()
  })

  it('renders ConnectButton', () => {
    render(<TopBar title="MONDETO" />)
    expect(screen.getByText('Connect')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <TopBar title="MONDETO">
        <span>child element</span>
      </TopBar>
    )
    expect(screen.getByText('child element')).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(<TopBar title="MONDETO" />)
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
  })
})
