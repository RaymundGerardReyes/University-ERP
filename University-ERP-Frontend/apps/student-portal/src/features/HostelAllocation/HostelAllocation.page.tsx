import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useHostelAllocation } from './HostelAllocation.hooks';

export const HostelAllocationPage: React.FC = () => {
  const { data: allocation, isLoading, isError } = useHostelAllocation();

  if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;
  if (isError || !allocation) return <div className="stub-page fade-in"><div className="stub-title">Failed to load hostel allocation.</div></div>;

  return (
    <div className="fade-in">
      <PageHeader title="Hostel Allocation" subtitle="Manage your campus living arrangements." />

      <div className="grid-2 fade-in-delay-1">
        <Card>
          <div className="card-accent-top" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
            <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.4rem' }}>{allocation.hostelName}</h2>
            <Badge colorScheme="success">{allocation.status}</Badge>
          </div>

          <div className="data-row">
            <span className="data-label">Room Number</span>
            <span className="data-value" style={{ fontSize: '1.2rem', color: 'var(--brand-primary)' }}>{allocation.roomNumber}</span>
          </div>
          <div className="data-row">
            <span className="data-label">Room Type</span>
            <span className="data-value">{allocation.roomType}</span>
          </div>
        </Card>

        <Card>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-4)' }}>
            Assigned Roommates
          </h2>
          {allocation.roommates.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {allocation.roommates.map(rm => (
                <div key={rm} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '0.9rem' }}>
                    {rm.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{rm}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>You currently have no roommates assigned.</p>
          )}
        </Card>
      </div>
    </div>
  );
};