'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { MONDETO_ABI, MONDETO_PROXY } from '@/lib/contract'
import { uint24ToHex, hexToUint24 } from '@/lib/colorUtils'

export type ProfileSaveState = 'idle' | 'saving' | 'confirming' | 'saved' | 'error'

export function useProfile(address: string | undefined) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [color, setColor] = useState('#e74c3c')
  const [saveState, setSaveState] = useState<ProfileSaveState>('idle')

  // Read profile from contract
  const { data: profileData } = useReadContract({
    address: MONDETO_PROXY,
    abi: MONDETO_ABI,
    functionName: 'profiles',
    args: [(address ?? '0x0000000000000000000000000000000000000000') as `0x${string}`],
    query: { enabled: !!address },
  })

  // Load profile data when it arrives
  useEffect(() => {
    if (!profileData) return
    const [contractColor, labelBytes, urlBytes] = profileData as [number, string, string]
    if (contractColor) setColor(uint24ToHex(contractColor))
    // Decode bytes to string (they come as hex from the contract)
    try {
      if (labelBytes && labelBytes !== '0x') {
        const decoded = Buffer.from(labelBytes.slice(2), 'hex').toString('utf-8')
        if (decoded) setName(decoded)
      }
      if (urlBytes && urlBytes !== '0x') {
        const decoded = Buffer.from(urlBytes.slice(2), 'hex').toString('utf-8')
        if (decoded) setUrl(decoded)
      }
    } catch {
      // Bytes might already be decoded strings in some wagmi versions
      if (typeof labelBytes === 'string' && !labelBytes.startsWith('0x') && labelBytes) setName(labelBytes)
      if (typeof urlBytes === 'string' && !urlBytes.startsWith('0x') && urlBytes) setUrl(urlBytes)
    }
  }, [profileData])

  // Write profile to contract
  const { writeContract, data: txHash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  // Track tx states
  useEffect(() => {
    if (isPending) setSaveState('saving')
    else if (isConfirming) setSaveState('confirming')
    else if (isSuccess) {
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    }
  }, [isPending, isConfirming, isSuccess])

  const save = useCallback(async () => {
    if (!name.trim()) return
    if (!address) {
      setSaveState('error')
      return
    }

    try {
      writeContract({
        address: MONDETO_PROXY,
        abi: MONDETO_ABI,
        functionName: 'updateProfile',
        args: [hexToUint24(color), name, url],
      })
    } catch {
      setSaveState('error')
    }
  }, [address, name, url, color, writeContract])

  return { name, setName, url, setUrl, color, setColor, saveState, save }
}
