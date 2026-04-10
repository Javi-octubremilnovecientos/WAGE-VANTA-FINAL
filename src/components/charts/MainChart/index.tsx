interface MainChartProps {
    data: Array<{
        name: string;
        min: number;
        q1: number;
        median: number;
        q3: number;
        max: number;
    }>;
    type?: 'boxplot' | 'bar';
}

function MainChart({ data, type = 'boxplot' }: MainChartProps) {
    return (
        <div className="w-full h-96 bg-white rounded-lg shadow p-4">
            <p className="text-center text-gray-500">
                Chart component - Integration with Recharts pending
            </p>
            <pre className="text-xs mt-4 overflow-auto">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}

export default MainChart;
