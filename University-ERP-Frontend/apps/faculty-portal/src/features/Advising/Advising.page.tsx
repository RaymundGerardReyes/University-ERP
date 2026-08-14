import React, { useState } from 'react';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import { useNavigate } from 'react-router-dom';
import { useMyAdvisees } from './Advising.hooks';
import { createLogger } from '@university-erp/core-logger';

const logger = createLogger('faculty-portal', 'AdvisingWorkspace');

export const AdvisingPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Fetch assigned advisees using your existing data hook architecture
  const { data: advisees = [], isLoading } = useMyAdvisees();

  // Calculate KPIs
  const totalAdvisees = advisees.length;
  const atRiskCount = advisees.filter((student: any) => student.status === 'Warning' || student.status === 'Critical' || student.status === 'At Risk').length;

  // Search/Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'AT_RISK'>('ALL');

  const filteredAdvisees = advisees.filter((student: any) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.studentId.includes(searchTerm);
    const matchesFilter = filter === 'ALL' || (filter === 'AT_RISK' && (student.status === 'Warning' || student.status === 'Critical' || student.status === 'At Risk'));
    return matchesSearch && matchesFilter;
  });

  const handleMessageStudent = (studentId: string) => {
    logger.info(`Initiating message to advisee: ${studentId}`);
    // Route to the communications workspace with the student context pre-loaded
    navigate(`/communication?composeTo=${studentId}`);
  };

  if (isLoading) return <div className="skeleton" style={{ height: '600px' }} />;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader 
        title="My Advisees" 
        subtitle="Monitor degree progress, academic standing, and provide mentorship to your assigned students." 
      />

      {/* KPI & FILTER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <Card style={{ padding: 'var(--space-3) var(--space-5)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Cohort</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalAdvisees}</span>
          </Card>
          <Card style={{ padding: 'var(--space-3) var(--space-5)', display: 'flex', flexDirection: 'column', alignItems: 'center', borderColor: atRiskCount > 0 ? 'var(--warning-border)' : 'var(--border-color)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Requires Attention</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: atRiskCount > 0 ? 'var(--warning-text)' : 'var(--success-text)' }}>{atRiskCount}</span>
          </Card>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <input 
            type="text" 
            placeholder="Search student or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
          />
          <Button variant={filter === 'ALL' ? 'primary' : 'outline'} onClick={() => setFilter('ALL')}>All</Button>
          <Button variant={filter === 'AT_RISK' ? 'primary' : 'outline'} onClick={() => setFilter('AT_RISK')}>At Risk</Button>
        </div>
      </div>

      {/* ADVISEE GRID */}
      <div className="grid-3">
        {filteredAdvisees.map((student: any) => (
          <Card key={student.studentId} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
              <div>
                <h3 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--text-bright)' }}>{student.name}</h3>
                <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{student.studentId}</div>
              </div>
              <Badge colorScheme={student.status === 'Good' ? 'success' : student.status === 'Warning' || student.status === 'At Risk' ? 'warning' : 'danger'}>
                {student.status}
              </Badge>
            </div>

            {/* Program & Degree Progress */}
            <div style={{ marginBottom: 'var(--space-4)', flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-primary)', marginBottom: 'var(--space-2)' }}>
                {student.program}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Degree Progress</span>
                <span>{student.degreeProgress}%</span>
              </div>
              {/* Native Progress Bar Visualization */}
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-active)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${student.degreeProgress}%`, 
                    height: '100%', 
                    background: student.degreeProgress >= 80 ? 'var(--success-text)' : student.degreeProgress >= 50 ? 'var(--brand-primary)' : 'var(--warning-text)',
                    transition: 'width 0.3s ease'
                  }} 
                />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                GWA: <strong style={{ color: 'var(--text-primary)' }}>{student.gwa}</strong>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
              <Button variant="outline" size="small" style={{ flex: 1 }} onClick={() => logger.info(`Viewing transcript for ${student.studentId}`)}>
                View Transcript
              </Button>
              <Button variant="secondary" size="small" style={{ flex: 1 }} onClick={() => handleMessageStudent(student.studentId)}>
                Message
              </Button>
            </div>
          </Card>
        ))}

        {filteredAdvisees.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: 'var(--space-8)', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '3rem', opacity: 0.5, marginBottom: 'var(--space-4)' }}>🎓</div>
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-2) 0' }}>No Advisees Found</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};