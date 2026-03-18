'use client'

import { useState, useEffect, useCallback } from 'react'
import { getProfile, updateProfile } from '@/lib/mock'
import { uint24ToHex, hexToUint24 } from '@/lib/colorUtils'

export type ProfileSaveState = 'idle' | 'saving' | 'saved' | 'error'

const MOCK_USER = '0xYOUR000000000000000000000000000000000001'

export function useProfile(address: string | undefined) {
  const effectiveAddress = address || MOCK_USER
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [color, setColor] = useState('#e74c3c')
  const [saveState, setSaveState] = useState<ProfileSaveState>('idle')

  useEffect(() => {
    getProfile(effectiveAddress).then((profile) => {
      if (profile) {
        setName(profile.label)
        setUrl(profile.url)
        setColor(uint24ToHex(profile.color))
      }
    })
  }, [effectiveAddress])

  const save = useCallback(async () => {
    if (!name.trim()) return
    setSaveState('saving')
    try {
      await updateProfile(effectiveAddress, hexToUint24(color), name, url)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 1500)
    } catch {
      setSaveState('error')
    }
  }, [address, name, url, color])

  return { name, setName, url, setUrl, color, setColor, saveState, save }
}
