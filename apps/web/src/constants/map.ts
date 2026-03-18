// Grid dimensions — must match smart contract
export const WIDTH = 170
export const HEIGHT = 100
export const TOTAL_PIXELS = WIDTH * HEIGHT // 17,000

// Contract pricing (USDT 6 decimals)
export const INITIAL_PRICE = 100000n // 0.10 USDT
export const MIN_PRICE = 1n          // 0.000001 USDT
export const HALVING_TIME = 182n * 24n * 60n * 60n // 182 days in seconds

// Rendering
export const TILE_GAP = 0.08
export const TILE_RADIUS = 0.12
export const DOT_RADIUS = 0.35 // radius of land dots in canvas units
export const PAINT_SCALE = 4
export const MAX_SELECT = 100 // contract gas limit ~100 pixels per tx

export const COLOR_PRESETS = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
  '#1abc9c', '#3498db', '#9b59b6', '#e91e63',
  '#ff5722', '#00bcd4', '#8bc34a', '#f0f0f0',
] as const

export const DRAWER_SWATCHES = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
  '#1abc9c', '#3498db', '#9b59b6',
] as const

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// Contract addresses
export const MONDETO_PROXY = '0x0AD659eF417bB7c884aB574dE6DaC56D3AB82a00' as const
export const USDT_ADDRESS = '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e' as const
