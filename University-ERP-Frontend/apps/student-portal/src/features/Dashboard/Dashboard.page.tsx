import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const DashboardPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader title="Student Dashboard" subtitle="Welcome to your student portal." />
      <Card>
        <h3>Overview</h3>
        <p>Welcome back to the University ERP Student Portal.</p>
      </Card>
    </div>
  );
};
