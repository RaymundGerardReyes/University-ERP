import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const DiscussionsPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Course Discussions & Forums" 
        subtitle="Engage in collaborative course discussions with peers and faculty." 
      />
      <Card>
        <p>Course Discussions & Forums is active and initialized.</p>
      </Card>
    </div>
  );
};

export default DiscussionsPage;
