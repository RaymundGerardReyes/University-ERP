import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { healthCenterApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Card, PageHeader, Button, Badge } from '@university-erp/ui-kit';

export default function HealthRecords() {
  const { user } = useAuth();
  
  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['healthAppointments', user?.id],
    queryFn: () => healthCenterApi.getAppointments(user!.id),
    enabled: !!user?.id
  });

  if (isLoading) return <div style={{ color: '#aaa' }}>Loading health records...</div>;
  if (error) return <div style={{ color: 'hsl(0, 70%, 60%)' }}>Error loading data.</div>;

  return (
    <div>
      <PageHeader 
        title="Health Records & Appointments" 
        action={<Button variant="primary">Book Appointment</Button>}
      />
      
      {!appointments || appointments.length === 0 ? (
        <div style={{ color: '#888' }}>No appointments found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {appointments.map(appt => (
            <Card key={appt.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: 'hsl(220, 90%, 75%)', fontWeight: 600, marginBottom: '0.5rem' }}>{appt.date} at {appt.time}</div>
                  <div style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.2rem' }}>{appt.doctorName}</div>
                  <div style={{ color: '#aaa', fontSize: '0.9rem' }}>{appt.specialty}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge colorScheme={appt.status === 'Scheduled' ? 'info' : 'default'}>
                    {appt.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
