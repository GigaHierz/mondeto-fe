import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBuyPixels } from '@/hooks/useBuyPixels'

vi.mock('@/lib/mock', () => ({
  buyPixels: vi.fn(async () => '0x' + 'a'.repeat(64)),
}))

describe('useBuyPixels', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useBuyPixels())
    expect(result.current.step).toBe('idle')
    expect(result.current.txHash).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.insufficientBalance).toBe(false)
  })

  it('checkBalance returns true when balance is sufficient', () => {
    const { result } = renderHook(() => useBuyPixels())
    let sufficient: boolean
    act(() => {
      sufficient = result.current.checkBalance(100n, 200n)
    })
    expect(sufficient!).toBe(true)
    expect(result.current.insufficientBalance).toBe(false)
  })

  it('checkBalance returns false when balance is insufficient', () => {
    const { result } = renderHook(() => useBuyPixels())
    let sufficient: boolean
    act(() => {
      sufficient = result.current.checkBalance(200n, 100n)
    })
    expect(sufficient!).toBe(false)
    expect(result.current.insufficientBalance).toBe(true)
  })

  it('execute transitions through steps to success', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useBuyPixels())

    let executePromise: Promise<void>
    act(() => {
      executePromise = result.current.execute([0], '#ff0000', 'Test', '', '0xbuyer')
    })

    // Should be in approving state
    expect(result.current.step).toBe('approving')

    // Run all timers and micro-tasks to completion
    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(result.current.step).toBe('success')
    expect(result.current.txHash).toBe('0x' + 'a'.repeat(64))

    vi.useRealTimers()
  })

  it('reset clears state back to idle', () => {
    const { result } = renderHook(() => useBuyPixels())
    act(() => {
      result.current.checkBalance(200n, 100n)
    })
    expect(result.current.insufficientBalance).toBe(true)

    act(() => {
      result.current.reset()
    })
    expect(result.current.step).toBe('idle')
    expect(result.current.txHash).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.insufficientBalance).toBe(false)
  })
})
