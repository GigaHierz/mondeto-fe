import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AvatarBlock from '@/components/Profile/AvatarBlock'

describe('AvatarBlock', () => {
  it('shows first letter of name uppercased', () => {
    render(<AvatarBlock color="#ff0000" name="alice" />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('shows ? when no name', () => {
    render(<AvatarBlock color="#ff0000" name="" />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('uses color as background', () => {
    const { container } = render(<AvatarBlock color="#ff0000" name="bob" />)
    const avatar = container.firstChild as HTMLElement
    expect(avatar).toHaveStyle({ background: '#ff0000' })
  })
})
