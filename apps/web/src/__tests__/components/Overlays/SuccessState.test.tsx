import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SuccessState from '@/components/Overlays/SuccessState'

describe('SuccessState', () => {
  const defaultProps = {
    pixelCount: 5,
    totalPaid: '2.50 USDT',
    txHash: '0x1234567890abcdef1234567890abcdef12345678',
    onDone: vi.fn(),
  }

  it('shows pixel count', () => {
    render(<SuccessState {...defaultProps} />)
    expect(screen.getByText('5 pixels now yours')).toBeInTheDocument()
  })

  it('shows paid amount', () => {
    render(<SuccessState {...defaultProps} />)
    expect(screen.getByText('paid 2.50 USDT')).toBeInTheDocument()
  })

  it('calls onDone when button clicked', () => {
    const onDone = vi.fn()
    render(<SuccessState {...defaultProps} onDone={onDone} />)
    fireEvent.click(screen.getByText('[ DONE ]'))
    expect(onDone).toHaveBeenCalledTimes(1)
  })
})
