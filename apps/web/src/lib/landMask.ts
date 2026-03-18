import { LAND_MASK } from '@/data/landMask'
import { WIDTH } from '@/constants/map'

export function isLand(id: number): boolean {
  return LAND_MASK[id] === 1
}

export function isLandXY(x: number, y: number): boolean {
  return LAND_MASK[y * WIDTH + x] === 1
}
