import { Button, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
const learningManagementApi: any = {};

const AssessmentPeriodAccordion = ({ period, delayIndex }: { period: any, delayIndex: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`card fade-in-delay-${delayIndex}`} style={{ padding: 0, overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isOpen ? 'var(--bg-hover)' : 'transparent', transition: 'background 0.2s' }}
      >
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{period.title}</h3>
        <span style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
      </div>

      {isOpen && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', padding: 'var(--space-6)', background: 'var(--bg-elevated)' }}>
          <div className="grid-auto">
            {period.activities.map((act: any, idx: number) => (
              <div key={idx} style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 700, textTransform: 'uppercase' }}>{act.type}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.date}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>{act.title}</div>
                <div style={{ marginTop: 'auto', fontSize: '1.25rem', fontWeight: 800, color: 'var(--success-text)' }}>{act.score}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const LearningManagementPage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading, isError } = useQuery({
    queryKey: ['courseLms', courseId],
    queryFn: () => (learningManagementApi as any).getCourseDetails?.(courseId),
    enabled: !!courseId
  });

  if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;
  if (isError || !course) return <div className="stub-page fade-in"><div className="stub-title">Course not found or API unavailable.</div></div>;

  return (
    <div className="fade-in">
      <Button variant="outline" onClick={() => navigate('/enrollments')} style={{ marginBottom: 'var(--space-6)' }}>
        ← Back to Enrollments
      </Button>

      <PageHeader title={`${course.code.toUpperCase()} LMS: ${course.name}`} subtitle={`Faculty: ${course.faculty}`} />

      <div className="card fade-in-delay-1" style={{ marginBottom: 'var(--space-6)', background: 'var(--brand-gradient-soft)', borderColor: 'var(--brand-primary)' }}>
        <h3 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-primary)' }}>Gradebook & Activities</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Track your granular academic progress across the primary assessment periods below.</p>
      </div>

      <div>
        {course.modules.map((mod: any, index: number) => (
          <AssessmentPeriodAccordion key={index} period={mod} delayIndex={(index % 3) + 1} />
        ))}
      </div>
    </div>
  );
};