import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const DashboardPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="LMS Student Dashboard" 
        subtitle="Overview of enrolled courses, recent activity, and announcements." 
      />
      <Card>
        <p>LMS Student Dashboard is active and initialized.</p>
      </Card>
    </div>
  );
};

export default DashboardPage;
