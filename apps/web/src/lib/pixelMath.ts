import { WIDTH, HEIGHT } from '@/constants/map'

export function pixelId(x: number, y: number): number {
  return y * WIDTH + x
}

// Approximate (lat, lng) → grid (x, y).
//
// The on-chain land mask is Equal Earth projected (Šavrič et al. 2018), but
// implementing the full inverse here would be overkill for "zoom roughly to
// the player's location". Simple equirectangular gets within a few pixels
// at temperate latitudes — close enough that a 4× zoom lands on the user's
// continent / country. If precision becomes important later, swap this for
// the full Equal Earth inverse.
export function geoToPixel(latDeg: number, lngDeg: number): { x: number; y: number } {
  const lat = Math.max(-90, Math.min(90, latDeg))
  const lng = Math.max(-180, Math.min(180, lngDeg))
  const x = Math.round(((lng + 180) / 360) * WIDTH)
  const y = Math.round(((90 - lat) / 180) * HEIGHT)
  return {
    x: Math.max(0, Math.min(WIDTH - 1, x)),
    y: Math.max(0, Math.min(HEIGHT - 1, y)),
  }
}

export function idToXY(id: number): { x: number; y: number } {
  return { x: id % WIDTH, y: Math.floor(id / WIDTH) }
}

export function screenToPixel(
  clientX: number,
  clientY: number,
  canvasEl: HTMLCanvasElement,
  scale: number,
): { x: number; y: number } | null {
  const rect = canvasEl.getBoundingClientRect()
  const canvasX = (clientX - rect.left) / scale
  const canvasY = (clientY - rect.top) / scale
  const x = Math.floor(canvasX)
  const y = Math.floor(canvasY)
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return null
  return { x, y }
}

export function rectToIds(
  x1: number, y1: number,
  x2: number, y2: number,
): number[] {
  const minX = Math.max(0, Math.min(x1, x2))
  const maxX = Math.min(WIDTH - 1, Math.max(x1, x2))
  const minY = Math.max(0, Math.min(y1, y2))
  const maxY = Math.min(HEIGHT - 1, Math.max(y1, y2))
  const ids: number[] = []
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      ids.push(pixelId(x, y))
    }
  }
  return ids
}

export interface Empire {
  owner: string
  size: number
  ids: Set<number>
}

export function computeEmpires(
  owners: Map<number, string>,
): Empire[] {
  const visited = new Set<number>()
  const empires: Empire[] = []

  for (const [id, owner] of owners) {
    if (visited.has(id) || owner === '') continue
    const empire: Empire = { owner, size: 0, ids: new Set() }
    const queue = [id]
    while (queue.length > 0) {
      const current = queue.pop()!
      if (visited.has(current)) continue
      const currentOwner = owners.get(current)
      if (currentOwner !== owner) continue
      visited.add(current)
      empire.ids.add(current)
      empire.size++
      const { x, y } = idToXY(current)
      if (x > 0) queue.push(pixelId(x - 1, y))
      if (x < WIDTH - 1) queue.push(pixelId(x + 1, y))
      if (y > 0) queue.push(pixelId(x, y - 1))
      if (y < HEIGHT - 1) queue.push(pixelId(x, y + 1))
    }
    empires.push(empire)
  }
  return empires
}
