import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BottomNav from '@/components/Layout/BottomNav'

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

describe('BottomNav', () => {
  it('renders three nav items: RANKS, MAP, PROFILE', () => {
    render(<BottomNav activeRoute="/" />)
    expect(screen.getByText('RANKS')).toBeInTheDocument()
    expect(screen.getByText('MAP')).toBeInTheDocument()
    expect(screen.getByText('PROFILE')).toBeInTheDocument()
  })

  it('links point to correct routes', () => {
    render(<BottomNav activeRoute="/" />)
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('/ranks')
    expect(hrefs).toContain('/')
    expect(hrefs).toContain('/profile')
  })

  it('active route item has darker color styling', () => {
    render(<BottomNav activeRoute="/ranks" />)
    const ranksLabel = screen.getByText('RANKS')
    expect(ranksLabel).toHaveStyle({ color: '#2d2520' })

    const mapLabel = screen.getByText('MAP')
    expect(mapLabel).toHaveStyle({ color: '#a09080' })
  })
})
