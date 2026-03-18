import { describe, it, expect } from 'vitest'
import { pixelId, idToXY, screenToPixel, rectToIds, computeEmpires } from '@/lib/pixelMath'

describe('pixelId', () => {
  it('computes id for origin', () => {
    expect(pixelId(0, 0)).toBe(0)
  })

  it('computes id for (1, 0)', () => {
    expect(pixelId(1, 0)).toBe(1)
  })

  it('computes id for (0, 1)', () => {
    expect(pixelId(0, 1)).toBe(170) // WIDTH = 170
  })

  it('computes id for arbitrary position', () => {
    expect(pixelId(50, 10)).toBe(10 * 170 + 50)
  })
})

describe('idToXY', () => {
  it('converts id 0 to origin', () => {
    expect(idToXY(0)).toEqual({ x: 0, y: 0 })
  })

  it('converts id 170 to (0,1)', () => {
    expect(idToXY(170)).toEqual({ x: 0, y: 1 })
  })

  it('round-trips with pixelId', () => {
    const { x, y } = idToXY(pixelId(42, 77))
    expect(x).toBe(42)
    expect(y).toBe(77)
  })
})

describe('screenToPixel', () => {
  function makeCanvas(left: number, top: number): HTMLCanvasElement {
    return {
      getBoundingClientRect: () => ({
        left, top, right: left + 600, bottom: top + 300,
        width: 600, height: 300, x: left, y: top, toJSON() {},
      }),
    } as unknown as HTMLCanvasElement
  }

  it('returns pixel coords at scale 1', () => {
    const canvas = makeCanvas(0, 0)
    expect(screenToPixel(10.5, 20.8, canvas, 1)).toEqual({ x: 10, y: 20 })
  })

  it('accounts for scale', () => {
    const canvas = makeCanvas(0, 0)
    expect(screenToPixel(20, 40, canvas, 2)).toEqual({ x: 10, y: 20 })
  })

  it('accounts for canvas offset', () => {
    const canvas = makeCanvas(100, 50)
    expect(screenToPixel(110, 60, canvas, 1)).toEqual({ x: 10, y: 10 })
  })

  it('returns null for out of bounds', () => {
    const canvas = makeCanvas(0, 0)
    expect(screenToPixel(-5, 10, canvas, 1)).toBeNull()
  })

  it('returns null for coordinates beyond grid', () => {
    const canvas = makeCanvas(0, 0)
    expect(screenToPixel(300, 150, canvas, 1)).toBeNull()
  })
})

describe('rectToIds', () => {
  it('returns single pixel for same corners', () => {
    expect(rectToIds(5, 5, 5, 5)).toEqual([pixelId(5, 5)])
  })

  it('returns correct count for a 2x2 rect', () => {
    const ids = rectToIds(0, 0, 1, 1)
    expect(ids).toHaveLength(4)
    expect(ids).toContain(pixelId(0, 0))
    expect(ids).toContain(pixelId(1, 1))
  })

  it('handles swapped corners', () => {
    const ids = rectToIds(3, 3, 1, 1)
    expect(ids).toHaveLength(9) // 3x3
  })

  it('clamps to grid bounds', () => {
    const ids = rectToIds(-5, -5, 2, 2)
    // should clamp min to 0, so 3x3
    expect(ids).toHaveLength(9)
  })
})

describe('computeEmpires', () => {
  it('finds a single contiguous empire', () => {
    const owners = new Map<number, string>()
    // 3 adjacent pixels in a row: (0,0), (1,0), (2,0)
    owners.set(pixelId(0, 0), 'alice')
    owners.set(pixelId(1, 0), 'alice')
    owners.set(pixelId(2, 0), 'alice')

    const empires = computeEmpires(owners)
    expect(empires).toHaveLength(1)
    expect(empires[0].owner).toBe('alice')
    expect(empires[0].size).toBe(3)
  })

  it('splits disconnected regions of same owner into separate empires', () => {
    const owners = new Map<number, string>()
    owners.set(pixelId(0, 0), 'alice')
    owners.set(pixelId(10, 10), 'alice')

    const empires = computeEmpires(owners)
    expect(empires).toHaveLength(2)
    expect(empires.every(e => e.owner === 'alice')).toBe(true)
  })

  it('separates different owners', () => {
    const owners = new Map<number, string>()
    owners.set(pixelId(0, 0), 'alice')
    owners.set(pixelId(1, 0), 'bob')

    const empires = computeEmpires(owners)
    expect(empires).toHaveLength(2)
  })

  it('skips empty-string owners', () => {
    const owners = new Map<number, string>()
    owners.set(pixelId(0, 0), '')
    const empires = computeEmpires(owners)
    expect(empires).toHaveLength(0)
  })
})
