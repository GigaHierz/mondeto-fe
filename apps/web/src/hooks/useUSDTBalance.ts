'use client'

import { useAccount, useBalance } from 'wagmi'
import { celoSepolia } from 'wagmi/chains'
import { USDT_MAINNET, USDT_SEPOLIA } from '@/constants/map'

export function useUSDTBalance() {
  const { address, isConnected, chain } = useAccount()

  const isSepolia = chain?.id === celoSepolia.id
  const tokenAddress = isSepolia ? USDT_SEPOLIA : USDT_MAINNET

  const { data, isLoading } = useBalance({
    address,
    token: tokenAddress,
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
