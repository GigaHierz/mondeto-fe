import { WIDTH, HEIGHT, INITIAL_PRICE, PRICE_DOUBLE_RATE, ZERO_ADDRESS } from '@/constants/map'
import { pixelId } from './pixelMath'

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

function initState() {
  if (pixelState.length > 0) return
  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    pixelState.push({
      owner: ZERO_ADDRESS,
      saleCount: 0,
      currentPrice: INITIAL_PRICE,
      color: '',
      label: '',
      url: '',
    })
  }
  seedDemoData()
}

function seedDemoData() {
  const demoOwners = [
    { addr: '0x1111111111111111111111111111111111111111', label: 'CeloFan', color: '#3498db', url: 'https://celo.org' },
    { addr: '0x2222222222222222222222222222222222222222', label: 'ETHGlobal', color: '#9b59b6', url: 'https://ethglobal.com' },
    { addr: '0x3333333333333333333333333333333333333333', label: 'Nike', color: '#e74c3c', url: 'https://nike.com' },
    { addr: '0x4444444444444444444444444444444444444444', label: 'Vitalik', color: '#2ecc71', url: '' },
  ]

  const clusters = [
    { owner: 0, startX: 80, startY: 40, w: 12, h: 8 },
    { owner: 0, startX: 95, startY: 42, w: 6, h: 5 },
    { owner: 1, startX: 150, startY: 60, w: 10, h: 6 },
    { owner: 2, startX: 200, startY: 30, w: 15, h: 10 },
    { owner: 2, startX: 218, startY: 35, w: 5, h: 4 },
    { owner: 3, startX: 120, startY: 80, w: 8, h: 8 },
    { owner: 3, startX: 130, startY: 82, w: 4, h: 4 },
  ]

  for (const cluster of clusters) {
    const demo = demoOwners[cluster.owner]
    for (let y = cluster.startY; y < cluster.startY + cluster.h; y++) {
      for (let x = cluster.startX; x < cluster.startX + cluster.w; x++) {
        if (x >= WIDTH || y >= HEIGHT) continue
        const id = pixelId(x, y)
        const sales = Math.floor(Math.random() * 5) + 1
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
