import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSelection } from '@/hooks/useSelection'
import { MAX_SELECT } from '@/constants/map'

describe('useSelection', () => {
  it('starts with empty selection', () => {
    const { result } = renderHook(() => useSelection())
    expect(result.current.selectedIds.size).toBe(0)
    expect(result.current.pixelCount).toBe(0)
    expect(result.current.isAtLimit).toBe(false)
  })

  it('addPixel adds a pixel', () => {
    const { result } = renderHook(() => useSelection())
    act(() => result.current.addPixel(42))
    expect(result.current.selectedIds.has(42)).toBe(true)
    expect(result.current.pixelCount).toBe(1)
  })

  it('removePixel removes a pixel', () => {
    const { result } = renderHook(() => useSelection())
    act(() => result.current.addPixel(42))
    act(() => result.current.removePixel(42))
    expect(result.current.selectedIds.has(42)).toBe(false)
    expect(result.current.pixelCount).toBe(0)
  })

  it('togglePixel adds then removes', () => {
    const { result } = renderHook(() => useSelection())
    act(() => result.current.togglePixel(10))
    expect(result.current.selectedIds.has(10)).toBe(true)
    act(() => result.current.togglePixel(10))
    expect(result.current.selectedIds.has(10)).toBe(false)
  })

  it('clearSelection empties the set', () => {
    const { result } = renderHook(() => useSelection())
    act(() => {
      result.current.addPixel(1)
      result.current.addPixel(2)
      result.current.addPixel(3)
    })
    act(() => result.current.clearSelection())
    expect(result.current.pixelCount).toBe(0)
  })

  it('isAtLimit is true when MAX_SELECT is reached', () => {
    const { result } = renderHook(() => useSelection())
    act(() => {
      for (let i = 0; i < MAX_SELECT; i++) {
        result.current.addPixel(i)
      }
    })
    expect(result.current.isAtLimit).toBe(true)
    expect(result.current.pixelCount).toBe(MAX_SELECT)
  })

  it('addPixel does not exceed MAX_SELECT', () => {
    const { result } = renderHook(() => useSelection())
    act(() => {
      for (let i = 0; i < MAX_SELECT + 10; i++) {
        result.current.addPixel(i)
      }
    })
    expect(result.current.pixelCount).toBe(MAX_SELECT)
  })
})
