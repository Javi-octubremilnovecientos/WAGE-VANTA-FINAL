import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SavedDataCard from '@/components/ui/cards/SavedDataCard'
import type { Comparison } from '@/lib/User'

const sampleComparison: Comparison = {
  id: 1,
  selectedCountries: ['Spain', 'Denmark'],
  formValues: {
    'Economic Activity': 'Technology',
    'Occupation': 'Software Engineer',
  },
  computedStats: [
    {
      category: 'Spain',
      min: 1000,
      q1: 1500,
      median: 2000,
      q3: 2500,
      max: 3000,
    },
    {
      category: 'Denmark',
      min: 2000,
      q1: 3000,
      median: 4000,
      q3: 5000,
      max: 6000,
    },
  ],
  savedAt: '2026-04-15T10:30:00Z',
}

describe('SavedDataCard', () => {
  describe('Variant: full', () => {
    it('renderiza países como badges', () => {
      render(
        <SavedDataCard comparison={sampleComparison} onView={vi.fn()} variant="full" />
      )
      expect(screen.getByText('Spain')).toBeInTheDocument()
      expect(screen.getByText('Denmark')).toBeInTheDocument()
    })

    it('renderiza medianas de cada país', () => {
      render(
        <SavedDataCard comparison={sampleComparison} onView={vi.fn()} variant="full" />
      )
      expect(screen.getByText(/2[,\.]?000€/)).toBeInTheDocument()
      expect(screen.getByText(/4[,\.]?000€/)).toBeInTheDocument()
    })

    it('renderiza fecha de guardado', () => {
      render(
        <SavedDataCard comparison={sampleComparison} onView={vi.fn()} variant="full" />
      )
      expect(screen.getByText(/15 Apr 2026/)).toBeInTheDocument()
    })

    it('renderiza Economic Activity cuando existe', () => {
      render(
        <SavedDataCard comparison={sampleComparison} onView={vi.fn()} variant="full" />
      )
      expect(screen.getByText('Sector:')).toBeInTheDocument()
      expect(screen.getByText('Technology')).toBeInTheDocument()
    })

    it('renderiza Occupation cuando existe', () => {
      render(
        <SavedDataCard comparison={sampleComparison} onView={vi.fn()} variant="full" />
      )
      expect(screen.getByText('Occupation:')).toBeInTheDocument()
      expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    })

    it('llama a onView cuando se hace click en la card', async () => {
      const onView = vi.fn()
      const user = userEvent.setup()
      render(
        <SavedDataCard comparison={sampleComparison} onView={onView} variant="full" />
      )

      const card = screen.getByRole('button')
      await user.click(card)

      expect(onView).toHaveBeenCalledTimes(1)
    })

    it('muestra botón de eliminar cuando se proporciona onDelete', () => {
      render(
        <SavedDataCard
          comparison={sampleComparison}
          onView={vi.fn()}
          onDelete={vi.fn()}
          variant="full"
        />
      )
      expect(screen.getByLabelText('Delete comparison')).toBeInTheDocument()
    })

    it('llama a onDelete cuando se hace click en el botón de eliminar', async () => {
      const onDelete = vi.fn()
      const user = userEvent.setup()
      render(
        <SavedDataCard
          comparison={sampleComparison}
          onView={vi.fn()}
          onDelete={onDelete}
          variant="full"
        />
      )

      await user.click(screen.getByLabelText('Delete comparison'))

      expect(onDelete).toHaveBeenCalledTimes(1)
    })

    it('no muestra botón de eliminar cuando no se proporciona onDelete', () => {
      render(
        <SavedDataCard comparison={sampleComparison} onView={vi.fn()} variant="full" />
      )
      expect(screen.queryByLabelText('Delete comparison')).not.toBeInTheDocument()
    })
  })

  describe('Variant: compact', () => {
    it('renderiza países como badges', () => {
      render(
        <SavedDataCard comparison={sampleComparison} onView={vi.fn()} variant="compact" />
      )
      expect(screen.getByText('Spain')).toBeInTheDocument()
      expect(screen.getByText('Denmark')).toBeInTheDocument()
    })

    it('renderiza fecha en formato compacto', () => {
      render(
        <SavedDataCard comparison={sampleComparison} onView={vi.fn()} variant="compact" />
      )
      expect(screen.getByText(/Apr 15, 2026/)).toBeInTheDocument()
    })

    it('llama a onView cuando se hace click', async () => {
      const onView = vi.fn()
      const user = userEvent.setup()
      render(
        <SavedDataCard comparison={sampleComparison} onView={onView} variant="compact" />
      )

      await user.click(screen.getByRole('button'))

      expect(onView).toHaveBeenCalledTimes(1)
    })

    it('no muestra medianas en variant compact', () => {
      render(
        <SavedDataCard comparison={sampleComparison} onView={vi.fn()} variant="compact" />
      )
      expect(screen.queryByText(/Median/)).not.toBeInTheDocument()
    })

    it('no muestra context fields en variant compact', () => {
      render(
        <SavedDataCard comparison={sampleComparison} onView={vi.fn()} variant="compact" />
      )
      expect(screen.queryByText('Sector:')).not.toBeInTheDocument()
      expect(screen.queryByText('Occupation:')).not.toBeInTheDocument()
    })
  })

  describe('Navegación por teclado', () => {
    it('permite navegación con Enter en variant full', async () => {
      const onView = vi.fn()
      const user = userEvent.setup()
      render(
        <SavedDataCard comparison={sampleComparison} onView={onView} variant="full" />
      )

      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard('{Enter}')

      expect(onView).toHaveBeenCalledTimes(1)
    })
  })
})
