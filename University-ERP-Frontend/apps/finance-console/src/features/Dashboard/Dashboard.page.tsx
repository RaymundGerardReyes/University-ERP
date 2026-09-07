import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const DashboardPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader title="Finance Dashboard" subtitle="Financial health, revenues, and disbursements overview." />
      <Card>
        <h3>Revenue Summary</h3>
        <p>Overview of student collections, invoices, and balances.</p>
      </Card>
    </div>
  );
};
