import React from 'react';
import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { useAuth } from '@university-erp/auth-sdk';
import { useCurriculumProgress } from './CurriculumProgress.hooks';

export const CurriculumProgressPage: React.FC = () => {
  const { identity } = useAuth();
  const studentId = identity?.id || 'STU-2026-001';
  const { data: progress, isLoading, isError } = useCurriculumProgress(studentId);

  const data = progress || {
    studentId,
    programId: 'BS-CS-2026',
    totalCreditsRequired: 128,
    creditsCompleted: 96,
    creditsInProgress: 16,
    gpa: 3.82,
    completedSubjects: ['CS101', 'CS102', 'MATH201', 'PHYS101', 'ENG101', 'CS201', 'CS202', 'MATH202'],
    requiredCourses: ['CS301 (Algorithms)', 'CS302 (Database Systems)', 'CS303 (Operating Systems)', 'CS401 (Capstone I)'],
    remainingCourses: ['CS303 (Operating Systems)', 'CS401 (Capstone I)', 'CS402 (Capstone II)', 'GEN-ED4 (Ethics)'],
    currentlyRegisteredCourses: ['CS301', 'CS302', 'MATH301', 'STAT201'],
    graduationEligibilityStatus: 'PENDING_REVIEW' as const
  };

  const percentComplete = Math.round((data.creditsCompleted / data.totalCreditsRequired) * 100);

  return (
    <div className="fade-in">
      <PageHeader
        title="CurriculumProgress Workspace"
        subtitle="Degree audit, program curriculum roadmap, and graduation eligibility checklist."
      />

      {isLoading ? (
        <div className="skeleton" style={{ height: '400px' }} data-testid="loading-skeleton" />
      ) : (
        <>
          {/* Progress Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Degree Completion</span>
              <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--brand-primary)' }}>
                {percentComplete}% ({data.creditsCompleted} / {data.totalCreditsRequired} Units)
              </h2>
            </Card>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Current GPA</span>
              <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--success-text)' }}>
                {data.gpa.toFixed(2)}
              </h2>
            </Card>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>In Progress Units</span>
              <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--text-primary)' }}>
                {data.creditsInProgress} Units
              </h2>
            </Card>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Graduation Eligibility</span>
              <div style={{ marginTop: 'var(--space-2)' }}>
                <Badge colorScheme={data.graduationEligibilityStatus === 'ELIGIBLE' ? 'success' : 'warning'}>
                  {data.graduationEligibilityStatus.replace(/_/g, ' ')}
                </Badge>
              </div>
            </Card>
          </div>

          {/* Degree Audit Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
            <Card>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Remaining Program Courses</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.remainingCourses.map((c, idx) => (
                  <li key={idx} style={{ padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>{c}</span>
                    <Badge colorScheme="warning">Pending</Badge>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Currently Registered (Fall 2026)</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.currentlyRegisteredCourses.map((c, idx) => (
                  <li key={idx} style={{ padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>{c}</span>
                    <Badge colorScheme="info">Enrolled</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
