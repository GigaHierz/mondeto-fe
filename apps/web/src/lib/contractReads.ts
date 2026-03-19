import { WIDTH, HEIGHT, ZERO_ADDRESS, INITIAL_PRICE, MIN_PRICE, HALVING_TIME } from '@/constants/map'
import { MONDETO_ADDRESS, MONDETO_ABI } from './contract'
import { isLand } from './landMask'
import { uint24ToHex } from './colorUtils'
import { pixelPrice } from './priceCalc'
import type { PixelView } from './mock'

/**
 * Decode packed pixel batch bytes from the contract into PixelView array.
 * Each land pixel = 24 bytes: owner(20) + saleCount(1) + color(3)
 * Water pixels are skipped in the packed data — we iterate row-major and
 * only consume a record when isLand is true.
 */
export function decodePixelBatch(
  hexData: string,
  startX: number,
  startY: number,
  w: number,
  h: number,
): PixelView[] {
  const hex = hexData.startsWith('0x') ? hexData.slice(2) : hexData
  const totalPixels = WIDTH * HEIGHT
  const result: PixelView[] = new Array(totalPixels)

  // Initialize all pixels as empty
  for (let i = 0; i < totalPixels; i++) {
    result[i] = {
      owner: ZERO_ADDRESS,
      saleCount: 0,
      currentPrice: 0n,
      color: '',
      label: '',
      url: '',
    }
  }

  let recordOffset = 0
  for (let row = startY; row < startY + h; row++) {
    for (let col = startX; col < startX + w; col++) {
      const pixelId = row * WIDTH + col
      if (!isLand(pixelId)) continue

      // Consume next 24-byte record
      const byteOffset = recordOffset * 48 // 24 bytes = 48 hex chars
      if (byteOffset + 48 > hex.length) break

      const ownerHex = '0x' + hex.slice(byteOffset, byteOffset + 40)
      const saleCount = parseInt(hex.slice(byteOffset + 40, byteOffset + 42), 16)
      const colorInt = parseInt(hex.slice(byteOffset + 42, byteOffset + 48), 16)

      result[pixelId] = {
        owner: ownerHex,
        saleCount,
        currentPrice: 0n, // computed client-side if needed
        color: colorInt > 0 ? uint24ToHex(colorInt) : '',
        label: '',
        url: '',
      }

      recordOffset++
    }
  }

  return result
}

/**
 * Fetch all pixel data from the contract in one call.
 */
export async function fetchAllPixelsFromContract(
  readContract: (args: { address: `0x${string}`; abi: readonly unknown[]; functionName: string; args: readonly unknown[] }) => Promise<unknown>,
): Promise<PixelView[]> {
  const batchData = await readContract({
    address: MONDETO_ADDRESS,
    abi: MONDETO_ABI,
    functionName: 'getPixelBatch',
    args: [0, 0, WIDTH, HEIGHT],
  }) as `0x${string}`

  const pixels = decodePixelBatch(batchData, 0, 0, WIDTH, HEIGHT)

  // Compute client-side prices using priceCalc
  let deployTs: bigint
  try {
    deployTs = await readContract({
      address: MONDETO_ADDRESS,
      abi: MONDETO_ABI,
      functionName: 'deployTimestamp',
      args: [],
    }) as bigint
  } catch {
    deployTs = 0n
  }

  if (deployTs > 0n) {
    const now = BigInt(Math.floor(Date.now() / 1000))
    const config = { initialPrice: INITIAL_PRICE, minPrice: MIN_PRICE, deployTimestamp: deployTs, halvingTime: HALVING_TIME }
    for (const px of pixels) {
      px.currentPrice = pixelPrice(px.saleCount, now, config)
    }
  }

  return pixels
}
