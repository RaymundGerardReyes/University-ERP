import React from 'react';
import { PageHeader, Card } from '@university-erp/ui-kit';

export const CourseContentPage: React.FC = () => {
  return (
    <div className="fade-in">
      <PageHeader 
        title="Course Content & Syllabus" 
        subtitle="Access course modules, lecture slides, and resources." 
      />
      <Card>
        <p>Course Content & Syllabus is active and initialized.</p>
      </Card>
    </div>
  );
};

export default CourseContentPage;
