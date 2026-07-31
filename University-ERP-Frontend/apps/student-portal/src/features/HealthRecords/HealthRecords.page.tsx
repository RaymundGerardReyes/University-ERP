import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useHealthAppointments } from './HealthRecords.hooks';

export const HealthRecordsPage: React.FC = () => {
  const { data: appointments, isLoading, isError } = useHealthAppointments();

  if (isLoading) return <div style={{ color: 'white' }}>Loading health records...</div>;
  if (isError || !appointments) return <div style={{ color: 'red' }}>Failed to load health records.</div>;

  return (
    <div>
      <PageHeader title="Health Center Appointments" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {appointments.map(apt => (
          <Card key={apt.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>{apt.doctorName}</h3>
                <p style={{ color: '#aaa', margin: 0 }}>{apt.specialty} • {apt.date} at {apt.time}</p>
              </div>
              <Badge colorScheme={apt.status === 'Scheduled' ? 'info' : 'default'}>{apt.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};