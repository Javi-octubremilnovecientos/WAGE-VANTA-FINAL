function Plans() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-12">Plans & Pricing</h1>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* FREE Plan */}
                <div className="p-8 bg-white rounded-lg shadow-lg border-2 border-gray-200">
                    <h2 className="text-2xl font-bold mb-4">FREE</h2>
                    <p className="text-3xl font-bold mb-6">$0<span className="text-sm font-normal">/month</span></p>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>Up to 2 countries</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>Save 1 template</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>Save 1 comparison</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>One chart view</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-600 mr-2">✗</span>
                            <span>No export options</span>
                        </li>
                    </ul>
                    <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition">
                        Current Plan
                    </button>
                </div>

                {/* PREMIUM Plan */}
                <div className="p-8 bg-white rounded-lg shadow-lg border-2 border-blue-600">
                    <div className="text-sm font-semibold text-blue-600 mb-2">RECOMMENDED</div>
                    <h2 className="text-2xl font-bold mb-4">PREMIUM</h2>
                    <p className="text-3xl font-bold mb-6">$9.99<span className="text-sm font-normal">/month</span></p>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>Up to 3 countries</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>Save up to 4 templates</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>Save up to 4 comparisons</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>Multiple chart views</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>Export (PDF, CSV, PNG)</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>Full historical data</span>
                        </li>
                    </ul>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Plans;
