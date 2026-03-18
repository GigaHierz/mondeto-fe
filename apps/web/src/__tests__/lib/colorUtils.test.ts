import { describe, it, expect } from 'vitest'
import {
  hexToUint24,
  uint24ToHex,
  interpolateHeatGradient,
  formatUSDT,
  isValidHex,
} from '@/lib/colorUtils'

describe('hexToUint24', () => {
  it('converts black', () => {
    expect(hexToUint24('#000000')).toBe(0)
  })

  it('converts white', () => {
    expect(hexToUint24('#ffffff')).toBe(16777215)
  })

  it('converts red', () => {
    expect(hexToUint24('#ff0000')).toBe(0xff0000)
  })

  it('handles without hash', () => {
    expect(hexToUint24('3498db')).toBe(0x3498db)
  })
})

describe('uint24ToHex', () => {
  it('converts 0 to black', () => {
    expect(uint24ToHex(0)).toBe('#000000')
  })

  it('converts 16777215 to white', () => {
    expect(uint24ToHex(16777215)).toBe('#ffffff')
  })

  it('pads short values', () => {
    expect(uint24ToHex(0x000042)).toBe('#000042')
  })

  it('round-trips with hexToUint24', () => {
    expect(uint24ToHex(hexToUint24('#e74c3c'))).toBe('#e74c3c')
  })
})

describe('interpolateHeatGradient', () => {
  it('returns first stop color at ratio 0', () => {
    expect(interpolateHeatGradient(0)).toBe('#4444ff')
  })

  it('returns last stop color at ratio 1', () => {
    expect(interpolateHeatGradient(1)).toBe('#ffffff')
  })

  it('clamps negative ratio to 0', () => {
    expect(interpolateHeatGradient(-0.5)).toBe('#4444ff')
  })

  it('clamps ratio > 1 to 1', () => {
    expect(interpolateHeatGradient(1.5)).toBe('#ffffff')
  })

  it('returns a valid hex at mid ratio', () => {
    const result = interpolateHeatGradient(0.5)
    expect(isValidHex(result)).toBe(true)
  })
})

describe('formatUSDT', () => {
  it('formats zero', () => {
    expect(formatUSDT(0n)).toBe('0.00')
  })

  it('formats 1 USDT', () => {
    expect(formatUSDT(1000000n)).toBe('1.00')
  })

  it('formats fractional value', () => {
    expect(formatUSDT(1500000n)).toBe('1.50')
  })

  it('formats small value', () => {
    expect(formatUSDT(10000n)).toBe('0.01')
  })

  it('formats large value', () => {
    expect(formatUSDT(123456789n)).toBe('123.45')
  })
})

describe('isValidHex', () => {
  it('accepts valid 6-digit hex with hash', () => {
    expect(isValidHex('#e74c3c')).toBe(true)
  })

  it('rejects without hash', () => {
    expect(isValidHex('e74c3c')).toBe(false)
  })

  it('rejects short hex', () => {
    expect(isValidHex('#fff')).toBe(false)
  })

  it('rejects non-hex chars', () => {
    expect(isValidHex('#gggggg')).toBe(false)
  })

  it('accepts uppercase', () => {
    expect(isValidHex('#AABBCC')).toBe(true)
  })

  it('rejects empty string', () => {
    expect(isValidHex('')).toBe(false)
  })
})
