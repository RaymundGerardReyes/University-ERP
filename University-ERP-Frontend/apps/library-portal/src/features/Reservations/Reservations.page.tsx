import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const ReservationsPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Book Reservations" 
        subtitle="Manage hold requests and reservation queues." 
      />
      <Card>
        <p>Book Reservations is active and initialized.</p>
      </Card>
    </div>
  );
};

export default ReservationsPage;
