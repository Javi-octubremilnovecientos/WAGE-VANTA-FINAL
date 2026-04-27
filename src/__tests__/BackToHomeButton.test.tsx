import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { BackToHomeButton } from '@/components/ui/buttons'


describe('BackToHomeButton', () => {
  // Wrapper porque el componente usa useNavigate de React Router
  const renderWithRouter = (component: React.ReactNode) =>
    render(<BrowserRouter>{component}</BrowserRouter>)

  it('debería renderizar el botón', () => {
    renderWithRouter(<BackToHomeButton />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('debería mostrar el texto "Back to Home"', () => {
    renderWithRouter(<BackToHomeButton />)
    expect(screen.getByText('Back to Home')).toBeInTheDocument()
  })

  it('debería tener aria-label para accesibilidad', () => {
    renderWithRouter(<BackToHomeButton />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Volver a inicio')
  })

  it('debería aplicar className personalizado', () => {
    renderWithRouter(<BackToHomeButton className="test-class" />)
    expect(screen.getByRole('button')).toHaveClass('test-class')
  })
})