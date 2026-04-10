function BillingAndPayment() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Billing & Payment</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                        <p className="text-gray-600">No payment method on file</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Billing History</h2>
                        <p className="text-gray-600">No billing history available</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BillingAndPayment;
