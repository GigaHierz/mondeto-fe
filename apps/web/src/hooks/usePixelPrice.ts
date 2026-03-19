'use client'

import { useState, useEffect, useRef } from 'react'
import { usePublicClient } from 'wagmi'
import { MONDETO_ADDRESS, MONDETO_ABI } from '@/lib/contract'

export function usePixelPrice(selectedIds: Set<number>) {
  const [totalPrice, setTotalPrice] = useState<bigint>(0n)
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const publicClient = usePublicClient()

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
      const ids = [...selectedIds]
      try {
        if (publicClient) {
          const price = await publicClient.readContract({
            address: MONDETO_ADDRESS,
            abi: MONDETO_ABI,
            functionName: 'selectionPrice',
            args: [ids.map(id => BigInt(id))],
          }) as bigint
          setTotalPrice(price)
        } else {
          setTotalPrice(0n)
        }
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
  }, [selectedIds, publicClient])

  return { totalPrice, isLoading }
}
