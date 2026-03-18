import { WIDTH, HEIGHT, INITIAL_PRICE, PRICE_DOUBLE_RATE, ZERO_ADDRESS } from '@/constants/map'
import { pixelId } from './pixelMath'
import { isLandXY } from './landMask'

// Deterministic PRNG
function seededRng(seed: number) {
  let s = seed
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

export const MOCK_MODE = true

export interface PixelView {
  owner: string
  saleCount: number
  currentPrice: bigint
  color: string
  label: string
  url: string
}

export interface OwnerProfile {
  color: number
  label: string
  url: string
}

// Session-persistent state
const pixelState: PixelView[] = []
const profiles = new Map<string, OwnerProfile>()

// Geographic price hotspots for heatmap variation
const HOTSPOTS = [
  { x: 55, y: 38, r: 15, boost: 8 },    // US East Coast
  { x: 35, y: 42, r: 10, boost: 5 },     // US West Coast
  { x: 155, y: 35, r: 18, boost: 10 },   // Europe
  { x: 170, y: 32, r: 10, boost: 6 },    // Moscow
  { x: 210, y: 40, r: 12, boost: 7 },    // China/East Asia
  { x: 225, y: 42, r: 8, boost: 9 },     // Japan/Korea
  { x: 155, y: 60, r: 8, boost: 4 },     // West Africa
  { x: 170, y: 90, r: 6, boost: 3 },     // South Africa
  { x: 85, y: 78, r: 8, boost: 5 },      // Brazil
  { x: 240, y: 98, r: 10, boost: 4 },    // Australia
  { x: 195, y: 50, r: 8, boost: 6 },     // India
  { x: 160, y: 50, r: 6, boost: 5 },     // Middle East
]

function geoPrice(x: number, y: number): bigint {
  let maxBoost = 0
  for (const h of HOTSPOTS) {
    const dx = x - h.x
    const dy = y - h.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < h.r) {
      const factor = 1 - dist / h.r // 1 at center, 0 at edge
      const boost = Math.floor(factor * h.boost)
      if (boost > maxBoost) maxBoost = boost
    }
  }
  return INITIAL_PRICE * (PRICE_DOUBLE_RATE ** BigInt(maxBoost))
}

function initState() {
  if (pixelState.length > 0) return
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      pixelState.push({
        owner: ZERO_ADDRESS,
        saleCount: 0,
        currentPrice: isLandXY(x, y) ? geoPrice(x, y) : INITIAL_PRICE,
        color: '',
        label: '',
        url: '',
      })
    }
  }
  seedDemoData()
}

function seedDemoData() {
  const rng = seededRng(42)

  const demoOwners = [
    { addr: '0x1111111111111111111111111111111111111111', label: 'CeloFan', color: '#3498db', url: 'https://celo.org' },
    { addr: '0x2222222222222222222222222222222222222222', label: 'ETHGlobal', color: '#9b59b6', url: 'https://ethglobal.com' },
    { addr: '0x3333333333333333333333333333333333333333', label: 'Nike', color: '#e74c3c', url: 'https://nike.com' },
    { addr: '0x4444444444444444444444444444444444444444', label: 'Vitalik', color: '#2ecc71', url: '' },
  ]

  // Clusters on continent regions — only land pixels get owned
  const clusters = [
    { owner: 0, startX: 40, startY: 30, w: 20, h: 15 },   // North America
    { owner: 1, startX: 148, startY: 28, w: 15, h: 12 },   // Europe
    { owner: 2, startX: 148, startY: 58, w: 12, h: 15 },   // Africa
    { owner: 3, startX: 80, startY: 75, w: 10, h: 15 },    // South America
    { owner: 0, startX: 200, startY: 35, w: 18, h: 12 },   // Asia
    { owner: 1, startX: 235, startY: 95, w: 12, h: 10 },   // Australia
  ]

  for (const cluster of clusters) {
    const demo = demoOwners[cluster.owner]
    for (let y = cluster.startY; y < cluster.startY + cluster.h; y++) {
      for (let x = cluster.startX; x < cluster.startX + cluster.w; x++) {
        if (x >= WIDTH || y >= HEIGHT) continue
        if (!isLandXY(x, y)) continue
        if (rng() > 0.4) continue

        const id = pixelId(x, y)
        const sales = Math.floor(rng() * 5) + 1
        pixelState[id] = {
          owner: demo.addr,
          saleCount: sales,
          currentPrice: INITIAL_PRICE * (PRICE_DOUBLE_RATE ** BigInt(sales)),
          color: demo.color,
          label: demo.label,
          url: demo.url,
        }
      }
    }
    profiles.set(demo.addr, {
      color: parseInt(demo.color.replace('#', ''), 16),
      label: demo.label,
      url: demo.url,
    })
  }

  // Additional scattered owners for richer heatmap data
  const extraOwners = [
    { addr: '0x5555555555555555555555555555555555555555', label: 'Player5', color: '#e67e22', url: 'https://player5.xyz' },
    { addr: '0x6666666666666666666666666666666666666666', label: 'Celo', color: '#2ecc71', url: 'https://celo.org' },
    { addr: '0x7777777777777777777777777777777777777777', label: 'Builder7', color: '#1abc9c', url: '' },
    { addr: '0x8888888888888888888888888888888888888888', label: 'DAOhaus', color: '#00bcd4', url: 'https://daohaus.club' },
    { addr: '0x9999999999999999999999999999999999999999', label: 'Aave', color: '#9b59b6', url: 'https://aave.com' },
    { addr: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', label: 'Uniswap', color: '#e91e63', url: 'https://uniswap.org' },
  ]

  for (const owner of extraOwners) {
    profiles.set(owner.addr, {
      color: parseInt(owner.color.replace('#', ''), 16),
      label: owner.label,
      url: owner.url,
    })
  }

  // Scatter ~500 random purchased pixels across all land
  // Some bought once (cheap/yellow), some resold many times (expensive/red)
  const allOwners = [...demoOwners, ...extraOwners]
  for (let i = 0; i < 500; i++) {
    const x = Math.floor(rng() * WIDTH)
    const y = Math.floor(rng() * HEIGHT)
    if (!isLandXY(x, y)) continue

    const id = pixelId(x, y)
    if (pixelState[id].owner !== ZERO_ADDRESS) continue // skip already owned

    const ownerIdx = Math.floor(rng() * allOwners.length)
    const owner = allOwners[ownerIdx]
    // Near hotspots = more resales (higher saleCount)
    const baseSales = Math.floor(rng() * 3) + 1
    // Boost sales near geographic hotspots
    let hotBoost = 0
    for (const h of HOTSPOTS) {
      const dx = x - h.x, dy = y - h.y
      if (Math.sqrt(dx * dx + dy * dy) < h.r) {
        hotBoost = Math.max(hotBoost, Math.floor(rng() * h.boost))
      }
    }
    const sales = baseSales + hotBoost

    pixelState[id] = {
      owner: owner.addr,
      saleCount: sales,
      currentPrice: INITIAL_PRICE * (PRICE_DOUBLE_RATE ** BigInt(sales)),
      color: owner.color,
      label: owner.label,
      url: owner.url,
    }
  }
}

// Simulated USDT balance for mock mode
let mockBalance = 5000000n // 5.00 USDT (6 decimals)

export async function getUSDTBalance(): Promise<bigint> {
  initState()
  await delay(50)
  return mockBalance
}

export async function getAllPixels(): Promise<PixelView[]> {
  initState()
  await delay(300)
  return [...pixelState]
}

export async function getPixelBatch(startId: number, count: number): Promise<PixelView[]> {
  initState()
  await delay(200)
  return pixelState.slice(startId, startId + count)
}

export async function selectionPrice(ids: number[]): Promise<bigint> {
  initState()
  await delay(100)
  return ids.reduce((sum, id) => sum + pixelState[id].currentPrice, 0n)
}

export async function buyPixels(
  ids: number[],
  color: string,
  label: string,
  url: string,
  buyer: string,
): Promise<string> {
  initState()
  await delay(800)

  const totalCost = ids.reduce((sum, id) => sum + pixelState[id].currentPrice, 0n)
  if (totalCost > mockBalance) {
    throw new Error('insufficient balance')
  }
  mockBalance -= totalCost

  for (const id of ids) {
    const prev = pixelState[id]
    pixelState[id] = {
      owner: buyer,
      saleCount: prev.saleCount + 1,
      currentPrice: prev.currentPrice * PRICE_DOUBLE_RATE,
      color,
      label,
      url,
    }
  }
  profiles.set(buyer, { color: parseInt(color.replace('#', ''), 16), label, url })
  return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

export async function getProfile(address: string): Promise<OwnerProfile | null> {
  initState()
  await delay(50)
  return profiles.get(address) ?? null
}

export async function updateProfile(
  address: string,
  color: number,
  label: string,
  url: string,
): Promise<void> {
  initState()
  await delay(300)
  profiles.set(address, { color, label, url })
  const hexColor = '#' + color.toString(16).padStart(6, '0')
  for (let i = 0; i < pixelState.length; i++) {
    if (pixelState[i].owner === address) {
      pixelState[i].color = hexColor
      pixelState[i].label = label
      pixelState[i].url = url
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
