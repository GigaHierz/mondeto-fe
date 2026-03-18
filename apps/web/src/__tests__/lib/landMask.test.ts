import { describe, it, expect } from 'vitest'
import { isLand, isLandXY } from '@/lib/landMask'

describe('isLand', () => {
  it('returns false for water pixel at origin (0,0)', () => {
    expect(isLand(0)).toBe(false)
  })

  it('returns true for known land pixel (170,16) id=4970', () => {
    expect(isLand(4970)).toBe(true)
  })

  it('returns true for North America pixel (50,35) id=10550', () => {
    expect(isLand(10550)).toBe(true)
  })

  it('returns true for Europe pixel (155,35) id=10655', () => {
    expect(isLand(10655)).toBe(true)
  })
})

describe('isLandXY', () => {
  it('returns false for water at (0, 0)', () => {
    expect(isLandXY(0, 0)).toBe(false)
  })

  it('returns true for land at (170, 16)', () => {
    expect(isLandXY(170, 16)).toBe(true)
  })

  it('returns true for North America at (50, 35)', () => {
    expect(isLandXY(50, 35)).toBe(true)
  })

  it('agrees with isLand for same coordinates', () => {
    const x = 155, y = 35
    const id = y * 300 + x
    expect(isLandXY(x, y)).toBe(isLand(id))
  })
})
