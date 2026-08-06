import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';

export const InterviewSchedulingPage: React.FC = () => {
  const [scheduledSlot, setScheduledSlot] = useState<string | null>(null);

  const slots = [
    { id: '1', date: 'August 12, 2026', time: '10:00 AM - 10:45 AM', interviewer: 'Admissions Panel A' },
    { id: '2', date: 'August 13, 2026', time: '02:00 PM - 02:45 PM', interviewer: 'Department Chair' },
    { id: '3', date: 'August 15, 2026', time: '11:15 AM - 12:00 PM', interviewer: 'Admissions Panel B' },
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Interview Scheduling"
        subtitle="Book and manage your admissions interview session."
      />

      <div className="content-container fade-in-delay-1" style={{ maxWidth: '800px' }}>
        <Card>
          <div className="card-accent-top" style={{ background: 'var(--brand-gradient)' }} />
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-bright)', marginBottom: 'var(--space-2)' }}>
            Admissions Interview Selection
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-6)' }}>
            Please select an available time slot for your 45-minute virtual admissions assessment.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {slots.map((slot) => {
              const isSelected = scheduledSlot === slot.id;
              return (
                <div
                  key={slot.id}
                  style={{
                    padding: 'var(--space-4)',
                    background: isSelected ? 'var(--bg-elevated)' : 'var(--bg-base)',
                    border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{slot.date}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{slot.time} • {slot.interviewer}</div>
                  </div>

                  <Button
                    variant={isSelected ? 'primary' : 'outline'}
                    onClick={() => setScheduledSlot(slot.id)}
                  >
                    {isSelected ? 'Confirmed Slot' : 'Select Slot'}
                  </Button>
                </div>
              );
            })}
          </div>

          {scheduledSlot && (
            <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--success-text)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                <Badge colorScheme="success">Interview Booked</Badge>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>Confirmation Link Dispatched</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                A video conference link has been sent to your registered email address.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
