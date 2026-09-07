import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const GradesPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Course Grades & Evaluations" 
        subtitle="Review grades, feedback, and performance breakdowns." 
      />
      <Card>
        <p>Course Grades & Evaluations is active and initialized.</p>
      </Card>
    </div>
  );
};

export default GradesPage;
