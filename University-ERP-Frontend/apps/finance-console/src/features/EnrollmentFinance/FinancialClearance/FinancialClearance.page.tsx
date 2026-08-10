import React from 'react';

export const FinancialClearancePage: React.FC = () => {
    return (
        <div className="finance-page p-6">
            <header className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-800">Financial Clearance</h1>
                <p className="text-gray-500 mt-2">Issue FINANCIAL_CLEARANCE for paid applicants to unlock Registrar Enrollment Activation.</p>
            </header>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <p className="text-gray-600">This acts as the gatekeeper to Official Enrollment.</p>
            </div>
        </div>
    );
};
