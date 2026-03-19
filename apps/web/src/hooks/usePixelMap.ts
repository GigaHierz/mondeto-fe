'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { getAllPixels, type PixelView } from '@/lib/mock'
import { fetchAllPixelsFromContract } from '@/lib/contractReads'

export type LoadState = 'loading' | 'ready' | 'error'

const POLL_INTERVAL = 30_000

export function usePixelMap() {
  const publicClient = usePublicClient()
  const pixelDataRef = useRef<PixelView[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [version, setVersion] = useState(0)
  const [changedIds, setChangedIds] = useState<number[]>([])

  const fetchData = useCallback(async (): Promise<PixelView[]> => {
    if (publicClient) {
      try {
        return await fetchAllPixelsFromContract(
          publicClient.readContract.bind(publicClient) as Parameters<typeof fetchAllPixelsFromContract>[0]
        )
      } catch (e) {
        console.warn('Contract read failed, falling back to mock:', e)
        return await getAllPixels()
      }
    }
    return await getAllPixels()
  }, [publicClient])

  const load = useCallback(async () => {
    try {
      setLoadState('loading')
      const data = await fetchData()
      pixelDataRef.current = data
      setLoadState('ready')
      setVersion(v => v + 1)
    } catch {
      setLoadState('error')
    }
  }, [fetchData])

  const refresh = useCallback(async () => {
    const data = await fetchData()
    pixelDataRef.current = data
    setLoadState('ready')
    setVersion(v => v + 1)
  }, [fetchData])

  // Silent poll: fetch new data, diff against current, emit changedIds
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

  // Start polling after initial load
  useEffect(() => {
    if (loadState !== 'ready') return
    const interval = setInterval(poll, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [loadState, poll])

  return { pixelDataRef, loadState, load, refresh, version, changedIds }
}
