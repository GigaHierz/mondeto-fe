import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PaintModeBanner from '@/components/Map/PaintModeBanner'

describe('PaintModeBanner', () => {
  it('renders when visible=true', () => {
    render(<PaintModeBanner visible={true} scale={5} pixelCount={12} />)
    expect(screen.getByText(/GAME ON/)).toBeInTheDocument()
  })

  it('shows pixel count out of max', () => {
    render(<PaintModeBanner visible={true} scale={5} pixelCount={12} />)
    expect(screen.getByText(/12 \/ 100/)).toBeInTheDocument()
  })

  it('returns null when visible=false', () => {
    const { container } = render(
      <PaintModeBanner visible={false} scale={5} pixelCount={12} />
    )
    expect(container.innerHTML).toBe('')
  })
})
