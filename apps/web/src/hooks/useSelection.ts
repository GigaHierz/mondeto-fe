'use client'
import { useState, useCallback } from 'react'
import { MAX_SELECT } from '@/constants/map'

export interface UseSelectionReturn {
  selectedIds: Set<number>
  addPixel: (id: number) => void
  removePixel: (id: number) => void
  togglePixel: (id: number) => void
  clearSelection: () => void
  pixelCount: number
  isAtLimit: boolean
  limitBump: number
}

export function useSelection(): UseSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [limitBump, setLimitBump] = useState(0)

  const addPixel = useCallback((id: number) => {
    setSelectedIds(prev => {
      if (prev.size >= MAX_SELECT) {
        setLimitBump(b => b + 1)
        return prev
      }
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const removePixel = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const togglePixel = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < MAX_SELECT) next.add(id)
      else setLimitBump(b => b + 1)
      return next
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  return {
    selectedIds,
    addPixel,
    removePixel,
    togglePixel,
    clearSelection,
    pixelCount: selectedIds.size,
    isAtLimit: selectedIds.size >= MAX_SELECT,
    limitBump,
  }
}
