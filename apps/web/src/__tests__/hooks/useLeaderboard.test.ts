import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import type { PixelView } from '@/lib/mock'
import { ZERO_ADDRESS } from '@/constants/map'

function makePx(overrides: Partial<PixelView> = {}): PixelView {
  return {
    owner: ZERO_ADDRESS,
    saleCount: 0,
    currentPrice: 10000n,
    color: '',
    label: '',
    url: '',
    ...overrides,
  }
}

describe('useLeaderboard', () => {
  it('AREA: ranks by total pixel count', () => {
    // Alice owns 3, Bob owns 1 — scattered IDs so just array positions
    const data: PixelView[] = [
      makePx({ owner: '0xAlice', label: 'Alice', color: '#f00' }),
      makePx({ owner: '0xAlice', label: 'Alice', color: '#f00' }),
      makePx({ owner: '0xAlice', label: 'Alice', color: '#f00' }),
      makePx({ owner: '0xBob', label: 'Bob', color: '#00f' }),
    ]

    const { result } = renderHook(() => useLeaderboard(data))
    const { area } = result.current

    expect(area).toHaveLength(2)
    expect(area[0].owner).toBe('0xAlice')
    expect(area[0].value).toBe('3')
    expect(area[0].unit).toBe('px')
    expect(area[0].rank).toBe(1)
    expect(area[1].owner).toBe('0xBob')
    expect(area[1].rank).toBe(2)
  })

  it('EMPIRE: ranks by largest contiguous region', () => {
    // Build a small 5-wide grid. Alice has 3 contiguous at (0,0),(1,0),(2,0).
    // Bob has 2 contiguous at (0,1),(1,1).
    // Width is 300, so pixel IDs: alice at 0,1,2 and bob at 300,301
    const data: PixelView[] = Array.from({ length: 45000 }, () => makePx())
    data[0] = makePx({ owner: '0xAlice', label: 'Alice', color: '#f00' })
    data[1] = makePx({ owner: '0xAlice', label: 'Alice', color: '#f00' })
    data[2] = makePx({ owner: '0xAlice', label: 'Alice', color: '#f00' })
    data[300] = makePx({ owner: '0xBob', label: 'Bob', color: '#00f' })
    data[301] = makePx({ owner: '0xBob', label: 'Bob', color: '#00f' })

    const { result } = renderHook(() => useLeaderboard(data))
    const { empire } = result.current

    expect(empire).toHaveLength(2)
    expect(empire[0].owner).toBe('0xAlice')
    expect(empire[0].value).toBe('3')
    expect(empire[1].owner).toBe('0xBob')
    expect(empire[1].value).toBe('2')
  })

  it('HOT_PX: ranks by highest pixel price per owner', () => {
    const data: PixelView[] = [
      makePx({ owner: '0xAlice', label: 'Alice', color: '#f00', currentPrice: 50000n }),
      makePx({ owner: '0xAlice', label: 'Alice', color: '#f00', currentPrice: 100000n }),
      makePx({ owner: '0xBob', label: 'Bob', color: '#00f', currentPrice: 80000n }),
    ]

    const { result } = renderHook(() => useLeaderboard(data))
    const { tycoons } = result.current

    expect(tycoons).toHaveLength(2)
    // Alice's best is 100000, Bob's is 80000
    expect(tycoons[0].owner).toBe('0xAlice')
    expect(tycoons[0].unit).toBe('USDT')
    expect(tycoons[1].owner).toBe('0xBob')
  })

  it('excludes ZERO_ADDRESS pixels', () => {
    const data: PixelView[] = [
      makePx(), // unowned
      makePx({ owner: '0xAlice', label: 'Alice', color: '#f00' }),
    ]

    const { result } = renderHook(() => useLeaderboard(data))
    expect(result.current.area).toHaveLength(1)
  })
})
