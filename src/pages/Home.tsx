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
        <div className="min-h-screen relative flex flex-col lg:flex-row-reverse items-start lg:items-center justify-around gap-5 lg:gap-3 py-8 px-4 lg:px-6">
            {/* Left Side: Hero title or Chart + Compare Button */}
            <div className="w-full lg:w-1/2 flex flex-col gap-5 lg:gap-3 lg:justify-start items-center">
                {!selectedCountry ? (
                    /* Hero state: no country selected yet */
                    <div className="flex flex-col gap-3 text-center items-center">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                            Wage Vantage
                        </h1>
                        <h3 className="text-sm lg:text-base font-medium text-gray-400">
                            Select a country to start comparing
                        </h3>
                    </div>
                ) : (
                    /* Active state: chart + compare button */
                    <div className="w-full max-w-[480px] flex flex-col gap-2 animate-[fadeIn_0.4s_ease-in]">
                        <MainChart />
                        <div className="flex items-center justify-center">
                            <button
                                onClick={handleCompare}
                                style={{ backgroundColor: "#45d2fd" }}
                                className="block w-3/4 lg:w-1/2 rounded-md px-2.5 py-2 text-center text-xs font-semibold text-gray-900 shadow-xs hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all"
                            >
                                Compare Now
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Side: Form Section */}
            <div className="w-full lg:w-1/2 px-4 lg:px-6">
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
