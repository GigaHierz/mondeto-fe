import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BottomNav from '@/components/Layout/BottomNav'

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

describe('BottomNav', () => {
  it('renders three nav links (icons only, no text labels)', () => {
    render(<BottomNav activeRoute="/" />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)
  })

  it('links point to correct routes', () => {
    render(<BottomNav activeRoute="/" />)
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('/ranks')
    expect(hrefs).toContain('/')
    expect(hrefs).toContain('/profile')
  })

  it('active route icon uses theme stroke color', () => {
    render(<BottomNav activeRoute="/ranks" />)
    const links = screen.getAllByRole('link')
    // First link is /ranks — its icon wrapper span should have stroke var(--text)
    const ranksIconSpan = links[0].querySelector('span')
    expect(ranksIconSpan).toHaveStyle({ stroke: 'var(--text)' })

    // Second link is / (MAP) — should have muted stroke
    const mapIconSpan = links[1].querySelector('span')
    expect(mapIconSpan).toHaveStyle({ stroke: 'var(--text-muted)' })
  })
})
