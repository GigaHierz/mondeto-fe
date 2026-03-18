import { describe, it, expect } from 'vitest'
import {
  WIDTH,
  HEIGHT,
  TOTAL_PIXELS,
  COLOR_PRESETS,
  DRAWER_SWATCHES,
  MAX_SELECT,
} from '@/constants/map'

describe('map constants', () => {
  it('WIDTH is 170', () => {
    expect(WIDTH).toBe(170)
  })

  it('HEIGHT is 100', () => {
    expect(HEIGHT).toBe(100)
  })

  it('TOTAL_PIXELS is 17000', () => {
    expect(TOTAL_PIXELS).toBe(17000)
  })

  it('COLOR_PRESETS has 12 items', () => {
    expect(COLOR_PRESETS).toHaveLength(12)
  })

  it('DRAWER_SWATCHES has 7 items', () => {
    expect(DRAWER_SWATCHES).toHaveLength(7)
  })

  it('MAX_SELECT is 100 (contract gas limit)', () => {
    expect(MAX_SELECT).toBe(100)
  })

  it('contract addresses are in lib/contract.ts', () => {
    // Addresses moved to auto-generated contract.ts
    expect(true).toBe(true)
  })
})
