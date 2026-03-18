'use client'
import { useRef, useState, useCallback } from 'react'
import { usePublicClient } from 'wagmi'
import { getAllPixels, type PixelView } from '@/lib/mock'
import { fetchAllPixelsFromContract } from '@/lib/contractReads'

export type LoadState = 'loading' | 'ready' | 'error'

export function usePixelMap() {
  const publicClient = usePublicClient()
  const pixelDataRef = useRef<PixelView[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [version, setVersion] = useState(0)

  const load = useCallback(async () => {
    try {
      setLoadState('loading')
      let data: PixelView[]
      if (publicClient) {
        try {
          data = await fetchAllPixelsFromContract(
            publicClient.readContract.bind(publicClient) as Parameters<typeof fetchAllPixelsFromContract>[0]
          )
        } catch (e) {
          console.warn('Contract read failed, falling back to mock:', e)
          data = await getAllPixels()
        }
      } else {
        data = await getAllPixels()
      }
      pixelDataRef.current = data
      setLoadState('ready')
      setVersion(v => v + 1)
    } catch {
      setLoadState('error')
    }
  }, [publicClient])

  const refresh = useCallback(async () => {
    let data: PixelView[]
    if (publicClient) {
      try {
        data = await fetchAllPixelsFromContract(
          publicClient.readContract.bind(publicClient) as Parameters<typeof fetchAllPixelsFromContract>[0]
        )
      } catch {
        data = await getAllPixels()
      }
    } else {
      data = await getAllPixels()
    }
    pixelDataRef.current = data
    setLoadState('ready')
    setVersion(v => v + 1)
  }, [publicClient])

  return { pixelDataRef, loadState, load, refresh, version }
}
