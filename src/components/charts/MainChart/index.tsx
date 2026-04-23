import {
    Bar,
    BarChart,
    CartesianGrid,
    DefaultZIndexes,
    ErrorBar,
    Rectangle,
    ReferenceLine,
    ResponsiveContainer,
    Scatter,
    Tooltip,
    YAxis,
} from 'recharts';
import type { BarShapeProps, TooltipContentProps, TooltipIndex } from 'recharts';
import type { BoxPlotData } from '../../../features/salaries/types';

type BoxPlotDatum = BoxPlotData;

type OutlierDatum = {
    category: string;
    value: number;
};

const outliers: ReadonlyArray<OutlierDatum> = [];

const boxDataKey: (entry: BoxPlotDatum) => [number, number] = entry => [entry.q1, entry.q3];

const whiskerDataKey: (entry: BoxPlotDatum) => [number, number] = entry => [entry.q3 - entry.min, entry.max - entry.q3];

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

    return (
        <g>
            <Rectangle {...props} x={offsetX} width={reducedWidth} fill={entry.color || '#8884d8'} />
            <line x1={offsetX} x2={offsetX + reducedWidth} y1={medianY} y2={medianY} stroke="#000" className="dark:stroke-gray-900" strokeWidth={2} />
        </g>
    );
};

const TooltipContent = (props: TooltipContentProps) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
        const entry: BoxPlotDatum = payload[0].payload;
        const isDark = document.documentElement.classList.contains('dark');

        return (
            <div
                style={{
                    backgroundColor: isDark ? 'rgba(30, 30, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db',
                    padding: '0 1em',
                    borderRadius: '0.375rem',
                }}
            >
                <p style={{ margin: 0, color: isDark ? '#e5e7eb' : '#1f2937' }}>{`Category: ${entry.category}`}</p>
                <p style={{ margin: 0, color: isDark ? '#e5e7eb' : '#1f2937' }}>{`Min: ${entry.min}`}</p>
                <p style={{ margin: 0, color: isDark ? '#e5e7eb' : '#1f2937' }}>{`Q1: ${entry.q1}`}</p>
                <p style={{ margin: 0, color: isDark ? '#e5e7eb' : '#1f2937' }}>{`Median: ${entry.median}`}</p>
                <p style={{ margin: 0, color: isDark ? '#e5e7eb' : '#1f2937' }}>{`Q3: ${entry.q3}`}</p>
                <p style={{ margin: 0, color: isDark ? '#e5e7eb' : '#1f2937' }}>{`Max: ${entry.max}`}</p>
            </div>
        );
    }
    return null;
};

interface MainChartProps {
    data?: BoxPlotData[];
    userWage?: number | null;
    defaultIndex?: TooltipIndex;
    isLoading?: boolean;
}

export default function MainChart({ data = [], userWage, defaultIndex, isLoading = false }: MainChartProps) {
    const skeletonHeights = [75, 90, 65]; // Fixed heights for skeleton bars
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const yAxisColor = isDark ? '#ffffff' : '#000000';

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full aspect-square">
                <div className="w-full h-full p-8 space-y-4 animate-pulse">
                    {/* Y-axis skeleton */}
                    <div className="flex gap-2 h-full">
                        <div className="w-10 flex flex-col justify-between">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-8"></div>
                            ))}
                        </div>
                        {/* Bars skeleton */}
                        <div className="flex-1 flex items-end justify-around gap-4">
                            {skeletonHeights.map((height, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-300 dark:bg-gray-700 rounded w-16"
                                    style={{ height: `${height}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center w-full aspect-square text-gray-600 dark:text-gray-500 text-sm">
                Select countries and fill the form to see salary data
            </div>
        );
    }

    return (
        <ResponsiveContainer width="90%" aspect={1 / 1}>
            <BarChart data={data}>
                <YAxis
                    width={40}
                    domain={[0, 13000]}
                    ticks={[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000]}
                    tick={{ fontSize: 10, fill: yAxisColor }}
                    stroke={yAxisColor}
                    tickFormatter={(value) => `${value}€`}
                />
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-gray-500 dark:stroke-gray-600" />
                <Bar dataKey={boxDataKey} shape={BoxShape}>
                    <ErrorBar dataKey={whiskerDataKey} width={0} zIndex={DefaultZIndexes.bar - 1} />
                </Bar>
                <Scatter data={outliers} dataKey="value" fill="#e11d48" />
                {userWage != null && (
                    <ReferenceLine
                        y={userWage}
                        stroke="#45d2fd"
                        strokeDasharray="6 3"
                        strokeWidth={1.5}
                        label={{ value: `Your wage: ${userWage}€`, position: 'right', fill: '#45d2fd', fontSize: 10 }}
                    />
                )}
                <Tooltip content={TooltipContent} defaultIndex={defaultIndex} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
            </BarChart>
        </ResponsiveContainer>
    );
}