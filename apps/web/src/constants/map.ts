export const WIDTH = 300
export const HEIGHT = 150
export const TOTAL_PIXELS = WIDTH * HEIGHT

export const INITIAL_PRICE = 10000n // 0.01 USDT (6 decimals)
export const PRICE_DOUBLE_RATE = 2n

export const TILE_GAP = 0.08
export const TILE_RADIUS = 0.12
export const PAINT_SCALE = 4
export const MAX_SELECT = 1000

export const COLOR_PRESETS = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
  '#1abc9c', '#3498db', '#9b59b6', '#e91e63',
  '#ff5722', '#00bcd4', '#8bc34a', '#f0f0f0',
] as const

// 7 compact swatches for drawer (spec 04)
export const DRAWER_SWATCHES = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
  '#1abc9c', '#3498db', '#9b59b6',
] as const

export const HEAT_STOPS = [
  { pos: 0.0, color: '#4444ff' },
  { pos: 0.2, color: '#2288ff' },
  { pos: 0.4, color: '#00ccff' },
  { pos: 0.6, color: '#00ff88' },
  { pos: 0.7, color: '#ffff00' },
  { pos: 0.85, color: '#ff8800' },
  { pos: 0.95, color: '#ff4400' },
  { pos: 1.0, color: '#ffffff' },
] as const

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
