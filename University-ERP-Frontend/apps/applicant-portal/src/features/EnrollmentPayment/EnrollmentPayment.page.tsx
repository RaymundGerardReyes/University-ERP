import React from 'react';

export const EnrollmentPaymentPage: React.FC = () => {
    return (
        <div className="p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">Enrollment Payment</h1>
                <p className="text-gray-600">Complete your required downpayment to activate official enrollment.</p>
            </header>
            
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                <h3 className="font-semibold text-lg mb-2">Step 2 of 3: Financial Clearance</h3>
                <p className="text-gray-700 mb-4">
                    Congratulations on your admission! Before we can officially enroll you and generate your student credentials, 
                    please complete the enrollment downpayment as assessed by the Finance office.
                </p>
                <div className="bg-blue-50 text-blue-800 p-4 rounded mb-4">
                    <strong>Status:</strong> Awaiting Payment (PAYMENT_PENDING)
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                    Proceed to Payment Gateway
                </button>
            </div>
        </div>
    );
};
