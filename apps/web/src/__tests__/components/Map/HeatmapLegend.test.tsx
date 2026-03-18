import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeatmapLegend from '@/components/Map/HeatmapLegend'

describe('HeatmapLegend', () => {
  it('renders gradient and labels when visible', () => {
    render(<HeatmapLegend visible={true} />)
    expect(screen.getByText('cheap')).toBeInTheDocument()
    expect(screen.getByText('hot')).toBeInTheDocument()
  })

  it('returns null when not visible', () => {
    const { container } = render(<HeatmapLegend visible={false} />)
    expect(container.innerHTML).toBe('')
  })
})
