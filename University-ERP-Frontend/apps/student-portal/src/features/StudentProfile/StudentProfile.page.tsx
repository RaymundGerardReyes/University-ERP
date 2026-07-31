import React from 'react';
import { useAuth } from '@university-erp/auth-sdk';
import { Card, PageHeader } from '@university-erp/ui-kit';
import { useStudentProfile } from './StudentProfile.hooks';
import { ProfileFieldProps } from './StudentProfile.types';

export default function StudentProfile() {
  const { user } = useAuth();
  const { data: profile, isLoading, error } = useStudentProfile(user?.id);

  if (isLoading) return <div style={{ color: '#aaa' }}>Loading profile...</div>;
  if (error) return <div style={{ color: 'hsl(0, 70%, 60%)' }}>Error loading data.</div>;
  if (!profile) return <div style={{ color: '#888' }}>Profile not found.</div>;

  return (
    <div>
      <PageHeader title="Student Profile" />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        <Card gradient style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ 
            width: '120px', height: '120px', borderRadius: '50%', 
            background: 'rgba(255, 255, 255, 0.2)', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem'
          }}>
            🎓
          </div>
          <h2 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>{profile.firstName} {profile.lastName}</h2>
          <div style={{ color: 'hsl(220, 90%, 80%)', marginBottom: '0.5rem' }}>{profile.programName}</div>
          <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Enrolled: {profile.enrollmentYear}</div>
        </Card>

        <Card>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
            Academic Information
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <ProfileField label="Student ID" value={profile.id} />
            <ProfileField label="Current Semester" value={profile.currentSemester} />
            <ProfileField label="Total Credits" value={profile.totalCreditsEarned} />
            <ProfileField label="CGPA" value={profile.cgpa.toFixed(2)} />
          </div>

          <h3 style={{ marginTop: '2.5rem', marginBottom: '1.5rem', color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
            Contact Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <ProfileField label="Email" value={profile.email} />
            <ProfileField label="Phone" value={profile.phoneNumber} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div>
      <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ color: 'white', fontSize: '1.1rem' }}>{value}</div>
    </div>
  );
}
