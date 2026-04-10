import MainChart from "../components/charts/MainChart";
import FormLayout from "../components/form/FormLayout";


export default function Home() {
    return (
        <div className="min-h-screenrelative flex flex-col lg:flex-row items-center justify-around gap-8 py-12">


            {/* Formularios lado a lado */}
            <div className="w-full px-6 lg:px-8">
               <MainChart/>
            </div>
            <div className="w-full px-6 lg:px-8">
                <FormLayout />
            </div>
        </div>
    )
}
