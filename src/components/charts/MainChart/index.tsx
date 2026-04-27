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

    // Usar color personalizado del entry si está disponible
    const fillColor = entry.color || '#8884d8';

    return (
        <g>
            <Rectangle {...props} x={offsetX} width={reducedWidth} fill={fillColor} />
            <line x1={offsetX} x2={offsetX + reducedWidth} y1={medianY} y2={medianY} stroke="#1f2937" strokeWidth={2} />
        </g>
    );
};

const TooltipContent = (props: TooltipContentProps) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
        const entry: BoxPlotDatum = payload[0].payload;
        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-lg">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">{entry.category}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 m-0">Min: {entry.min.toLocaleString()}€</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 m-0">Q1: {entry.q1.toLocaleString()}€</p>
                <p className="text-xs text-gray-900 dark:text-white font-medium m-0">Median: {entry.median.toLocaleString()}€</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 m-0">Q3: {entry.q3.toLocaleString()}€</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 m-0">Max: {entry.max.toLocaleString()}€</p>
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
                <div className="text-sm text-gray-500 dark:text-gray-400">Loading chart...</div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full aspect-square flex items-center justify-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">No data available</div>
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
                        className="dark:stroke-gray-300"
                    />
                </Bar>
                <Tooltip content={TooltipContent} />
            </BarChart>
        </ResponsiveContainer>
    );
}