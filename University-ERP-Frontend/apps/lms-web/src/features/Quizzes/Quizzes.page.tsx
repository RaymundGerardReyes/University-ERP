import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const QuizzesPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Online Quizzes & Assessments" 
        subtitle="Take and review timed quizzes and academic assessments." 
      />
      <Card>
        <p>Online Quizzes & Assessments is active and initialized.</p>
      </Card>
    </div>
  );
};

export default QuizzesPage;
