function PasswordRecovery() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Password Recovery</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="your@email.com"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PasswordRecovery;
