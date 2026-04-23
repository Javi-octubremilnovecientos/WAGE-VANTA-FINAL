
// Props interface
interface StepSliderProps {
    currentStep: number;
    totalSteps: number;
}

function StepSlider({ currentStep, totalSteps }: StepSliderProps) {
    // Calcular el porcentaje de progreso para cada step
    const getProgressPercentage = (stepIndex: number) => {
        if (stepIndex <= currentStep) {
            return 100;
        }
        return 0;
    };

    return (
        <div className="w-full flex gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex-1">
                    {/* Barra de progreso */}
                    <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                            style={{
                                width: `${getProgressPercentage(index)}%`,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StepSlider;
