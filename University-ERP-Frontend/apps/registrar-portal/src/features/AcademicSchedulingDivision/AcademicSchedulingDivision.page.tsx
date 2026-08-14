import React from 'react';
import { Card, PageHeader, Badge, Button } from '@university-erp/ui-kit';

export const AcademicSchedulingDivisionPage: React.FC = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'];

  // A mock class block component to simulate the visual workspace
  const ClassBlock = ({ title, room, instructor, isConflict }: { title: string, room: string, instructor: string, isConflict?: boolean }) => (
    <div style={{
      background: isConflict ? 'var(--danger-bg, rgba(239, 68, 68, 0.1))' : 'var(--bg-elevated, var(--bg-surface))',
      border: `1px solid ${isConflict ? 'var(--danger-border, #ef4444)' : 'var(--border-color)'}`,
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-2)',
      height: '100%',
      boxShadow: isConflict ? 'var(--shadow-glow, 0 0 10px rgba(239, 68, 68, 0.3))' : 'var(--shadow-sm)',
      cursor: 'pointer'
    }}>
      <div style={{ fontWeight: 600, color: isConflict ? 'var(--danger-text, #ef4444)' : 'var(--text-bright, var(--text-primary))', fontSize: '0.85rem' }}>{title}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{room}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{instructor}</div>
      {isConflict && <Badge colorScheme="danger" style={{ marginTop: '4px' }}>Conflict</Badge>}
    </div>
  );

  return (
    <div className="fade-in">
      <PageHeader 
        title="Academic Scheduling Workspace" 
        subtitle="Visual scheduling matrix with real-time conflict detection." 
        action={<Button variant="primary">Publish Schedule</Button>}
      />

      <Card style={{ padding: 0, overflowX: 'auto' }}>
        <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: 'var(--space-4)', background: 'var(--bg-base)' }}>
            <select style={{ padding: '0.5rem', background: 'var(--bg-elevated, var(--bg-surface))', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                <option>Filter by: Computer Science Dept</option>
            </select>
            <select style={{ padding: '0.5rem', background: 'var(--bg-elevated, var(--bg-surface))', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                <option>Filter by: Room 302</option>
            </select>
        </div>

        {/* Visual Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: `80px repeat(${days.length}, 1fr)`, minWidth: '800px' }}>
          
          {/* Header Row */}
          <div style={{ borderBottom: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}></div>
          {days.map(day => (
            <div key={day} style={{ padding: 'var(--space-3)', fontWeight: 600, textAlign: 'center', borderBottom: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', background: 'var(--bg-base)' }}>
              {day}
            </div>
          ))}

          {/* Time Slots & Blocks */}
          {times.map(time => (
            <React.Fragment key={time}>
              {/* Time Column */}
              <div style={{ padding: 'var(--space-3)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-subtle, var(--border-color))' }}>
                {time}
              </div>
              
              {/* Grid Cells */}
              {days.map(day => {
                  // Simulating data placement
                  let block = null;
                  if (day === 'Monday' && time === '10:00 AM') {
                      block = <ClassBlock title="CS201 - Data Structures" room="Room 302" instructor="Dr. Turing" />;
                  }
                  if (day === 'Wednesday' && time === '10:00 AM') {
                      // Simulating a detected conflict
                      block = <ClassBlock title="CS201 & IT104" room="Room 302" instructor="Dr. Turing / Dr. Lovelace" isConflict={true} />;
                  }

                  return (
                    <div key={`${day}-${time}`} style={{ minHeight: '100px', padding: 'var(--space-2)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-subtle, var(--border-color))' }}>
                        {block}
                    </div>
                  );
              })}
            </React.Fragment>
          ))}
        </div>
      </Card>
    </div>
  );
};
