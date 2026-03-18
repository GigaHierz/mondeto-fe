import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TxProgress from '@/components/Overlays/TxProgress'

vi.mock('@/hooks/useBuyPixels', () => ({}))

describe('TxProgress', () => {
  it('renders all three step labels', () => {
    render(<TxProgress step="approving" />)
    expect(screen.getByText('USDT approved')).toBeTruthy()
    expect(screen.getByText('buying land...')).toBeTruthy()
    expect(screen.getByText('confirmed')).toBeTruthy()
  })

  it('renders with buying step', () => {
    render(<TxProgress step="buying" />)
    expect(screen.getByText('USDT approved')).toBeTruthy()
    expect(screen.getByText('buying land...')).toBeTruthy()
  })

  it('renders with confirming step', () => {
    render(<TxProgress step="confirming" />)
    expect(screen.getByText('confirmed')).toBeTruthy()
  })

  it('renders with success step', () => {
    render(<TxProgress step="success" />)
    expect(screen.getByText('USDT approved')).toBeTruthy()
    expect(screen.getByText('buying land...')).toBeTruthy()
    expect(screen.getByText('confirmed')).toBeTruthy()
  })
})
