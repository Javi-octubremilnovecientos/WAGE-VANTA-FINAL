import { useState } from "react";
import MainChart from "../components/charts/MainChart";
import FormLayout from "../components/form/FormLayout";
import CompareModal from "../components/ui/modals/CompareModal";


export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');

    const handleCompare = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleConfirm = () => {
        // Lógica de comparación
        console.log("Comparación confirmada");
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen relative flex flex-col lg:flex-row items-start lg:items-center justify-around gap-8 lg:gap-4 py-12 px-6 lg:px-8">
            {/* Left Side: Hero title or Chart + Compare Button */}
            <div className="w-full lg:w-1/2 flex flex-col gap-8 lg:gap-4 lg:justify-center items-center">
                {!selectedCountry ? (
                    /* Hero state: no country selected yet */
                    <div className="flex flex-col gap-4 text-center items-center">
                        <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                            Wage Vantage
                        </h1>
                        <h3 className="text-lg lg:text-xl font-medium text-gray-400">
                            Select a country to start comparing
                        </h3>
                    </div>
                ) : (
                    /* Active state: chart + compare button */
                    <div className="w-full max-w-[650px] flex flex-col gap-4 animate-[fadeIn_0.4s_ease-in]">
                        <MainChart />
                        <div className="flex items-center justify-center">
                            <button
                                onClick={handleCompare}
                                style={{ backgroundColor: "#45d2fd" }}
                                className="block w-full lg:w-1/2 rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-gray-900 shadow-xs hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all"
                            >
                                Compare Now
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Side: Form Section */}
            <div className="w-full lg:w-1/2 px-6 lg:px-8">
                <FormLayout onCountryChange={setSelectedCountry} />
            </div>

            {/* Compare Modal */}
            <CompareModal
                isOpen={isModalOpen}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                cancelText="Cancel"
                confirmText="Compare"
                cancelButtonColor="#6b7280"
                confirmButtonColor="#45d2fd"
            />
        </div>
    )
}
