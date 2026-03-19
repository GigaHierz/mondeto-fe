'use client'

import { useMemo } from 'react'
import type { PixelView } from '@/lib/mock'
import { ZERO_ADDRESS } from '@/constants/map'
import { computeEmpires } from '@/lib/pixelMath'
import { formatUSDT } from '@/lib/colorUtils'

export type LeaderboardTab = 'AREA' | 'EMPIRE' | 'TYCOONS'

export interface LeaderboardEntry {
  rank: number
  owner: string
  label: string
  url: string
  color: string
  value: string
  unit: string
}

export interface OwnerProfileData {
  label: string
  url: string
  color: string
}

export function useLeaderboard(pixelData: PixelView[], profilesMap?: Map<string, OwnerProfileData>) {
  const getProfile = (owner: string): OwnerProfileData => {
    const p = profilesMap?.get(owner.toLowerCase())
    return p ?? { label: '', url: '', color: '' }
  }
  const area = useMemo<LeaderboardEntry[]>(() => {
    const counts = new Map<string, { count: number; label: string; color: string }>()
    for (const px of pixelData) {
      if (px.owner === ZERO_ADDRESS) continue
      const existing = counts.get(px.owner)
      if (existing) {
        existing.count++
      } else {
        counts.set(px.owner, { count: 1, label: px.label, color: px.color })
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .map(([owner, data], i) => {
        const prof = getProfile(owner)
        return {
          rank: i + 1,
          owner,
          label: prof.label || data.label,
          url: prof.url,
          color: prof.color || data.color,
          value: String(data.count),
          unit: 'px',
        }
      })
  }, [pixelData, profilesMap])

  const empire = useMemo<LeaderboardEntry[]>(() => {
    const ownerMap = new Map<number, string>()
    for (let i = 0; i < pixelData.length; i++) {
      if (pixelData[i].owner !== ZERO_ADDRESS) {
        ownerMap.set(i, pixelData[i].owner)
      }
    }
    const empires = computeEmpires(ownerMap)

    // For each owner find their largest empire
    const bestEmpire = new Map<string, { size: number; label: string; color: string }>()
    for (const emp of empires) {
      const existing = bestEmpire.get(emp.owner)
      if (!existing || emp.size > existing.size) {
        // find a pixel from this owner to get label/color
        const px = pixelData.find((p) => p.owner === emp.owner)
        bestEmpire.set(emp.owner, {
          size: emp.size,
          label: px?.label ?? '',
          color: px?.color ?? '#888',
        })
      }
    }

    return [...bestEmpire.entries()]
      .sort((a, b) => b[1].size - a[1].size)
      .map(([owner, data], i) => {
        const prof = getProfile(owner)
        return {
          rank: i + 1,
          owner,
          label: prof.label || data.label,
          url: prof.url,
          color: prof.color || data.color,
          value: String(data.size),
          unit: 'px',
        }
      })
  }, [pixelData, profilesMap])

  const hotPx = useMemo<LeaderboardEntry[]>(() => {
    const best = new Map<string, { price: bigint; label: string; color: string }>()
    for (const px of pixelData) {
      if (px.owner === ZERO_ADDRESS) continue
      const existing = best.get(px.owner)
      if (!existing || px.currentPrice > existing.price) {
        best.set(px.owner, { price: px.currentPrice, label: px.label, color: px.color })
      }
    }

    return [...best.entries()]
      .sort((a, b) => {
        if (b[1].price > a[1].price) return 1
        if (b[1].price < a[1].price) return -1
        return 0
      })
      .map(([owner, data], i) => {
        const prof = getProfile(owner)
        return {
          rank: i + 1,
          owner,
          label: prof.label || data.label,
          url: prof.url,
          color: prof.color || data.color,
          value: formatUSDT(data.price),
          unit: 'USDT',
        }
      })
  }, [pixelData, profilesMap])

  return { area, empire, tycoons: hotPx }
}
