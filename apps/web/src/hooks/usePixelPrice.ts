'use client'

import { useState, useEffect, useRef } from 'react'
import { selectionPrice } from '@/lib/mock'

export function usePixelPrice(selectedIds: Set<number>) {
  const [totalPrice, setTotalPrice] = useState<bigint>(0n)
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (selectedIds.size === 0) {
      setTotalPrice(0n)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const price = await selectionPrice([...selectedIds])
        setTotalPrice(price)
      } catch {
        setTotalPrice(0n)
      } finally {
        setIsLoading(false)
      }
    }, 200)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [selectedIds])

  return { totalPrice, isLoading }
}
