import React from 'react';
import { PageHeader, Card, Button } from '@university-erp/ui-kit';
import { useCourseContent } from './CourseContent.hooks';

export const CourseContentPage: React.FC = () => {
  const { data: course, isLoading } = useCourseContent('CS-101');

  return (
    <div className="fade-in">
      <PageHeader 
        title="Course Content & Syllabus" 
        subtitle="Access course modules, lecture slides, and resources." 
      />
      {isLoading ? (
        <div className="skeleton" style={{ height: '300px' }} />
      ) : (
        <Card>
          <h3>{course?.title || 'Introduction to Computer Science'}</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{course?.description || 'Foundational programming and algorithmic principles.'}</p>
          <div style={{ marginTop: '1rem' }}>
            <p>Course Content & Syllabus is active and initialized.</p>
            <Button variant="outline" size="small">Download All Lecture Slides</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CourseContentPage;
