
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
        <div className="w-full flex gap-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex-1">
                    {/* Barra de progreso */}
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-[#45d2fd] rounded-full transition-all duration-300 ease-out"
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
