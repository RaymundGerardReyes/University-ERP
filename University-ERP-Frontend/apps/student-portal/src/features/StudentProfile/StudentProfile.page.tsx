import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useStudentProfile } from './StudentProfile.hooks';

export const StudentProfilePage: React.FC = () => {
  const { data: profile, isLoading, isError } = useStudentProfile();

  if (isLoading) return <div style={{ color: 'var(--text-secondary)' }}>Loading profile data...</div>;
  if (isError || !profile) return <div style={{ color: 'var(--danger-text)' }}>Failed to load student profile.</div>;

  return (
    <div className="fade-in">
      <PageHeader title="My Profile" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
        
        <Card>
          <h2 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1.25rem' }}>
            {profile.firstName} {profile.lastName}
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0 0 var(--space-5) 0', fontSize: '0.95rem' }}>{profile.email}</p>
          
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
              Student ID: <strong style={{ color: 'var(--text-primary)' }}>{profile.studentNumber}</strong>
            </p>
          </div>
        </Card>

        <Card>
          <h2 style={{ margin: '0 0 var(--space-4) 0', fontSize: '1.1rem' }}>Academic Standing</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Program</span>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem', textAlign: 'right' }}>{profile.program}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Status</span>
              <Badge colorScheme="success">{profile.enrollmentStatus}</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>CGPA</span>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{profile.academicStanding}</strong>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};