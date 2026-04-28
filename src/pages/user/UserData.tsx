function UserData() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Data</h1>
            <div className="bg-[#121213] rounded-lg shadow p-6">
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-white">Templates</h3>
                        <p className="text-[#96969F]">0 templates saved</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Comparisons</h3>
                        <p className="text-[#96969F]">0 comparisons saved</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserData;
