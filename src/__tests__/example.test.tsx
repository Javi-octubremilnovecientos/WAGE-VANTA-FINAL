import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

/**
 * Test de ejemplo para verificar que Vitest está configurado correctamente
 * Este test valida que:
 * 1. La configuración de Vitest funciona
 * 2. React Testing Library está disponible
 * 3. Los globals de Vitest funcionan (describe, it, expect)
 */

describe('Vitest Setup', () => {
    it('debería pasar un test básico', () => {
        expect(true).toBe(true)
    })

    it('debería verificar matemáticas', () => {
        expect(2 + 2).toBe(4)
        expect(10 - 5).toBe(5)
    })

    it('debería renderizar un componente simple', () => {
        const TestComponent = () => (
            <div data-testid="test-component">
                <h1>Hola desde Vitest</h1>
                <p>La configuración de Vitest funciona correctamente</p>
            </div>
        )

        render(<TestComponent />)

        expect(screen.getByTestId('test-component')).toBeInTheDocument()
        expect(screen.getByText('Hola desde Vitest')).toBeInTheDocument()
        expect(
            screen.getByText('La configuración de Vitest funciona correctamente')
        ).toBeInTheDocument()
    })

    it('debería manejar interacciones básicas', async () => {
        const handleClick = vi.fn()

        const TestButton = () => (
            <button onClick={handleClick} data-testid="test-button">
                Click me
            </button>
        )

        render(<TestButton />)
        const button = screen.getByTestId('test-button')

        expect(button).toBeInTheDocument()
        expect(handleClick).not.toHaveBeenCalled()
    })

    it('debería probar propiedades de elementos', () => {
        const TestInput = () => (
            <input
                type="text"
                placeholder="Ingresa tu nombre"
                data-testid="test-input"
            />
        )

        render(<TestInput />)
        const input = screen.getByTestId('test-input') as HTMLInputElement

        expect(input).toHaveAttribute('type', 'text')
        expect(input).toHaveAttribute('placeholder', 'Ingresa tu nombre')
    })
})
