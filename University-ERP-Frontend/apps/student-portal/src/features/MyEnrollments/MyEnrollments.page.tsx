import React from 'react';
import { useAuth } from '@university-erp/auth-sdk';
import { Card, PageHeader, Badge } from '@university-erp/ui-kit';
import { useMyEnrollments } from './MyEnrollments.hooks';

export default function MyEnrollments() {
  const { user } = useAuth();
  const { data: enrollments, isLoading, error } = useMyEnrollments(user?.id);

  if (isLoading) return <div style={{ color: '#aaa' }}>Loading enrollments...</div>;
  if (error) return <div style={{ color: 'hsl(0, 70%, 60%)' }}>Error loading data.</div>;
  if (!enrollments || enrollments.length === 0) return <div style={{ color: '#888' }}>No active enrollments.</div>;

  return (
    <div>
      <PageHeader title="My Enrollments" />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {enrollments.map(course => (
          <Card key={course.courseCode} style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{course.courseCode}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white' }}>{course.courseName}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'white', fontWeight: 600, marginBottom: '0.5rem' }}>{course.credits} Credits</div>
                <Badge colorScheme={course.status === 'Active' ? 'success' : 'default'}>
                  {course.status}
                </Badge>
              </div>
            </div>
            
            {course.grade && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ color: '#888', marginRight: '0.5rem' }}>Current Grade:</span> 
                <span style={{ color: 'hsl(220, 90%, 80%)', fontWeight: 600 }}>{course.grade}</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
