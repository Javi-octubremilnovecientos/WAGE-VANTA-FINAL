function ManagePlan() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Manage Plan</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Current Plan: FREE</h2>
                    <p className="text-gray-600">
                        Upgrade to Premium to unlock more features
                    </p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                    Upgrade to Premium
                </button>
            </div>
        </div>
    );
}

export default ManagePlan;
