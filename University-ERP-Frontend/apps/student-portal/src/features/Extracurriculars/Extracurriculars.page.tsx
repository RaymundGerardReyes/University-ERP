import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const ExtracurricularsPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader title="Extracurricular Activities" subtitle="Clubs, organizations, and campus events." />
      <Card>
        <h3>Activities & Clubs</h3>
      </Card>
    </div>
  );
};
