'use client'

import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import { parseAbiItem } from 'viem'
import { MONDETO_ADDRESS, MONDETO_ABI } from '@/lib/contract'

// Celo mainnet block time is ~1s post-L2 migration. These are upper bounds —
// we filter by event timestamp anyway, so a small drift is fine.
const BLOCKS_PER_DAY = 86_400n
const BLOCKS_PER_WEEK = 604_800n
// How far back to fetch event logs. Anything older than this won't count
// toward "all-time" metrics. Bump when we have a real indexer.
const LOOKBACK_BLOCKS = 700_000n

export interface AnalyticsData {
  loading: boolean
  error: string | null

  // Counts of unique buyer addresses
  dailyActiveUsers: number
  weeklyActiveUsers: number
  allTimePlayers: number

  // Tx counts
  txCount24h: number
  txCount7d: number
  txCountAllTime: number

  // Volume in 6-decimal USDT raw units
  volume24h: bigint
  volume7d: bigint
  volumeAllTime: bigint

  // Platform revenue estimate: volume * feeRate / 10000
  feeRateBps: number
  revenueAllTime: bigint

  // Time window covered by the analysis
  windowStartBlock: bigint
  windowEndBlock: bigint
  fetchedAt: number
}

const EVENT_PURCHASED = parseAbiItem(
  'event PixelsPurchased(address indexed buyer, uint256[] ids, uint256 totalCost)',
)

export function useAnalytics(): AnalyticsData {
  const publicClient = usePublicClient()
  const [data, setData] = useState<AnalyticsData>({
    loading: true,
    error: null,
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    allTimePlayers: 0,
    txCount24h: 0,
    txCount7d: 0,
    txCountAllTime: 0,
    volume24h: 0n,
    volume7d: 0n,
    volumeAllTime: 0n,
    feeRateBps: 0,
    revenueAllTime: 0n,
    windowStartBlock: 0n,
    windowEndBlock: 0n,
    fetchedAt: 0,
  })

  useEffect(() => {
    if (!publicClient) return

    let cancelled = false

    async function fetchAnalytics() {
      try {
        const currentBlock = await publicClient!.getBlockNumber()
        const fromBlock =
          currentBlock > LOOKBACK_BLOCKS ? currentBlock - LOOKBACK_BLOCKS : 0n

        // Pull all PixelsPurchased events in the window. profile page uses
        // the same single-call pattern and forno is happy with it.
        const logs = await publicClient!.getLogs({
          address: MONDETO_ADDRESS,
          event: EVENT_PURCHASED,
          fromBlock,
          toBlock: currentBlock,
        })

        // Read the fee rate from the contract (basis points, e.g. 300 = 3%)
        let feeRateBps = 0
        try {
          const rate = (await publicClient!.readContract({
            address: MONDETO_ADDRESS,
            abi: MONDETO_ABI,
            functionName: 'feeRate',
          })) as bigint
          feeRateBps = Number(rate)
        } catch (e) {
          console.warn('Failed to read feeRate from contract:', e)
        }

        const dayCutoff =
          currentBlock > BLOCKS_PER_DAY ? currentBlock - BLOCKS_PER_DAY : 0n
        const weekCutoff =
          currentBlock > BLOCKS_PER_WEEK ? currentBlock - BLOCKS_PER_WEEK : 0n

        const allBuyers = new Set<string>()
        const dailyBuyers = new Set<string>()
        const weeklyBuyers = new Set<string>()

        let txCount24h = 0
        let txCount7d = 0
        let volume24h = 0n
        let volume7d = 0n
        let volumeAllTime = 0n

        for (const log of logs) {
          const buyer = (log.args.buyer as string).toLowerCase()
          const totalCost = log.args.totalCost as bigint
          const block = log.blockNumber ?? 0n

          allBuyers.add(buyer)
          volumeAllTime += totalCost

          if (block >= weekCutoff) {
            weeklyBuyers.add(buyer)
            txCount7d++
            volume7d += totalCost
          }
          if (block >= dayCutoff) {
            dailyBuyers.add(buyer)
            txCount24h++
            volume24h += totalCost
          }
        }

        // Platform revenue estimate. Real on-chain split is determined by the
        // contract — first-time sales of unowned pixels may go entirely to
        // the platform, while resales split feeRate% to platform / rest to
        // previous owner. This is a reasonable lower-bound proxy for the
        // analytics view; the actual withdrawable balance lives on-chain.
        const revenueAllTime =
          feeRateBps > 0
            ? (volumeAllTime * BigInt(feeRateBps)) / 10_000n
            : 0n

        if (cancelled) return

        setData({
          loading: false,
          error: null,
          dailyActiveUsers: dailyBuyers.size,
          weeklyActiveUsers: weeklyBuyers.size,
          allTimePlayers: allBuyers.size,
          txCount24h,
          txCount7d,
          txCountAllTime: logs.length,
          volume24h,
          volume7d,
          volumeAllTime,
          feeRateBps,
          revenueAllTime,
          windowStartBlock: fromBlock,
          windowEndBlock: currentBlock,
          fetchedAt: Date.now(),
        })
      } catch (e) {
        if (cancelled) return
        setData((prev) => ({
          ...prev,
          loading: false,
          error: e instanceof Error ? e.message : 'Failed to fetch analytics',
        }))
      }
    }

    fetchAnalytics()
    return () => {
      cancelled = true
    }
  }, [publicClient])

  return data
}
