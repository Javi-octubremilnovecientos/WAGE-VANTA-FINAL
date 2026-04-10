function Dashboard() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">My Comparisons</h2>
                    <p className="text-gray-600">View and manage your saved comparisons</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">My Templates</h2>
                    <p className="text-gray-600">Access your saved templates</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Settings</h2>
                    <p className="text-gray-600">Manage your account settings</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
