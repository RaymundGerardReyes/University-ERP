import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const AnalyticsBIPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader
        title="Analytics and Business Intelligence"
        subtitle="Executive dashboards, predictive models, and data warehouse integration."
      />
      <Card>
        <p>Analytics and Business Intelligence is active and operating.</p>
      </Card>
    </div>
  );
};

export default AnalyticsBIPage;
