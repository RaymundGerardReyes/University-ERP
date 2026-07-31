import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useStudentProfile } from './StudentProfile.hooks';

export const StudentProfilePage: React.FC = () => {
  const { data: profile, isLoading, isError } = useStudentProfile();

  if (isLoading) return <div style={{ color: 'white' }}>Loading profile data...</div>;
  if (isError || !profile) return <div style={{ color: 'red' }}>Failed to load student profile.</div>;

  return (
    <div>
      <PageHeader title="My Profile" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <h2 style={{ color: 'white', marginTop: 0 }}>
            {profile.firstName} {profile.lastName}
          </h2>
          <p style={{ color: '#aaa' }}>{profile.email}</p>
          <p style={{ color: '#aaa' }}>Phone: {profile.phoneNumber}</p>
        </Card>

        <Card>
          <h3 style={{ color: 'white', marginTop: 0 }}>Academic Standing</h3>
          <p style={{ color: '#aaa' }}>Program: <strong>{profile.programName}</strong></p>
          <p style={{ color: '#aaa' }}>Current Semester: {profile.currentSemester}</p>
          <p style={{ color: '#aaa' }}>CGPA: {profile.cgpa}</p>
          <div style={{ marginTop: '1rem' }}>
            <Badge colorScheme="success">Enrolled</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
};