import React from 'react';

export const EnrollmentHandoffPage: React.FC = () => {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Finance Handoff Queue</h1>
        <p className="text-gray-600">Route ADMISSION_APPROVED cases to the Finance Console.</p>
      </header>
      <div className="bg-white p-6 rounded shadow-sm border-l-4 border-blue-500">
        <h3 className="font-semibold mb-2">Architectural Note</h3>
        <p className="text-sm text-gray-700">
          This workspace orchestrates the handoff from Admissions to Finance for <code>FINANCIAL_ASSESSMENT</code>.
          <br/>
          It does <strong>not</strong> hand off directly to the Registrar for enrollment.
        </p>
      </div>
    </div>
  );
};
