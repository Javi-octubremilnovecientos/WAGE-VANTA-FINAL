import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SettingsCard from '@/components/ui/cards/SettingsCard'

describe('SettingsCard', () => {
  it('renderiza el título', () => {
    render(
      <SettingsCard title="Account Settings">
        <div>Content</div>
      </SettingsCard>
    )
    expect(screen.getByText('Account Settings')).toBeInTheDocument()
  })

  it('renderiza la descripción cuando se proporciona', () => {
    render(
      <SettingsCard title="Account" description="Manage your account settings">
        <div>Content</div>
      </SettingsCard>
    )
    expect(screen.getByText('Manage your account settings')).toBeInTheDocument()
  })

  it('no renderiza descripción cuando no se proporciona', () => {
    const { container } = render(
      <SettingsCard title="Account">
        <div>Content</div>
      </SettingsCard>
    )
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs.length).toBe(0)
  })

  it('renderiza los children correctamente', () => {
    render(
      <SettingsCard title="Settings">
        <div data-testid="child-content">Child Element</div>
      </SettingsCard>
    )
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByText('Child Element')).toBeInTheDocument()
  })

  it('renderiza múltiples children', () => {
    render(
      <SettingsCard title="Settings">
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </SettingsCard>
    )
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
    expect(screen.getByText('Child 3')).toBeInTheDocument()
  })
})
