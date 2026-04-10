function MyTemplates() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Templates</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
                    <p className="text-gray-500 text-center">No templates saved yet</p>
                </div>
            </div>
        </div>
    );
}

export default MyTemplates;
