import React from 'react';

export const DownpaymentPage: React.FC = () => {
    return (
        <div className="finance-page p-6">
            <header className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-800">Enrollment Downpayment</h1>
                <p className="text-gray-500 mt-2">Verify incoming downpayments from the Applicant Portal payment gateway.</p>
            </header>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <p className="text-gray-600">Transitions cases from PAYMENT_PENDING to PAYMENT_VERIFIED.</p>
            </div>
        </div>
    );
};
