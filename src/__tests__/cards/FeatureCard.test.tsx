import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import FeatureCard from '@/components/ui/cards/FeatureCard'
import { ChartBarIcon } from '@heroicons/react/24/outline'

const defaultProps = {
  title: 'Compare Salaries',
  description: 'Compare salaries across countries',
  icon: ChartBarIcon,
  iconWrapperClassName: 'bg-blue-100',
  iconClassName: 'h-6 w-6 text-blue-600',
}

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('FeatureCard', () => {
  it('renderiza el título', () => {
    renderWithRouter(<FeatureCard {...defaultProps} />)
    expect(screen.getByText('Compare Salaries')).toBeInTheDocument()
  })

  it('renderiza la descripción', () => {
    renderWithRouter(<FeatureCard {...defaultProps} />)
    expect(screen.getByText('Compare salaries across countries')).toBeInTheDocument()
  })

  it('renderiza el icono', () => {
    const { container } = renderWithRouter(<FeatureCard {...defaultProps} />)
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('navega a la ruta cuando se hace click y se proporciona "to"', async () => {
    const user = userEvent.setup()
    renderWithRouter(<FeatureCard {...defaultProps} to="/compare" />)

    const card = screen.getByText('Compare Salaries').closest('div')
    await user.click(card!)

    expect(window.location.pathname).toBe('/compare')
  })

  it('llama a onClick cuando se proporciona', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    renderWithRouter(<FeatureCard {...defaultProps} onClick={onClick} />)

    const card = screen.getByText('Compare Salaries').closest('div')
    await user.click(card!)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('onClick tiene prioridad sobre navegación', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    renderWithRouter(<FeatureCard {...defaultProps} to="/compare" onClick={onClick} />)

    const initialPath = window.location.pathname
    const card = screen.getByText('Compare Salaries').closest('div')
    await user.click(card!)

    expect(onClick).toHaveBeenCalledTimes(1)
    // No debería haber navegado, pathname debe ser el mismo
    expect(window.location.pathname).toBe(initialPath)
  })

  it('aplica cursor-pointer cuando se proporciona to u onClick', () => {
    const { container, rerender } = renderWithRouter(<FeatureCard {...defaultProps} to="/test" />)
    let card = container.querySelector('.cursor-pointer')
    expect(card).toBeInTheDocument()

    rerender(
      <BrowserRouter>
        <FeatureCard {...defaultProps} onClick={vi.fn()} />
      </BrowserRouter>
    )
    card = container.querySelector('.cursor-pointer')
    expect(card).toBeInTheDocument()
  })

  it('no aplica cursor-pointer cuando no hay to ni onClick', () => {
    const { container } = renderWithRouter(<FeatureCard {...defaultProps} />)
    const card = screen.getByText('Compare Salaries').closest('div')
    expect(card?.className).not.toContain('cursor-pointer')
  })
})
