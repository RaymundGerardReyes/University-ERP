import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const BudgetingPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader title="Budgeting & Allocation" subtitle="Departmental budgets and financial planning." />
      <Card>
        <h3>Fiscal Year Overview</h3>
        <p>Manage budget allocations across university faculties.</p>
      </Card>
    </div>
  );
};
