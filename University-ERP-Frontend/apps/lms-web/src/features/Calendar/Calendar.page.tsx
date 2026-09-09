import React from 'react';
import { PageHeader, Card, Table, Badge } from '@university-erp/ui-kit';
import { useCalendarEvents } from './Calendar.hooks';

export const CalendarPage: React.FC = () => {
  const { data: events, isLoading } = useCalendarEvents();

  return (
    <div className="fade-in">
      <PageHeader 
        title="LMS Academic Calendar" 
        subtitle="Track upcoming assignments, examinations, and live lecture schedules." 
      />
      {isLoading ? (
        <div className="skeleton" style={{ height: '300px' }} />
      ) : (
        <Card>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Course</th>
                <th>Event</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2026-08-15</td>
                <td>CS101</td>
                <td>Lab 1 Submission Deadline</td>
                <td><Badge variant="warning">Assignment</Badge></td>
              </tr>
              <tr>
                <td>2026-08-20</td>
                <td>CS101</td>
                <td>Boolean Logic Timed Assessment</td>
                <td><Badge variant="info">Quiz</Badge></td>
              </tr>
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default CalendarPage;
