import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useMyEnrollments } from './MyEnrollments.hooks';

export const MyEnrollmentsPage: React.FC = () => {
  const { data: enrollments, isLoading, isError } = useMyEnrollments();

  if (isLoading) return <div style={{ color: 'white' }}>Loading enrollments...</div>;
  if (isError || !enrollments) return <div style={{ color: 'red' }}>Failed to load enrollments.</div>;

  return (
    <div>
      <PageHeader title="My Current Enrollments" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {enrollments.map((course) => (
          <Card key={course.courseCode} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>{course.courseName}</h3>
              <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{course.courseCode} • {course.credits} Credits</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {course.grade && (
                <span style={{ color: 'white', fontWeight: 'bold' }}>Grade: {course.grade}</span>
              )}
              <Badge colorScheme={course.status === 'Active' ? 'success' : 'default'}>
                {course.status}
              </Badge>
            </div>
          </Card>
        ))}
        {enrollments.length === 0 && (
          <p style={{ color: '#aaa' }}>You are not currently enrolled in any courses.</p>
        )}
      </div>
    </div>
  );
};