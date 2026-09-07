import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const CalendarPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Academic Schedule & Events" 
        subtitle="View assignment deadlines, lectures, and semester calendar." 
      />
      <Card>
        <p>Academic Schedule & Events is active and initialized.</p>
      </Card>
    </div>
  );
};

export default CalendarPage;
