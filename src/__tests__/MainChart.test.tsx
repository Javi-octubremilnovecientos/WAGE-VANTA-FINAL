import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MainChart from '@/components/charts/MainChart'
import type { BoxPlotData } from '@/components/charts/MainChart/MainChart.types'

const {
  mockUseAppSelector,
  mockComputeYAxisConfig,
  mockYAxisProps,
} = vi.hoisted(() => ({
  mockUseAppSelector: vi.fn(),
  mockComputeYAxisConfig: vi.fn(),
  mockYAxisProps: { current: null as null | Record<string, unknown> },
}))

vi.mock('@/hooks/useRedux', () => ({
  useAppSelector: mockUseAppSelector,
}))

vi.mock('@/components/charts/MainChart/MainChart.utils', () => ({
  computeYAxisConfig: mockComputeYAxisConfig,
}))

vi.mock('recharts', () => {
  const MockWrapper =
    (testId: string) =>
    ({ children }: { children?: React.ReactNode }) =>
      <div data-testid={testId}>{children}</div>

  return {
    Bar: MockWrapper('bar'),
    BarChart: MockWrapper('bar-chart'),
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    DefaultZIndexes: { bar: 100 },
    ErrorBar: () => <div data-testid="error-bar" />,
    Rectangle: () => <div data-testid="rectangle" />,
    ResponsiveContainer: MockWrapper('responsive-container'),
    Tooltip: () => <div data-testid="tooltip" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: (props: Record<string, unknown>) => {
      mockYAxisProps.current = props
      return <div data-testid="y-axis" />
    },
    ReferenceLine: ({ label, y }: { label?: { value?: string }; y?: number }) => (
      <div data-testid="reference-line" data-y={y}>
        {label?.value}
      </div>
    ),
  }
})

const sampleData: BoxPlotData[] = [
  {
    category: 'Spain',
    min: 1000,
    q1: 1500,
    median: 2000,
    q3: 2400,
    max: 3000,
    color: '#45d2fd',
  },
]

describe('MainChart', () => {
  beforeEach(() => {
    mockUseAppSelector.mockReset()
    mockComputeYAxisConfig.mockReset()
    mockYAxisProps.current = null

    mockUseAppSelector.mockReturnValue('light')
    mockComputeYAxisConfig.mockReturnValue({
      domain: [0, 5000],
      ticks: [0, 1000, 2000, 3000, 4000, 5000],
    })
  })

  it('muestra estado de loading', () => {
    render(<MainChart data={sampleData} isLoading={true} />)

    expect(screen.getByText('Loading chart...')).toBeInTheDocument()
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument()
  })

  it('muestra estado sin datos', () => {
    render(<MainChart data={[]} />)

    expect(screen.getByText('No data available')).toBeInTheDocument()
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument()
  })

  it('renderiza el chart y usa computeYAxisConfig con los datos', () => {
    render(<MainChart data={sampleData} />)

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    expect(mockComputeYAxisConfig).toHaveBeenCalledTimes(1)
    expect(mockComputeYAxisConfig).toHaveBeenCalledWith(sampleData)
  })

  it('renderiza ReferenceLine cuando userWage es mayor a 0', () => {
    render(<MainChart data={sampleData} userWage={2200} />)

    const referenceLine = screen.getByTestId('reference-line')
    expect(referenceLine).toBeInTheDocument()
    expect(referenceLine).toHaveTextContent(/Your wage:\s*2[,\.]?200€/)
  })

  it('no renderiza ReferenceLine cuando userWage es null o 0', () => {
    const { rerender } = render(<MainChart data={sampleData} userWage={null} />)
    expect(screen.queryByTestId('reference-line')).not.toBeInTheDocument()

    rerender(<MainChart data={sampleData} userWage={0} />)
    expect(screen.queryByTestId('reference-line')).not.toBeInTheDocument()
  })

  it('aplica color de ejes para tema dark', () => {
    mockUseAppSelector.mockReturnValue('dark')

    render(<MainChart data={sampleData} />)

    const yAxisProps = mockYAxisProps.current
    expect(yAxisProps).not.toBeNull()
    expect((yAxisProps?.tick as { fill: string }).fill).toBe('#d1d5db')
    expect(yAxisProps?.stroke).toBe('#d1d5db')
  })
})
