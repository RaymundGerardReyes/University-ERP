import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const CommitteesPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Committees & Boards" 
        subtitle="Organize academic and administrative committees." 
      />
      <Card>
        <p>Committees & Boards is active and initialized.</p>
      </Card>
    </div>
  );
};

export default CommitteesPage;
