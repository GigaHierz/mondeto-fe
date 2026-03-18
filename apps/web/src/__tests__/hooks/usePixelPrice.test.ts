import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePixelPrice } from '@/hooks/usePixelPrice'

vi.mock('@/lib/mock', () => ({
  selectionPrice: vi.fn((ids: number[]) => Promise.resolve(BigInt(ids.length) * 10000n)),
}))

describe('usePixelPrice', () => {
  it('returns 0 price and isLoading false for empty selection', () => {
    const { result } = renderHook(() => usePixelPrice(new Set()))
    expect(result.current.totalPrice).toBe(0n)
    expect(result.current.isLoading).toBe(false)
  })

  it('sets isLoading true initially when selection is non-empty', () => {
    const { result } = renderHook(() => usePixelPrice(new Set([1, 2])))
    expect(result.current.isLoading).toBe(true)
  })

  it('returns totalPrice after debounce resolves', async () => {
    const { result } = renderHook(() => usePixelPrice(new Set([1, 2, 3])))

    expect(result.current.isLoading).toBe(true)

    // Wait for the 200ms debounce + async resolution
    await waitFor(() => {
      expect(result.current.totalPrice).toBe(30000n) // 3 * 10000n
    }, { timeout: 1000 })
  })

  it('resets to 0 when selection becomes empty', async () => {
    const { result, rerender } = renderHook(
      ({ ids }) => usePixelPrice(ids),
      { initialProps: { ids: new Set([1, 2]) } },
    )

    // Wait for price to load
    await waitFor(() => {
      expect(result.current.totalPrice).toBe(20000n)
    }, { timeout: 1000 })

    // Clear selection
    rerender({ ids: new Set<number>() })
    expect(result.current.totalPrice).toBe(0n)
    expect(result.current.isLoading).toBe(false)
  })
})
