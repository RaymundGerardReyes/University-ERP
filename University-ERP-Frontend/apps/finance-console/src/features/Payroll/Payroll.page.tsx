import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const PayrollPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader title="Faculty & Staff Payroll" subtitle="Process monthly compensation, taxes, and benefits." />
      <Card>
        <h3>Payroll Cycle</h3>
        <p>Disbursements and employee compensation history.</p>
      </Card>
    </div>
  );
};
