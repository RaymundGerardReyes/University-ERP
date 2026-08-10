import React from 'react';

export const AdmissionsDecisionPage: React.FC = () => {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Admissions Decision</h1>
        <p className="text-gray-600">Final gate for the Admissions department.</p>
      </header>
      <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
        <p className="mb-4">
          <strong>Note:</strong> Approving a case here transitions the state to <code>ADMISSION_APPROVED</code>.
        </p>
        <p className="text-sm text-gray-500">
          This does NOT mean the applicant is <code>OFFICIALLY_ENROLLED</code>. Enrollment occurs after the Finance clearance step.
        </p>
      </div>
    </div>
  );
};
