import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StandardComboBox, { type SelectOption } from '@/components/form/StandardComboBox'

const mockOptions: SelectOption[] = [
    { label: 'España', value: 'es' },
    { label: 'México', value: 'mx' },
    { label: 'Argentina', value: 'ar' },
    { label: 'Colombia', value: 'co' },
]

const defaultProps = {
    id: 'country',
    label: 'País',
    options: mockOptions,
}

describe('StandardComboBox', () => {
    describe('Renderizado base', () => {
        it('debería renderizar el label correctamente', () => {
            render(<StandardComboBox {...defaultProps} />)
            expect(screen.getByText('País')).toBeInTheDocument()
        })

        it('debería renderizar el input', () => {
            render(<StandardComboBox {...defaultProps} />)
            expect(screen.getByRole('combobox')).toBeInTheDocument()
        })

        it('debería mostrar el placeholder por defecto', () => {
            render(<StandardComboBox {...defaultProps} />)
            expect(screen.getByPlaceholderText('Select an option')).toBeInTheDocument()
        })

        it('debería mostrar un placeholder personalizado', () => {
            render(<StandardComboBox {...defaultProps} placeholder="Selecciona un país" />)
            expect(screen.getByPlaceholderText('Selecciona un país')).toBeInTheDocument()
        })

        it('debería asociar el label con el input mediante el id', () => {
            render(<StandardComboBox {...defaultProps} />)
            const label = screen.getByText('País')
            expect(label).toHaveAttribute('for', 'country')
        })

        it('debería aplicar una className personalizada', () => {
            const { container } = render(
                <StandardComboBox {...defaultProps} className="custom-class" />
            )
            expect(container.firstChild).toHaveClass('custom-class')
        })
    })

    describe('Estado de carga (loading)', () => {
        it('debería mostrar el skeleton cuando loading=true', () => {
            const { container } = render(
                <StandardComboBox {...defaultProps} loading={true} />
            )
            // El skeleton usa animate-pulse
            expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
        })

        it('debería mostrar el label en el skeleton', () => {
            render(<StandardComboBox {...defaultProps} loading={true} />)
            expect(screen.getByText('País')).toBeInTheDocument()
        })

        it('no debería mostrar el input cuando loading=true', () => {
            render(<StandardComboBox {...defaultProps} loading={true} />)
            expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
        })
    })

    describe('Estado deshabilitado (disabled)', () => {
        it('debería aplicar estilos de deshabilitado', () => {
            const { container } = render(
                <StandardComboBox {...defaultProps} disabled={true} />
            )
            const wrapper = container.firstChild as HTMLElement
            expect(wrapper.className).toContain('opacity-50')
            expect(wrapper.className).toContain('cursor-not-allowed')
        })

        it('debería renderizar el input cuando disabled=true', () => {
            render(<StandardComboBox {...defaultProps} disabled={true} />)
            expect(screen.getByRole('combobox')).toBeInTheDocument()
        })
    })

    describe('Modo controlado (controlled)', () => {
        it('debería mostrar el valor controlado seleccionado', () => {
            render(<StandardComboBox {...defaultProps} value="es" />)
            const input = screen.getByRole('combobox') as HTMLInputElement
            expect(input.value).toBe('España')
        })

        it('debería mostrar vacío si el value no coincide con ninguna opción', () => {
            render(<StandardComboBox {...defaultProps} value="xx" />)
            const input = screen.getByRole('combobox') as HTMLInputElement
            expect(input.value).toBe('')
        })
    })

    describe('Filtrado de opciones', () => {
        it('debería filtrar opciones al escribir en el input', async () => {
            const user = userEvent.setup()
            render(<StandardComboBox {...defaultProps} />)

            const input = screen.getByRole('combobox')
            await user.click(input)
            await user.type(input, 'Esp')

            expect(screen.getByText('España')).toBeInTheDocument()
            expect(screen.queryByText('México')).not.toBeInTheDocument()
        })

        it('debería mostrar "No results found" cuando no hay coincidencias', async () => {
            const user = userEvent.setup()
            render(<StandardComboBox {...defaultProps} />)

            const input = screen.getByRole('combobox')
            await user.click(input)
            await user.type(input, 'ZZZ')

            expect(screen.getByText('No results found')).toBeInTheDocument()
        })

        it('debería ser case-insensitive al filtrar', async () => {
            const user = userEvent.setup()
            render(<StandardComboBox {...defaultProps} />)

            const input = screen.getByRole('combobox')
            await user.click(input)
            await user.type(input, 'esp')

            expect(screen.getByText('España')).toBeInTheDocument()
        })
    })

    describe('Callback onChange', () => {
        it('debería llamar onChange al seleccionar una opción', async () => {
            const handleChange = vi.fn()
            const user = userEvent.setup()
            render(<StandardComboBox {...defaultProps} onChange={handleChange} />)

            // Abrir el dropdown con el botón del combobox
            const dropdownButton = screen.getByRole('button')
            await user.click(dropdownButton)

            await waitFor(() => {
                expect(screen.getByRole('listbox')).toBeInTheDocument()
            })

            await user.click(screen.getByText('España'))

            expect(handleChange).toHaveBeenCalledWith('es')
        })

        it('debería llamar onChange una sola vez por selección', async () => {
            const handleChange = vi.fn()
            const user = userEvent.setup()
            render(<StandardComboBox {...defaultProps} onChange={handleChange} />)

            const dropdownButton = screen.getByRole('button')
            await user.click(dropdownButton)

            await waitFor(() => {
                expect(screen.getByRole('listbox')).toBeInTheDocument()
            })

            await user.click(screen.getByText('México'))

            expect(handleChange).toHaveBeenCalledTimes(1)
            expect(handleChange).toHaveBeenCalledWith('mx')
        })

        it('no debería llamar onChange cuando disabled=true', async () => {
            const handleChange = vi.fn()
            render(
                <StandardComboBox {...defaultProps} onChange={handleChange} disabled={true} />
            )

            const input = screen.getByRole('combobox')
            fireEvent.click(input)

            expect(handleChange).not.toHaveBeenCalled()
        })
    })

    describe('Lista de opciones vacía', () => {
        it('debería renderizar correctamente con un array vacío', () => {
            render(<StandardComboBox {...defaultProps} options={[]} />)
            expect(screen.getByRole('combobox')).toBeInTheDocument()
        })
    })
})
