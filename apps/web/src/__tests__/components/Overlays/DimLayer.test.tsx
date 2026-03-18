import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import DimLayer from '@/components/Overlays/DimLayer'

describe('DimLayer', () => {
  it('calls onDismiss when clicked and not locked', () => {
    const onDismiss = vi.fn()
    const { container } = render(
      <DimLayer visible={true} locked={false} onDismiss={onDismiss} />
    )
    fireEvent.click(container.firstChild as Element)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('does not call onDismiss when clicked and locked', () => {
    const onDismiss = vi.fn()
    const { container } = render(
      <DimLayer visible={true} locked={true} onDismiss={onDismiss} />
    )
    fireEvent.click(container.firstChild as Element)
    expect(onDismiss).not.toHaveBeenCalled()
  })
})
