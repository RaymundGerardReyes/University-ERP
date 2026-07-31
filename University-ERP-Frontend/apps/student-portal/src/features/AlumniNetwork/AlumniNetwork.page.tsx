import React from 'react';
import { useAuth } from '@university-erp/auth-sdk';
import { Card, PageHeader, Badge, Button } from '@university-erp/ui-kit';
import { useAlumniStatus } from './AlumniNetwork.hooks';

export default function AlumniNetwork() {
  const { user } = useAuth();
  const { data: alumni, isLoading, error } = useAlumniStatus(user?.id);

  if (isLoading) return <div style={{ color: '#aaa' }}>Loading alumni status...</div>;
  if (error) return <div style={{ color: 'hsl(0, 70%, 60%)' }}>Error loading data.</div>;
  if (!alumni) return <div style={{ color: '#888' }}>Alumni records not found.</div>;

  return (
    <div>
      <PageHeader 
        title="Alumni Network" 
        action={
          alumni.graduationClearanceStatus !== 'Cleared' && 
          <Button variant="primary">Start Clearance</Button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <Card>
          <h3 style={{ marginTop: 0, color: 'white', marginBottom: '1.5rem' }}>Alumni Profile</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>Membership Status</div>
              <Badge colorScheme={alumni.isRegisteredAlumni ? 'success' : 'default'}>
                {alumni.isRegisteredAlumni ? 'Active Member' : 'Not Registered'}
              </Badge>
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>Graduation Clearance</div>
              <Badge colorScheme={alumni.graduationClearanceStatus === 'Cleared' ? 'success' : 'warning'}>
                {alumni.graduationClearanceStatus}
              </Badge>
            </div>
            <div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>Graduation Year</div>
              <div style={{ color: 'white', fontSize: '1.1rem' }}>{alumni.graduationYear || 'N/A'}</div>
            </div>
          </div>
        </Card>

        <Card gradient>
          <h3 style={{ marginTop: 0, color: 'white', marginBottom: '1.5rem' }}>Regional Chapter</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>
            {alumni.regionalChapter || 'Unassigned'}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Connect with graduates in your area, attend networking events, and access exclusive regional benefits.
          </p>
          <Button variant="secondary" style={{ width: '100%' }}>View Chapter Events</Button>
        </Card>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Active Benefits</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {alumni.activeBenefits.map(benefit => (
            <div key={benefit} style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '1rem',
              borderRadius: '8px',
              color: 'hsl(220, 90%, 80%)'
            }}>
              ✨ {benefit}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
