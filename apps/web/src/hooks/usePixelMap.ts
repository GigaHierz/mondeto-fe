'use client'
import { useRef, useState, useCallback } from 'react'
import { getAllPixels, type PixelView } from '@/lib/mock'

export type LoadState = 'loading' | 'ready' | 'error'

export function usePixelMap() {
  const pixelDataRef = useRef<PixelView[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')

  const load = useCallback(async () => {
    try {
      setLoadState('loading')
      const data = await getAllPixels()
      pixelDataRef.current = data
      setLoadState('ready')
    } catch {
      setLoadState('error')
    }
  }, [])

  const refresh = useCallback(async () => {
    const data = await getAllPixels()
    pixelDataRef.current = data
    setLoadState('ready')
  }, [])

  return { pixelDataRef, loadState, load, refresh }
}
