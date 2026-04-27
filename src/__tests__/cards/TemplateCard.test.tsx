import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TemplateCard from '@/components/ui/cards/TemplateCard'
import type { Template } from '@/lib/User'

const sampleTemplate: Template = {
  country: 'Spain',
  gender: 'Male',
  monthlyWage: 3500,
  occupation: 'Software Developer',
  position: 'Senior',
  economicActivity: 'Technology',
  educationLevel: 'Bachelor',
  companySize: 'Large (500+)',
  experienceYears: 5,
}

describe('TemplateCard', () => {
  it('renderiza country y gender', () => {
    render(<TemplateCard template={sampleTemplate} />)
    expect(screen.getByText(/Spain • Male/)).toBeInTheDocument()
  })

  it('renderiza el salario formateado', () => {
    render(<TemplateCard template={sampleTemplate} />)
    expect(screen.getByText(/💰\s*\$3[,\.]?500/)).toBeInTheDocument()
  })

  it('renderiza occupation cuando está presente', () => {
    render(<TemplateCard template={sampleTemplate} />)
    expect(screen.getByText('Role:')).toBeInTheDocument()
    expect(screen.getByText('Software Developer')).toBeInTheDocument()
  })

  it('renderiza position cuando está presente', () => {
    render(<TemplateCard template={sampleTemplate} />)
    expect(screen.getByText('Level:')).toBeInTheDocument()
    expect(screen.getByText('Senior')).toBeInTheDocument()
  })

  it('renderiza economicActivity cuando está presente', () => {
    render(<TemplateCard template={sampleTemplate} />)
    expect(screen.getByText('Sector:')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
  })

  it('renderiza educationLevel cuando está presente', () => {
    render(<TemplateCard template={sampleTemplate} />)
    expect(screen.getByText('Education:')).toBeInTheDocument()
    expect(screen.getByText('Bachelor')).toBeInTheDocument()
  })

  it('renderiza companySize cuando está presente', () => {
    render(<TemplateCard template={sampleTemplate} />)
    expect(screen.getByText('Company:')).toBeInTheDocument()
    expect(screen.getByText('Large (500+)')).toBeInTheDocument()
  })

  it('renderiza experienceYears con singular cuando es 1', () => {
    const template = { ...sampleTemplate, experienceYears: 1 }
    render(<TemplateCard template={template} />)
    expect(screen.getByText('Experience:')).toBeInTheDocument()
    expect(screen.getByText('1 year')).toBeInTheDocument()
  })

  it('renderiza experienceYears con plural cuando es mayor a 1', () => {
    render(<TemplateCard template={sampleTemplate} />)
    expect(screen.getByText('Experience:')).toBeInTheDocument()
    expect(screen.getByText('5 years')).toBeInTheDocument()
  })

  it('no renderiza experienceYears cuando es 0 o undefined', () => {
    const template = { ...sampleTemplate, experienceYears: 0 }
    render(<TemplateCard template={template} />)
    expect(screen.queryByText('Experience:')).not.toBeInTheDocument()
  })

  it('muestra icono por defecto', () => {
    const { container } = render(<TemplateCard template={sampleTemplate} />)
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('oculta icono cuando showIcon es false', () => {
    const { container } = render(<TemplateCard template={sampleTemplate} showIcon={false} />)
    const icon = container.querySelector('svg')
    expect(icon).not.toBeInTheDocument()
  })

  it('llama a onClick con el template cuando se hace click', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<TemplateCard template={sampleTemplate} onClick={onClick} />)

    const card = screen.getByText(/Spain • Male/).closest('div')
    await user.click(card!)

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledWith(sampleTemplate)
  })

  it('renderiza sin campos opcionales', () => {
    const minimalTemplate: Template = {
      country: 'Denmark',
      gender: 'Female',
      monthlyWage: 5000,
    }
    render(<TemplateCard template={minimalTemplate} />)

    expect(screen.getByText(/Denmark • Female/)).toBeInTheDocument()
    expect(screen.getByText(/💰\s*\$5[,\.]?000/)).toBeInTheDocument()
    expect(screen.queryByText('Role:')).not.toBeInTheDocument()
    expect(screen.queryByText('Level:')).not.toBeInTheDocument()
  })
})
