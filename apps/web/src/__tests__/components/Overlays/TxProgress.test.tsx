import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TxProgress from '@/components/Overlays/TxProgress'

vi.mock('@/hooks/useBuyPixels', () => ({}))

describe('TxProgress', () => {
  it('shows all steps as active/pending when step=approving', () => {
    render(<TxProgress step="approving" />)
    const approved = screen.getByText('USDT approved')
    const buying = screen.getByText('buying land...')
    const confirmed = screen.getByText('confirmed')
    // approving: step 1 active, step 2 pending, step 3 pending
    expect(approved).toHaveStyle({ color: '#2d2520' }) // active
    expect(buying).toHaveStyle({ color: '#c0b8ae' }) // pending
    expect(confirmed).toHaveStyle({ color: '#c0b8ae' }) // pending
  })

  it('shows step 1 done, step 2 active, step 3 pending when step=buying', () => {
    render(<TxProgress step="buying" />)
    expect(screen.getByText('USDT approved')).toHaveStyle({ color: '#2d6a4f' }) // done
    expect(screen.getByText('buying land...')).toHaveStyle({ color: '#2d2520' }) // active
    expect(screen.getByText('confirmed')).toHaveStyle({ color: '#c0b8ae' }) // pending
  })

  it('shows steps 1-2 done, step 3 active when step=confirming', () => {
    render(<TxProgress step="confirming" />)
    expect(screen.getByText('USDT approved')).toHaveStyle({ color: '#2d6a4f' }) // done
    expect(screen.getByText('buying land...')).toHaveStyle({ color: '#2d6a4f' }) // done
    expect(screen.getByText('confirmed')).toHaveStyle({ color: '#2d2520' }) // active
  })

  it('shows all steps done when step=success', () => {
    render(<TxProgress step="success" />)
    expect(screen.getByText('USDT approved')).toHaveStyle({ color: '#2d6a4f' })
    expect(screen.getByText('buying land...')).toHaveStyle({ color: '#2d6a4f' })
    expect(screen.getByText('confirmed')).toHaveStyle({ color: '#2d6a4f' })
  })
})
