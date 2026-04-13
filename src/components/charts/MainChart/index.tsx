import {
    Bar,
    BarChart,
    CartesianGrid,
    DefaultZIndexes,
    ErrorBar,
    Rectangle,
    ResponsiveContainer,
    Scatter,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type { BarShapeProps, TooltipContentProps, TooltipIndex } from 'recharts';

type BoxPlotDatum = {
    category: string;
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
};

const data: ReadonlyArray<BoxPlotDatum> = [
    { category: 'Spain', min: 1600, q1: 2000, median: 2400, q3: 2900, max: 3500 }

];

type OutlierDatum = {
    category: string;
    value: number;
};

const outliers: ReadonlyArray<OutlierDatum> = [



];

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
    const reducedWidth = props.width * 0.25;
    const offsetX = props.x + (props.width - reducedWidth) / 2;

    return (
        <g>
            <Rectangle {...props} x={offsetX} width={reducedWidth} fill="#8884d8" />
            <line x1={offsetX} x2={offsetX + reducedWidth} y1={medianY} y2={medianY} stroke="#1f2937" strokeWidth={2} />
        </g>
    );
};

const TooltipContent = (props: TooltipContentProps) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
        const entry: BoxPlotDatum = payload[0].payload;
        return (
            <div
                style={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    padding: '0 1em',
                }}
            >
                <p style={{ margin: 0 }}>{`Category: ${entry.category}`}</p>
                <p style={{ margin: 0 }}>{`Min: ${entry.min}`}</p>
                <p style={{ margin: 0 }}>{`Q1: ${entry.q1}`}</p>
                <p style={{ margin: 0 }}>{`Median: ${entry.median}`}</p>
                <p style={{ margin: 0 }}>{`Q3: ${entry.q3}`}</p>
                <p style={{ margin: 0 }}>{`Max: ${entry.max}`}</p>
            </div>
        );
    }
    return null;
};

export default function MainChart({ defaultIndex }: { defaultIndex?: TooltipIndex }) {
    return (
        <ResponsiveContainer width="90%" aspect={1 / 1}>
            <BarChart data={data}>
                <XAxis dataKey="category" allowDuplicatedCategory={false} tick={{ fontSize: 10, fill: '#d1d5db' }} stroke="#d1d5db" />
                <YAxis
                    width={40}
                    domain={[0, 15000]}
                    ticks={[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000]}
                    tick={{ fontSize: 10, fill: '#d1d5db' }}
                    stroke="#d1d5db"
                    tickFormatter={(value) => `${value}€`}
                />
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#374151" />
                <Bar dataKey={boxDataKey} shape={BoxShape}>
                    <ErrorBar dataKey={whiskerDataKey} width={0} zIndex={DefaultZIndexes.bar - 1} />
                </Bar>
                <Scatter data={outliers} dataKey="value" fill="#e11d48" />
                <Tooltip content={TooltipContent} defaultIndex={defaultIndex} />
            </BarChart>
        </ResponsiveContainer>
    );
}