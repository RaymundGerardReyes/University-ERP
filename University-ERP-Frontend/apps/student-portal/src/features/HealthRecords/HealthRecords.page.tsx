import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useHealthAppointments } from './HealthRecords.hooks';

export const HealthRecordsPage: React.FC = () => {
  const { data: appointments, isLoading, isError } = useHealthAppointments();

  if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;
  if (isError || !appointments) return <div className="stub-page fade-in"><div className="stub-title">Failed to load health records.</div></div>;

  return (
    <div className="fade-in">
      <PageHeader title="Health & Wellness" subtitle="Track your medical appointments and campus clinic visits." />

      <div className="grid-auto fade-in-delay-1">
        {appointments.map((apt, idx) => (
          <Card key={apt.id} className={`fade-in-delay-${(idx % 3) + 1}`} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-accent-top" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
              <Badge colorScheme={apt.status === 'Scheduled' ? 'info' : 'success'}>{apt.status}</Badge>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{apt.id}</span>
            </div>

            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0', fontSize: '1.25rem' }}>{apt.doctorName}</h3>
            <p style={{ color: 'var(--brand-primary)', margin: '0 0 var(--space-5) 0', fontSize: '0.9rem', fontWeight: 600 }}>{apt.specialty}</p>

            <div style={{ marginTop: 'auto', background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div className="data-row" style={{ borderBottom: 'none', padding: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="data-label">Date</span>
                  <span className="data-value" style={{ textAlign: 'left' }}>{apt.date}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span className="data-label">Time</span>
                  <span className="data-value">{apt.time}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};