import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import CompareComboBox, { type CountryOption } from '@/components/ui/CompareComboBox'

const countries: CountryOption[] = [
    { label: 'Spain', value: 'spain' },
    { label: 'Denmark', value: 'denmark' },
    { label: 'United Kingdom', value: 'united kingdom' },
]

const defaultProps = {
    id: 'compare-country',
    label: 'Country',
    countries,
    value: null,
}

function renderWithRouter(ui: React.ReactElement) {
    return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('CompareComboBox', () => {
    it('renderiza label y placeholder inicial', () => {
        renderWithRouter(<CompareComboBox {...defaultProps} />)

        expect(screen.getByText('Country')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Choose a country')).toBeInTheDocument()
    })

    it('muestra badge cuando hay pais seleccionado', () => {
        renderWithRouter(
            <CompareComboBox
                {...defaultProps}
                value={{ label: 'Spain', value: 'spain' }}
            />
        )

        expect(screen.getByText('Spain')).toBeInTheDocument()
        expect(screen.getByLabelText('Remove Spain')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Add another country...')).toBeInTheDocument()
    })

    it('permite eliminar el badge y llama onChange(null)', async () => {
        const onChange = vi.fn()
        const user = userEvent.setup()

        renderWithRouter(
            <CompareComboBox
                {...defaultProps}
                value={{ label: 'Spain', value: 'spain' }}
                onChange={onChange}
            />
        )

        await user.click(screen.getByLabelText('Remove Spain'))

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith(null)
    })

    it('filtra paises al escribir en el input', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CompareComboBox {...defaultProps} />)

        const input = screen.getByRole('combobox')
        await user.click(input)
        await user.type(input, 'Den')

        expect(screen.getByText('Denmark')).toBeInTheDocument()
        expect(screen.queryByText('Spain')).not.toBeInTheDocument()
    })

    it('muestra mensaje cuando no hay resultados', async () => {
        const user = userEvent.setup()
        renderWithRouter(<CompareComboBox {...defaultProps} />)

        const input = screen.getByRole('combobox')
        await user.click(input)
        await user.type(input, 'ZZZ')

        expect(screen.getByText('No countries found')).toBeInTheDocument()
    })

    it('llama onChange con el pais cuando puede agregar mas', async () => {
        const onChange = vi.fn()
        const user = userEvent.setup()

        renderWithRouter(
            <CompareComboBox {...defaultProps} onChange={onChange} canAddMore={true} />
        )

        await user.click(screen.getByRole('button'))

        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument()
        })

        await user.click(screen.getByText('Denmark'))

        expect(onChange).toHaveBeenCalledWith({ label: 'Denmark', value: 'denmark' })
    })

    it('muestra deshabilitada la opcion ya seleccionada', async () => {
        const user = userEvent.setup()

        const { container } = renderWithRouter(
            <CompareComboBox
                {...defaultProps}
                value={{ label: 'Spain', value: 'spain' }}
            />
        )

        const comboboxButton = container.querySelector('button[aria-haspopup="listbox"]')
        expect(comboboxButton).toBeInTheDocument()
        await user.click(comboboxButton as HTMLButtonElement)

        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument()
        })

        const selectedOption = screen.getByRole('option', { name: 'Spain' })
        expect(selectedOption).toHaveAttribute('data-disabled')
        expect(selectedOption.className).toContain('cursor-not-allowed')
    })

    it('si no puede agregar mas, llama onUpgradeRequired y no onChange', async () => {
        const onChange = vi.fn()
        const onUpgradeRequired = vi.fn()
        const user = userEvent.setup()

        renderWithRouter(
            <CompareComboBox
                {...defaultProps}
                onChange={onChange}
                canAddMore={false}
                onUpgradeRequired={onUpgradeRequired}
            />
        )

        await user.click(screen.getByRole('button'))

        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument()
        })

        await user.click(screen.getByText('Spain'))

        expect(onUpgradeRequired).toHaveBeenCalledTimes(1)
        expect(onChange).not.toHaveBeenCalled()
    })

    it('si no puede agregar mas y no hay callback, abre el modal de upgrade', async () => {
        const user = userEvent.setup()

        renderWithRouter(
            <CompareComboBox
                {...defaultProps}
                canAddMore={false}
            />
        )

        await user.click(screen.getByRole('button'))

        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument()
        })

        await user.click(screen.getByText('United Kingdom'))

        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText('Upgrade now')).toBeInTheDocument()
    })
})
