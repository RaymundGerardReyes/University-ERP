import React from 'react';
import { PageHeader, Card, Badge, Button } from '@university-erp/ui-kit';
import { useStudentDashboard } from './Dashboard.hooks';

export const DashboardPage: React.FC = () => {
  const { data: summary, isLoading } = useStudentDashboard();

  return (
    <div className="fade-in">
      <PageHeader 
        title="Student Academic Dashboard" 
        subtitle={`Welcome back, ${summary?.fullName || 'Student'} (${summary?.studentId || 'STU-2026'})`} 
        action={<Button variant="primary">View Full Enrollment</Button>}
      />

      {isLoading ? (
        <div className="skeleton" style={{ height: '50vh', margin: 'var(--space-6) 0' }} />
      ) : (
        <>
          <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
        <Card className="stat-card">
          <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
          <span className="stat-label">Cumulative GPA</span>
          <span className="stat-value">{summary?.cumulativeGpa.toFixed(2)}</span>
          <span className="stat-trend" style={{ color: 'var(--success-text)' }}>{summary?.academicStanding}</span>
        </Card>
        <Card className="stat-card">
          <div className="card-accent-top" style={{ background: 'var(--info-text)' }} />
          <span className="stat-label">Enrolled Units</span>
          <span className="stat-value" style={{ color: 'var(--info-text)' }}>{summary?.enrolledUnits} / {summary?.maxUnitsAllowed}</span>
          <span className="stat-trend">Current Term Regular Load</span>
        </Card>
        <Card className="stat-card">
          <div className="card-accent-top" style={{ background: 'var(--success-text)' }} />
          <span className="stat-label">Tuition Balance</span>
          <span className="stat-value" style={{ color: summary?.tuitionOutstandingBalance === 0 ? 'var(--success-text)' : 'var(--danger-text)' }}>
            ${summary?.tuitionOutstandingBalance.toFixed(2)}
          </span>
          <span className="stat-trend">{summary?.clearanceStatus === 'CLEARED' ? 'Financially Cleared' : 'Payment Required'}</span>
        </Card>
      </div>

      <div className="grid-2 fade-in-delay-2">
        <Card>
          <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
          <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-4)' }}>Next Scheduled Lecture</h2>
          <div style={{ padding: 'var(--space-4)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{summary?.nextClass.courseCode}: {summary?.nextClass.courseTitle}</span>
              <Badge colorScheme="info">{summary?.nextClass.startTime}</Badge>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Room: <strong>{summary?.nextClass.room}</strong> • Instructor: <strong>{summary?.nextClass.instructor}</strong>
            </p>
          </div>
        </Card>

        <Card>
          <div className="card-accent-top" style={{ background: 'var(--success-text)' }} />
          <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-4)' }}>Academic Standing and Registration</h2>
          <div className="data-row">
            <span className="data-label">Degree Program</span>
            <span className="data-value">{summary?.program}</span>
          </div>
          <div className="data-row">
            <span className="data-label">Year Standing</span>
            <span className="data-value">{summary?.yearLevel}</span>
          </div>
          <div className="data-row" style={{ borderBottom: 'none' }}>
            <span className="data-label">Enrollment Status</span>
            <Badge colorScheme="success">Official Registered</Badge>
          </div>
        </Card>
      </div>
      </>
      )}
    </div>
  );
};

export default DashboardPage;
