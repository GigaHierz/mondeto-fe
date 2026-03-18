import { HEAT_STOPS } from '@/constants/map'

export function hexToUint24(hex: string): number {
  return parseInt(hex.replace('#', ''), 16)
}

export function uint24ToHex(n: number): string {
  return '#' + n.toString(16).padStart(6, '0')
}

export function interpolateHeatGradient(ratio: number): string {
  const clamped = Math.max(0, Math.min(1, ratio))
  let lower: { pos: number; color: string } = HEAT_STOPS[0]
  let upper: { pos: number; color: string } = HEAT_STOPS[HEAT_STOPS.length - 1]

  for (let i = 0; i < HEAT_STOPS.length - 1; i++) {
    if (clamped >= HEAT_STOPS[i].pos && clamped <= HEAT_STOPS[i + 1].pos) {
      lower = HEAT_STOPS[i]
      upper = HEAT_STOPS[i + 1]
      break
    }
  }

  const range = upper.pos - lower.pos
  const t = range === 0 ? 0 : (clamped - lower.pos) / range
  return lerpColor(lower.color, upper.color, t)
}

function lerpColor(a: string, b: string, t: number): string {
  const ar = parseInt(a.slice(1, 3), 16)
  const ag = parseInt(a.slice(3, 5), 16)
  const ab = parseInt(a.slice(5, 7), 16)
  const br = parseInt(b.slice(1, 3), 16)
  const bg = parseInt(b.slice(3, 5), 16)
  const bb = parseInt(b.slice(5, 7), 16)
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const blue = Math.round(ab + (bb - ab) * t)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`
}

export function formatUSDT(amount: bigint, decimals = 6): string {
  const whole = amount / BigInt(10 ** decimals)
  const frac = amount % BigInt(10 ** decimals)
  const fracStr = frac.toString().padStart(decimals, '0').slice(0, 2)
  return `${whole}.${fracStr}`
}

export function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex)
}
