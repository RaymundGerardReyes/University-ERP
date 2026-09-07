import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const FinancialReportsPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader title="Financial Reports" subtitle="Balance sheets, cash flows, and general ledgers." />
      <Card>
        <h3>Statements</h3>
        <p>Generate auditable financial statements.</p>
      </Card>
    </div>
  );
};
