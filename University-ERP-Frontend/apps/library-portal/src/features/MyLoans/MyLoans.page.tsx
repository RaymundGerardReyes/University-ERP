import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const MyLoansPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="My Book Loans" 
        subtitle="View active loans, due dates, and renewal options." 
      />
      <Card>
        <p>My Book Loans is active and initialized.</p>
      </Card>
    </div>
  );
};

export default MyLoansPage;
