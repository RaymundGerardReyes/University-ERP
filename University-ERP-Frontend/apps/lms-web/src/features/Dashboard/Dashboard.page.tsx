import React from 'react';
import { PageHeader, Card, Button } from '@university-erp/ui-kit';
import { useDashboardOverview } from './Dashboard.hooks';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useDashboardOverview();
  const navigate = useNavigate();

  return (
    <div className="fade-in">
      <PageHeader 
        title="LMS Learning Portal Dashboard" 
        subtitle="Manage online curriculum, offline Avalonia packages, and sync submissions." 
      />
      
      {isLoading ? (
        <div className="skeleton" style={{ height: '300px' }} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <Card>
            <h4 style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>Enrolled Courses</h4>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--brand-primary)' }}>{stats?.totalCourses || 4}</div>
          </Card>
          <Card>
            <h4 style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>Pending Submissions</h4>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning-color)' }}>{stats?.pendingSubmissions || 2}</div>
          </Card>
          <Card>
            <h4 style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>Active Quizzes</h4>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success-color)' }}>{stats?.activeQuizzes || 1}</div>
          </Card>
          <Card>
            <h4 style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>Offline Packages</h4>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stats?.syncedPackages || 3}</div>
          </Card>
        </div>
      )}

      <Card>
        <h3 style={{ margin: '0 0 1rem 0' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={() => navigate('/admin/packaging')}>Package Offline Courses</Button>
          <Button variant="outline" onClick={() => navigate('/instructor/submissions')}>Review Offline Submissions</Button>
          <Button variant="outline" onClick={() => navigate('/instructor/gradebook')}>Sync Grades to Registrar</Button>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
