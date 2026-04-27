import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PlanCard from '@/components/ui/cards/PlanCard'

const defaultProps = {
  name: 'Premium',
  price: '$9.99',
  description: 'Best for professionals',
  features: ['Feature 1', 'Feature 2', 'Feature 3'],
  onSelect: vi.fn(),
}

describe('PlanCard', () => {
  it('renderiza el nombre del plan', () => {
    render(<PlanCard {...defaultProps} />)
    expect(screen.getByText('Premium')).toBeInTheDocument()
  })

  it('renderiza el precio y frecuencia', () => {
    render(<PlanCard {...defaultProps} />)
    expect(screen.getByText('$9.99')).toBeInTheDocument()
    expect(screen.getByText('/month')).toBeInTheDocument()
  })

  it('renderiza la descripción', () => {
    render(<PlanCard {...defaultProps} />)
    expect(screen.getByText('Best for professionals')).toBeInTheDocument()
  })

  it('renderiza todas las features', () => {
    render(<PlanCard {...defaultProps} />)
    expect(screen.getByText('Feature 1')).toBeInTheDocument()
    expect(screen.getByText('Feature 2')).toBeInTheDocument()
    expect(screen.getByText('Feature 3')).toBeInTheDocument()
  })

  it('muestra precio anual cuando se proporciona', () => {
    render(<PlanCard {...defaultProps} annualPrice="$99/year" />)
    expect(screen.getByText(/\$99\/year per month if paid annually/)).toBeInTheDocument()
  })

  it('no muestra precio anual cuando no se proporciona', () => {
    render(<PlanCard {...defaultProps} />)
    expect(screen.queryByText(/per month if paid annually/)).not.toBeInTheDocument()
  })

  it('muestra badge "Active" cuando isCurrent es true', () => {
    render(<PlanCard {...defaultProps} isCurrent={true} />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('no muestra badge cuando isCurrent es false', () => {
    render(<PlanCard {...defaultProps} isCurrent={false} />)
    expect(screen.queryByText('Active')).not.toBeInTheDocument()
  })

  it('muestra "Buy plan" cuando no es el plan actual', () => {
    render(<PlanCard {...defaultProps} isCurrent={false} />)
    expect(screen.getByRole('button', { name: 'Buy plan' })).toBeInTheDocument()
  })

  it('muestra "Current Plan" y deshabilita botón cuando isCurrent es true', () => {
    render(<PlanCard {...defaultProps} isCurrent={true} />)
    const button = screen.getByRole('button', { name: 'Current Plan' })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  it('llama a onSelect cuando se hace click en el botón', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<PlanCard {...defaultProps} onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: 'Buy plan' }))

    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('no llama a onSelect cuando el botón está deshabilitado', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<PlanCard {...defaultProps} isCurrent={true} onSelect={onSelect} />)

    const button = screen.getByRole('button', { name: 'Current Plan' })
    await user.click(button)

    expect(onSelect).not.toHaveBeenCalled()
  })
})
