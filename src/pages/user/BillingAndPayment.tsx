function BillingAndPayment() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Billing & Payment</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Payment Method</h2>
                        <p className="text-gray-500 dark:text-gray-600">No payment method on file</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Billing History</h2>
                        <p className="text-gray-500 dark:text-gray-600">No billing history available</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BillingAndPayment;
