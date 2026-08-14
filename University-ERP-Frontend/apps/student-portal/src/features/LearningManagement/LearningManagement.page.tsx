import { Button, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useCourseContent } from './LearningManagement.hooks';

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
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{period.description}</p>
          <div className="grid-auto">
            {period.items?.map((item: any) => (
              <div key={item.id} style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 700, textTransform: 'uppercase' }}>{item.contentType}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>{item.name}</div>
                <div style={{ marginTop: 'auto' }}>
                  <Button variant="outline" size="small" onClick={() => window.open(item.resourceUrl, '_blank')}>View Resource</Button>
                </div>
              </div>
            ))}
            {(!period.items || period.items.length === 0) && (
                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No content uploaded for this module yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const LearningManagementPage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // Use the new hook for the database-driven LMS content
  const { data: course, isLoading, isError } = useCourseContent(courseId || '');

  if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;
  if (isError || !course) return <div className="stub-page fade-in"><div className="stub-title">Course syllabus not found or API unavailable.</div></div>;

  return (
    <div className="fade-in">
      <Button variant="outline" onClick={() => navigate('/enrollments')} style={{ marginBottom: 'var(--space-6)' }}>
        ← Back to Enrollments
      </Button>

      <PageHeader title={`LMS: ${course.title}`} subtitle={course.description} />

      <div className="card fade-in-delay-1" style={{ marginBottom: 'var(--space-6)', background: 'var(--brand-gradient-soft)', borderColor: 'var(--brand-primary)' }}>
        <h3 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-primary)' }}>Course Syllabus & Modules</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Access your learning materials, videos, and assignments below.</p>
      </div>

      <div>
        {course.modules?.sort((a: any, b: any) => a.orderSequence - b.orderSequence).map((mod: any, index: number) => (
          <AssessmentPeriodAccordion key={mod.id} period={mod} delayIndex={(index % 3) + 1} />
        ))}
        {(!course.modules || course.modules.length === 0) && (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
                The professor has not published any modules for this syllabus yet.
            </div>
        )}
      </div>
    </div>
  );
};