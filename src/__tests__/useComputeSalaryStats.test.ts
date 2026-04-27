import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { computeBoxPlotStats, useComputeSalaryStats } from '@/hooks/useComputeSalaryStats'
import type { SalaryRecord } from '@/features/salaries/types'

function createRecord(wage: number): SalaryRecord {
    return {
        Country: 'Spain',
        Gender: 'Male',
        Occupation: 'Developer',
        'Occupation Level': 'Senior',
        'Economic Activity': 'Technology',
        'Education Level': 'Bachelor',
        'Monthly Wage': wage,
        Year: 2025,
    }
}

describe('computeBoxPlotStats', () => {
    it('calcula min, cuartiles, mediana y max correctamente', () => {
        const result = computeBoxPlotStats([100, 200, 300, 400, 500], 'Spain', '#00AEEF')

        expect(result).toEqual({
            category: 'Spain',
            min: 100,
            q1: 200,
            median: 300,
            q3: 400,
            max: 500,
            color: '#00AEEF',
        })
    })
})

describe('useComputeSalaryStats', () => {
    it('retorna null si country está vacío', () => {
        const { result } = renderHook(() =>
            useComputeSalaryStats([createRecord(1200)], '', '#123456')
        )

        expect(result.current).toBeNull()
    })

    it('retorna null si records es undefined', () => {
        const { result } = renderHook(() =>
            useComputeSalaryStats(undefined, 'Spain', '#123456')
        )

        expect(result.current).toBeNull()
    })

    it('retorna null si records está vacío', () => {
        const { result } = renderHook(() =>
            useComputeSalaryStats([], 'Spain', '#123456')
        )

        expect(result.current).toBeNull()
    })

    it('retorna null si no hay salarios válidos', () => {
        const records = [createRecord(0), createRecord(-100)]

        const { result } = renderHook(() =>
            useComputeSalaryStats(records, 'Spain', '#123456')
        )

        expect(result.current).toBeNull()
    })

    it('filtra outliers extremos (<200 o >13000) antes de calcular', () => {
        const records = [
            createRecord(100),
            createRecord(300),
            createRecord(500),
            createRecord(15000),
        ]

        const { result } = renderHook(() =>
            useComputeSalaryStats(records, 'Spain', '#45d2fd')
        )

        expect(result.current).not.toBeNull()
        expect(result.current?.category).toBe('Spain')
        expect(result.current?.min).toBe(300)
        expect(result.current?.median).toBe(400)
        expect(result.current?.max).toBe(500)
        expect(result.current?.color).toBe('#45d2fd')
    })

    it('convierte a EUR para Denmark antes de calcular estadísticas', () => {
        const records = [createRecord(2000), createRecord(4000), createRecord(6000)]

        const { result } = renderHook(() =>
            useComputeSalaryStats(records, 'Denmark', '#FF0000')
        )

        expect(result.current).not.toBeNull()
        expect(result.current?.min).toBeCloseTo(268, 5)
        expect(result.current?.q1).toBeCloseTo(402, 5)
        expect(result.current?.median).toBeCloseTo(536, 5)
        expect(result.current?.q3).toBeCloseTo(670, 5)
        expect(result.current?.max).toBeCloseTo(804, 5)
    })
})
