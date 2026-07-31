import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentInformationApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';

export default function StudentProfile() {
  const { user } = useAuth();
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['studentProfile', user?.id],
    queryFn: () => studentInformationApi.getProfile(user!.id),
    enabled: !!user?.id
  });

  if (isLoading) return <div style={{ color: '#aaa' }}>Loading profile...</div>;
  if (error) return <div style={{ color: 'hsl(0, 70%, 60%)' }}>Error loading profile. Backend may be offline.</div>;
  if (!profile) return null;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>Student Profile</h1>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        borderRadius: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem'
      }}>
        <ProfileField label="Student Number" value={profile.studentNumber} />
        <ProfileField label="First Name" value={profile.firstName} />
        <ProfileField label="Last Name" value={profile.lastName} />
        <ProfileField label="Email" value={profile.email} />
        <ProfileField label="Program" value={profile.program} />
        <ProfileField label="Academic Standing" value={profile.academicStanding} highlight={profile.academicStanding === 'Good'} />
        <ProfileField label="Enrollment Status" value={profile.enrollmentStatus} />
      </div>
    </div>
  );
}

function ProfileField({ label, value, highlight }: { label: string, value: React.ReactNode, highlight?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.3rem' }}>{label}</div>
      <div style={{ 
        fontSize: '1.1rem', 
        fontWeight: 500,
        color: highlight ? 'hsl(160, 70%, 55%)' : 'white'
      }}>{value}</div>
    </div>
  );
}
