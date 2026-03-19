'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { celo } from 'viem/chains'
import type { PixelView } from '@/lib/mock'
import { fetchAllPixelsFromContract } from '@/lib/contractReads'

export type LoadState = 'loading' | 'ready' | 'error'

const POLL_INTERVAL = 30_000

// Fallback client for read-only calls when wagmi isn't ready
const fallbackClient = createPublicClient({
  chain: celo,
  transport: http(),
})

export function usePixelMap() {
  const wagmiClient = usePublicClient()
  const pixelDataRef = useRef<PixelView[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [version, setVersion] = useState(0)
  const [changedIds, setChangedIds] = useState<number[]>([])

  const getClient = useCallback(() => {
    return wagmiClient ?? fallbackClient
  }, [wagmiClient])

  const fetchData = useCallback(async (): Promise<PixelView[]> => {
    const client = getClient()
    return await fetchAllPixelsFromContract(
      client.readContract.bind(client) as Parameters<typeof fetchAllPixelsFromContract>[0]
    )
  }, [getClient])

  const load = useCallback(async () => {
    try {
      setLoadState('loading')
      const data = await fetchData()
      pixelDataRef.current = data
      setLoadState('ready')
      setVersion(v => v + 1)
    } catch (e) {
      console.warn('Failed to load pixel data:', e)
      setLoadState('error')
    }
  }, [fetchData])

  // Auto-load on mount and when client changes
  useEffect(() => {
    load()
  }, [load])

  const refresh = useCallback(async () => {
    try {
      const data = await fetchData()
      pixelDataRef.current = data
      setLoadState('ready')
      setVersion(v => v + 1)
    } catch {
      // Silent fail on refresh
    }
  }, [fetchData])

  const poll = useCallback(async () => {
    try {
      const newData = await fetchData()
      const oldData = pixelDataRef.current
      const changed: number[] = []

      for (let i = 0; i < newData.length; i++) {
        if (oldData[i] && oldData[i].owner !== newData[i].owner) {
          changed.push(i)
        }
      }

      pixelDataRef.current = newData
      setVersion(v => v + 1)

      if (changed.length > 0) {
        setChangedIds(changed)
        setTimeout(() => setChangedIds([]), 1500)
      }
    } catch {
      // Silent fail — next poll will retry
    }
  }, [fetchData])

  useEffect(() => {
    if (loadState !== 'ready') return
    const interval = setInterval(poll, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [loadState, poll])

  return { pixelDataRef, loadState, load, refresh, version, changedIds }
}
