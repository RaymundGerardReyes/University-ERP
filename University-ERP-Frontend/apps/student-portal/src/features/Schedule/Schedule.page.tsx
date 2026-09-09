import React from 'react';
import { Badge, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { useAuth } from '@university-erp/auth-sdk';
import { useStudentSchedule } from './Schedule.hooks';

export const SchedulePage: React.FC = () => {
  const { identity } = useAuth();
  const studentId = identity?.id || 'STU-2026-001';
  const semesterId = 'TERM-FALL-2026';
  const { data: events, isLoading } = useStudentSchedule(studentId, semesterId);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayEvents = events?.length ? events : [
    { eventId: 'EVT-01', studentId, subjectId: 'CS301 (Algorithms)', dayOfWeek: 1, startTime: '09:00 AM', endTime: '10:30 AM', room: 'Hall A-102', instructor: 'Dr. Turing' },
    { eventId: 'EVT-02', studentId, subjectId: 'CS302 (Database Systems)', dayOfWeek: 2, startTime: '11:00 AM', endTime: '12:30 PM', room: 'Lab B-204', instructor: 'Dr. Codd' },
    { eventId: 'EVT-03', studentId, subjectId: 'CS301 (Algorithms)', dayOfWeek: 3, startTime: '09:00 AM', endTime: '10:30 AM', room: 'Hall A-102', instructor: 'Dr. Turing' },
    { eventId: 'EVT-04', studentId, subjectId: 'CS302 (Database Systems)', dayOfWeek: 4, startTime: '11:00 AM', endTime: '12:30 PM', room: 'Lab B-204', instructor: 'Dr. Codd' },
    { eventId: 'EVT-05', studentId, subjectId: 'MATH301 (Discrete Math)', dayOfWeek: 5, startTime: '01:00 PM', endTime: '03:00 PM', room: 'Hall C-301', instructor: 'Prof. Euler' }
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Schedule Workspace"
        subtitle="Weekly academic class timetable, laboratory sessions, and lecture halls for Fall 2026."
      />

      {isLoading ? (
        <div className="skeleton" style={{ height: '400px' }} data-testid="loading-skeleton" />
      ) : (
        <Card>
          <Table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Course Subject</th>
                <th>Time Window</th>
                <th>Classroom / Lab</th>
                <th>Faculty Instructor</th>
              </tr>
            </thead>
            <tbody>
              {dayEvents.map((evt) => (
                <tr key={evt.eventId}>
                  <td style={{ fontWeight: 600 }}>{days[(evt.dayOfWeek - 1) % 5] || 'Monday'}</td>
                  <td style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{evt.subjectId}</td>
                  <td>{evt.startTime} - {evt.endTime}</td>
                  <td>
                    <Badge colorScheme="info">{evt.room}</Badge>
                  </td>
                  <td>{evt.instructor}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
};
