import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatsRow from '@/components/Profile/StatsRow'

describe('StatsRow', () => {
  it('shows pixels value', () => {
    render(<StatsRow pixels={42} usdt="10.00" rank={3} />)
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('PIXELS')).toBeInTheDocument()
  })

  it('shows usdt value', () => {
    render(<StatsRow pixels={42} usdt="10.00" rank={3} />)
    expect(screen.getByText('10.00')).toBeInTheDocument()
    expect(screen.getByText('USDT')).toBeInTheDocument()
  })

  it('shows rank with # prefix', () => {
    render(<StatsRow pixels={42} usdt="10.00" rank={3} />)
    expect(screen.getByText('#3')).toBeInTheDocument()
    expect(screen.getByText('RANK')).toBeInTheDocument()
  })

  it('shows dash when rank is 0', () => {
    render(<StatsRow pixels={0} usdt="0.00" rank={0} />)
    expect(screen.getByText('-')).toBeInTheDocument()
  })
})
