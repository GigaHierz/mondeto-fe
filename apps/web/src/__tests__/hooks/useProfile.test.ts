import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useProfile } from '@/hooks/useProfile'

const mockGetProfile = vi.fn()
const mockUpdateProfile = vi.fn()

vi.mock('@/lib/mock', () => ({
  getProfile: (...args: unknown[]) => mockGetProfile(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
}))

vi.mock('@/lib/colorUtils', async () => {
  const actual = await vi.importActual<typeof import('@/lib/colorUtils')>('@/lib/colorUtils')
  return actual
})

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetProfile.mockResolvedValue(null)
    mockUpdateProfile.mockResolvedValue(undefined)
  })

  it('has default initial state', () => {
    const { result } = renderHook(() => useProfile(undefined))
    expect(result.current.name).toBe('')
    expect(result.current.url).toBe('')
    expect(result.current.color).toBe('#e74c3c')
    expect(result.current.saveState).toBe('idle')
  })

  it('loads existing profile on mount', async () => {
    mockGetProfile.mockResolvedValue({
      label: 'TestUser',
      url: 'https://test.com',
      color: 0x3498db,
    })

    const { result } = renderHook(() => useProfile('0xABC'))

    await waitFor(() => {
      expect(result.current.name).toBe('TestUser')
    })
    expect(result.current.url).toBe('https://test.com')
    expect(result.current.color).toBe('#3498db')
  })

  it('save calls updateProfile and transitions saveState', async () => {
    mockGetProfile.mockResolvedValue(null)
    mockUpdateProfile.mockResolvedValue(undefined)

    const { result } = renderHook(() => useProfile('0xABC'))

    // Set name so save proceeds (it checks name.trim())
    act(() => {
      result.current.setName('NewName')
    })

    await act(async () => {
      await result.current.save()
    })

    expect(mockUpdateProfile).toHaveBeenCalledWith(
      '0xABC',
      expect.any(Number),
      'NewName',
      '',
    )
    expect(result.current.saveState).toBe('saved')
  })

  it('save does nothing if name is empty', async () => {
    const { result } = renderHook(() => useProfile('0xABC'))

    await act(async () => {
      await result.current.save()
    })

    expect(mockUpdateProfile).not.toHaveBeenCalled()
  })
})
