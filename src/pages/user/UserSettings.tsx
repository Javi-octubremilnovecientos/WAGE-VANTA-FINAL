function UserSettings() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">User Settings</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                        <p className="text-gray-600">Manage your profile information</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
                        <p className="text-gray-600">Configure your preferences</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserSettings;
