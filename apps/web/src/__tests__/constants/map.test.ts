import { describe, it, expect } from 'vitest'
import {
  WIDTH,
  HEIGHT,
  TOTAL_PIXELS,
  COLOR_PRESETS,
  HEAT_STOPS,
  DRAWER_SWATCHES,
} from '@/constants/map'

describe('map constants', () => {
  it('WIDTH is 300', () => {
    expect(WIDTH).toBe(300)
  })

  it('HEIGHT is 150', () => {
    expect(HEIGHT).toBe(150)
  })

  it('TOTAL_PIXELS is 45000', () => {
    expect(TOTAL_PIXELS).toBe(45000)
  })

  it('COLOR_PRESETS has 12 items', () => {
    expect(COLOR_PRESETS).toHaveLength(12)
  })

  it('HEAT_STOPS has 8 items', () => {
    expect(HEAT_STOPS).toHaveLength(8)
  })

  it('DRAWER_SWATCHES has 7 items', () => {
    expect(DRAWER_SWATCHES).toHaveLength(7)
  })
})
