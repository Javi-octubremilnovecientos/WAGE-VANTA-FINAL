import {
    Bar,
    BarChart,
    CartesianGrid,
    DefaultZIndexes,
    ErrorBar,
    Rectangle,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    ReferenceLine,
} from 'recharts';
import type { BarShapeProps, TooltipContentProps } from 'recharts';
import { useMemo } from 'react';
import { useAppSelector } from '@/hooks/useRedux';
import { selectEffectiveTheme } from '@/features/theme/themeSlice';
import type { MainChartProps, BoxPlotData } from './MainChart.types';
import { computeYAxisConfig } from './MainChart.utils';

type BoxPlotDatum = BoxPlotData;

// Paleta de colores cálidos para las cajas
const WARM_COLORS = [
    { fill: 'rgba(216, 65, 36, 0.7)', stroke: '#D84124' },      // Brand red-orange
    { fill: 'rgba(237, 139, 52, 0.7)', stroke: '#ED8B34' },     // Brand orange
    { fill: 'rgba(245, 158, 11, 0.75)', stroke: '#f59e0b' },    // Amber
    { fill: 'rgba(234, 88, 12, 0.7)', stroke: '#ea580c' },      // Orange
    { fill: 'rgba(220, 38, 38, 0.7)', stroke: '#dc2626' },      // Red
];

const boxDataKey: (entry: BoxPlotDatum) => [number, number] = entry => [entry.q1, entry.q3];

/**
 * Crea una función de whisker con el bigote superior capado al ceiling del YAxis.
 * El bigote inferior (hacia el mínimo) no se capa.
 * Los datos originales no se modifican — el tooltip sigue mostrando el max real.
 */
function makeWhiskerDataKey(
    ceiling: number,
): (entry: BoxPlotDatum) => [number, number] {
    return (entry: BoxPlotDatum) => [
        entry.q3 - entry.min,
        Math.min(entry.max, ceiling) - entry.q3,
    ];
}

const BoxShape = (props: BarShapeProps) => {
    // @ts-expect-error Recharts does spread datum on the props but the types don't reflect that
    const entry: BoxPlotDatum = props;
    const quartileRange = entry.q3 - entry.q1;
    const medianOffset =
        quartileRange === 0 ? props.height / 2 : ((entry.q3 - entry.median) / quartileRange) * props.height;
    const medianY = props.y + medianOffset;

    // Reducir el ancho a la mitad y centrar
    const reducedWidth = props.width * 0.5;
    const offsetX = props.x + (props.width - reducedWidth) / 2;

    // Asignar color de la paleta cálida según el índice
    const colorIndex = props.index % WARM_COLORS.length;
    const colorScheme = WARM_COLORS[colorIndex];

    return (
        <g>
            <Rectangle
                {...props}
                x={offsetX}
                width={reducedWidth}
                fill={colorScheme.fill}
                stroke={colorScheme.stroke}
                strokeWidth={2.5}
                radius={4}
            />
            <line
                x1={offsetX}
                x2={offsetX + reducedWidth}
                y1={medianY}
                y2={medianY}
                stroke="#ffffff"
                strokeWidth={2.5}
                opacity={0.9}
            />
        </g>
    );
};

const TooltipContent = (props: TooltipContentProps) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
        const entry: BoxPlotDatum = payload[0].payload;
        return (
            <div className="bg-[#121213] border border-white/10 rounded-lg p-3 shadow-lg">
                <p className="font-semibold text-white mb-2">{entry.category}</p>
                <p className="text-xs text-[#96969F] m-0">Min: {entry.min.toLocaleString()}€</p>
                <p className="text-xs text-[#96969F] m-0">Q1: {entry.q1.toLocaleString()}€</p>
                <p className="text-xs text-white font-medium m-0">Median: {entry.median.toLocaleString()}€</p>
                <p className="text-xs text-[#96969F] m-0">Q3: {entry.q3.toLocaleString()}€</p>
                <p className="text-xs text-[#96969F] m-0">Max: {entry.max.toLocaleString()}€</p>
            </div>
        );
    }
    return null;
};

export default function MainChart({ data, userWage, isLoading = false }: MainChartProps) {
    const effectiveTheme = useAppSelector(selectEffectiveTheme);
    const axisColor = effectiveTheme === 'dark' ? '#d1d5db' : '#374151';
    const yAxisConfig = useMemo(() => computeYAxisConfig(data), [data]);
    const whiskerDataKey = useMemo(
        () => makeWhiskerDataKey(yAxisConfig.domain[1]),
        [yAxisConfig.domain],
    );

    if (isLoading) {
        return (
            <div className="w-full aspect-square flex items-center justify-center">
                <div className="text-sm text-[#96969F]">Loading chart...</div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full aspect-square flex items-center justify-center">
                <div className="text-sm text-[#96969F]">No data available</div>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" aspect={1 / 1}>
            <BarChart data={data}>
                <XAxis
                    dataKey="category"
                    allowDuplicatedCategory={false}
                    tick={{ fontSize: 10, fill: axisColor }}
                    stroke={axisColor}
                />
                <YAxis
                    width={50}
                    domain={yAxisConfig.domain}
                    ticks={yAxisConfig.ticks}
                    tick={{ fontSize: 10, fill: axisColor }}
                    stroke={axisColor}
                    tickFormatter={(value: number) => `${value.toLocaleString()}€`}
                />
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#374151" />

                {/* Línea de referencia para el salario del usuario */}
                {userWage && userWage > 0 && (
                    <ReferenceLine
                        y={userWage}
                        stroke="#ef4444"
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        label={{
                            value: `Your wage: ${userWage.toLocaleString()}€`,
                            position: 'insideTopLeft',
                            fill: '#ef4444',
                            fontSize: 10,
                            fontWeight: 600
                        }}
                    />
                )}

                <Bar dataKey={boxDataKey} shape={BoxShape}>
                    <ErrorBar
                        dataKey={whiskerDataKey}
                        width={0}
                        zIndex={DefaultZIndexes.bar - 1}
                        stroke="#374151"
                        className="stroke-white/50"
                    />
                </Bar>
                <Tooltip content={TooltipContent} />
            </BarChart>
        </ResponsiveContainer>
    );
}