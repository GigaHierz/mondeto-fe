import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import ZoomHintToast from '@/components/Layout/ZoomHintToast'

describe('ZoomHintToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders text when visible (hasZoomedPast4x=false)', () => {
    render(<ZoomHintToast hasZoomedPast4x={false} />)
    expect(screen.getByText('pinch to zoom + paint')).toBeInTheDocument()
  })

  it('does not render when hasZoomedPast4x is true', () => {
    render(<ZoomHintToast hasZoomedPast4x={true} />)
    expect(screen.queryByText('pinch to zoom + paint')).not.toBeInTheDocument()
  })

  it('auto-dismisses after 3 seconds', () => {
    render(<ZoomHintToast hasZoomedPast4x={false} />)
    expect(screen.getByText('pinch to zoom + paint')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.queryByText('pinch to zoom + paint')).not.toBeInTheDocument()
  })
})
