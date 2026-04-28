function BillingAndPayment() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Billing & Payment</h1>
            <div className="bg-[#121213] rounded-lg shadow p-6">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-white">Payment Method</h2>
                        <p className="text-[#96969F]">No payment method on file</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-white">Billing History</h2>
                        <p className="text-[#96969F]">No billing history available</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BillingAndPayment;
