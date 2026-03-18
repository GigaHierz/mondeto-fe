'use client'

import { useState, useCallback } from 'react'
import { buyPixels, getUSDTBalance } from '@/lib/mock'

export type TxStep = 'idle' | 'approving' | 'buying' | 'confirming' | 'success' | 'error'

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function useBuyPixels() {
  const [step, setStep] = useState<TxStep>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [insufficientBalance, setInsufficientBalance] = useState(false)

  const checkBalance = useCallback(async (totalPrice: bigint) => {
    const balance = await getUSDTBalance()
    const insufficient = balance < totalPrice
    setInsufficientBalance(insufficient)
    return !insufficient
  }, [])

  const execute = useCallback(async (
    ids: number[], color: string, label: string, url: string, buyer: string
  ) => {
    try {
      setStep('approving')
      await delay(500)
      setStep('buying')
      const hash = await buyPixels(ids, color, label, url, buyer)
      setTxHash(hash)
      setStep('confirming')
      await delay(400)
      setStep('success')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Transaction failed')
      setStep('error')
    }
  }, [])

  const reset = useCallback(() => {
    setStep('idle')
    setTxHash(null)
    setError(null)
    setInsufficientBalance(false)
  }, [])

  return { execute, step, txHash, error, reset, insufficientBalance, checkBalance }
}
