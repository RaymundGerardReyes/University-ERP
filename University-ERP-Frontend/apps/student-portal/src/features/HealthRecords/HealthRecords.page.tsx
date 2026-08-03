import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useHealthAppointments } from './HealthRecords.hooks';

export const HealthRecordsPage: React.FC = () => {
  const { data: appointments, isLoading, isError } = useHealthAppointments();

  if (isLoading) return <div style={{ color: 'var(--text-secondary)' }}>Loading health records...</div>;
  if (isError || !appointments) return <div style={{ color: 'red' }}>Failed to load health records.</div>;

  return (
    <div className="fade-in">
      <PageHeader title="Health & Wellness" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {appointments.map(apt => (
          <Card key={apt.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <h3 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }}>{apt.doctorName}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{apt.specialty} • {apt.date} at {apt.time}</p>
              </div>
              <Badge colorScheme={apt.status === 'Scheduled' ? 'info' : 'default'}>{apt.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};