
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
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-visible">
                        <div
                            className="h-full rounded-full transition-all duration-300 ease-out shadow-[0_4px_18px_rgba(216,65,36,0.5)]"
                            style={{
                                width: `${getProgressPercentage(index)}%`,
                                background: 'linear-gradient(135deg, #D84124 0%, #ED8B34 100%)',
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StepSlider;
