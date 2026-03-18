'use client'

import { useAccount, useBalance } from 'wagmi'
import { celo, celoAlfajores } from 'wagmi/chains'

// USDT on Celo mainnet
const USDT_MAINNET = '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e' as const
// cUSD on Celo testnet (Alfajores) — used as USDT equivalent for testing
const CUSD_TESTNET = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1' as const

export function useUSDTBalance() {
  const { address, isConnected, chain } = useAccount()

  const isTestnet = chain?.id === celoAlfajores.id
  const tokenAddress = isTestnet ? CUSD_TESTNET : USDT_MAINNET

  const { data, isLoading } = useBalance({
    address,
    token: tokenAddress,
    query: { enabled: isConnected && !!address },
  })

  return {
    balance: data?.formatted ?? '0.00',
    symbol: isTestnet ? 'cUSD' : 'USDT',
    isLoading,
    isConnected,
    chainName: isTestnet ? 'Alfajores' : 'Celo',
  }
}
