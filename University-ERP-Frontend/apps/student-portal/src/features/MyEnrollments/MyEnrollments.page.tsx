import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentInformationApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export default function MyEnrollments() {
  const { user } = useAuth();
  
  const { data: enrollments, isLoading, error } = useQuery({
    queryKey: ['studentEnrollments', user?.id],
    queryFn: () => studentInformationApi.getEnrollments(user!.id),
    enabled: !!user?.id
  });

  if (isLoading) return <div style={{ color: '#aaa' }}>Loading enrollments...</div>;
  if (error) return <div style={{ color: 'hsl(0, 70%, 60%)' }}>Error loading enrollments. Backend may be offline.</div>;
  if (!enrollments) return null;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>My Enrollments</h1>
      
      {enrollments.length === 0 ? (
        <div style={{ color: '#888' }}>No active enrollments found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {enrollments.map(enrollment => (
            <div key={enrollment.id} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '1.5rem',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{enrollment.term}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white' }}>{enrollment.courseCode} - {enrollment.courseName}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Credits: {enrollment.credits}</div>
                <div style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 600,
                  color: enrollment.grade ? 'hsl(160, 70%, 55%)' : '#aaa'
                }}>
                  {enrollment.grade || 'In Progress'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
