'use client'

import { useAccount, useBalance } from 'wagmi'
import { USDT_ADDRESS } from '@/lib/contract'

export function useUSDTBalance() {
  const { address, isConnected, chain } = useAccount()

  const { data, isLoading } = useBalance({
    address,
    token: USDT_ADDRESS,
    query: { enabled: isConnected && !!address },
  })

  return {
    balance: data?.formatted ?? '0.00',
    symbol: 'USDT',
    isLoading,
    isConnected,
    chainName: chain?.name ?? 'unknown',
  }
}
