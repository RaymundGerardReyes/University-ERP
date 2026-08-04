import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useAlumniStatus } from './AlumniNetwork.hooks';

export const AlumniNetworkPage: React.FC = () => {
  const { data: alumni, isLoading, isError } = useAlumniStatus();

  if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;
  if (isError || !alumni) return <div className="stub-page fade-in"><div className="stub-title">Failed to load alumni data.</div></div>;

  const isActive = alumni.alumniStatus === 'Active Member' || alumni.alumniStatus === 'Registered';

  return (
    <div className="fade-in">
      <PageHeader title="Alumni Network" subtitle="Stay connected with your university community." />
      
      <div className="card fade-in-delay-1" style={{ maxWidth: '800px' }}>
        <div className="card-accent-top" />
        <div className="profile-hero" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div className="profile-avatar" style={{ background: 'linear-gradient(135deg, var(--brand-secondary), var(--brand-primary))' }}>
            {alumni.graduationYear.slice(-2)}'
          </div>
          <div>
            <div className="profile-name">Class of {alumni.graduationYear}</div>
            <div className="profile-email">Regional Chapter: <strong style={{color: 'var(--text-primary)'}}>{alumni.chapter || 'Unassigned'}</strong></div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <Badge colorScheme={isActive ? 'success' : 'warning'} style={{ fontSize: '0.9rem', padding: 'var(--space-1) var(--space-3)' }}>
              {isActive ? 'Active Alumni' : 'Pending Registration'}
            </Badge>
          </div>
        </div>

        <div className="grid-2">
          <div>
            <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: 'var(--space-2)' }}>Clearance Status</h4>
            <p style={{ fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>{alumni.alumniStatus}</p>
          </div>
          <div>
             <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: 'var(--space-2)' }}>Membership Benefits</h4>
             <p style={{ fontWeight: 600, fontSize: '1.1rem', margin: 0, color: alumni.benefitsActive ? 'var(--success-text)' : 'var(--text-secondary)' }}>
               {alumni.benefitsActive ? 'Fully Active' : 'Suspended / Inactive'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};