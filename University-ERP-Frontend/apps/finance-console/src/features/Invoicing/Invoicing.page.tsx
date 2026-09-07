import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const InvoicingPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader title="Tuition & Invoicing" subtitle="Issue invoices and monitor assessment payments." />
      <Card>
        <h3>Invoices Queue</h3>
        <p>Manage active student invoices.</p>
      </Card>
    </div>
  );
};
