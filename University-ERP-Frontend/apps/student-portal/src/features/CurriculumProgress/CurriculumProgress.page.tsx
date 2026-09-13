import React, { useState } from 'react';
import { Badge, Button, Card, EmptyState, PageHeader } from '@university-erp/ui-kit';
import { useAuth } from '@university-erp/auth-sdk';
import { useCurriculumProgress, useStudentProgramCurriculum } from './CurriculumProgress.hooks';
import type { CurriculumYearDto } from '@university-erp/api-clients';

const SEMESTER_LABEL: Record<string, string> = {
  First: '1st Semester',
  Second: '2nd Semester',
  Summer: 'Summer Term',
};

export const CurriculumProgressPage: React.FC = () => {
  const { identity } = useAuth();
  const studentId = identity?.id || '';
  const programCode = identity?.programCode || null;

  const { data: progress, isLoading: progressLoading } = useCurriculumProgress(studentId);
  const { data: curriculum, isLoading: curriculumLoading } = useStudentProgramCurriculum(programCode);

  const [expandedYear, setExpandedYear] = useState<number>(1);

  const completedSet = new Set(progress?.completedSubjects ?? []);
  const registeredSet = new Set(progress?.currentlyRegisteredCourses ?? []);

  const isLoading = progressLoading || curriculumLoading;

  const totalCreditsRequired = progress?.totalCreditsRequired ?? curriculum?.totalUnits ?? 0;
  const creditsCompleted = progress?.creditsCompleted ?? 0;
  const creditsInProgress = progress?.creditsInProgress ?? 0;
  const percentComplete = totalCreditsRequired > 0
    ? Math.round((creditsCompleted / totalCreditsRequired) * 100)
    : 0;

  return (
    <div className="fade-in">
      <PageHeader
        title="Curriculum Progress"
        subtitle="Your degree roadmap, subject completion tracker, and graduation eligibility status."
      />

      {isLoading ? (
        <div className="skeleton" style={{ height: '400px' }} data-testid="loading-skeleton" />
      ) : (
        <>
          {/* ─── Summary Cards ─────────────────────────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)'
          }}>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Program</span>
              <h2 style={{ margin: 'var(--space-2) 0 0 0', fontSize: '1.1rem', color: 'var(--brand-primary)' }}>
                {curriculum?.programCode ?? programCode ?? '—'}
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {curriculum?.programName}
              </span>
            </Card>

            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Degree Completion</span>
              <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--brand-primary)' }}>
                {percentComplete}%
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {creditsCompleted} / {totalCreditsRequired} units
              </span>
            </Card>

            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Current GPA</span>
              <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--success-text)' }}>
                {(progress?.gpa ?? 0).toFixed(2)}
              </h2>
            </Card>

            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>In Progress</span>
              <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--text-primary)' }}>
                {creditsInProgress} units
              </h2>
            </Card>

            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Graduation Eligibility</span>
              <div style={{ marginTop: 'var(--space-2)' }}>
                <Badge colorScheme={
                  progress?.graduationEligibilityStatus === 'ELIGIBLE' ? 'success' : 'warning'
                }>
                  {(progress?.graduationEligibilityStatus ?? 'PENDING_REVIEW').replace(/_/g, ' ')}
                </Badge>
              </div>
            </Card>
          </div>

          {/* ─── Curriculum Roadmap ────────────────────────────────────────── */}
          {!curriculum ? (
            <EmptyState
              title="Curriculum Not Available"
              description="Your enrolled program's curriculum has not been configured yet. Please contact the Registrar's Office."
            />
          ) : (
            <>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                  Curriculum Roadmap — {curriculum.programName}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  AY {curriculum.academicYear} &bull; v{curriculum.version} &bull; {curriculum.totalUnits} total units
                </span>
              </div>

              {/* Year tabs */}
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
                {curriculum.years.map((y) => (
                  <Button
                    key={y.yearLevel}
                    variant={expandedYear === y.yearLevel ? 'primary' : 'outline'}
                    onClick={() => setExpandedYear(y.yearLevel)}
                  >
                    Year {y.yearLevel}
                  </Button>
                ))}
              </div>

              {curriculum.years
                .filter((y: CurriculumYearDto) => y.yearLevel === expandedYear)
                .map((year: CurriculumYearDto) => (
                  <div key={year.yearLevel}>
                    {year.semesters.map((sem) => (
                      <div key={sem.semester} style={{ marginBottom: 'var(--space-5)' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 'var(--space-2) 0',
                          borderBottom: '2px solid var(--brand-primary)',
                          marginBottom: 'var(--space-3)',
                        }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                            {SEMESTER_LABEL[sem.semester] ?? sem.semester}
                          </h4>
                          <Badge colorScheme="info">{sem.totalUnits} units</Badge>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                          {sem.subjects.map((subj) => {
                            const isDone = completedSet.has(subj.code);
                            const isCurrently = registeredSet.has(subj.code);
                            let statusColor: 'success' | 'info' | 'warning' | 'default' = 'default';
                            let statusLabel = 'Not Taken';
                            if (isDone) { statusColor = 'success'; statusLabel = 'Completed'; }
                            else if (isCurrently) { statusColor = 'info'; statusLabel = 'In Progress'; }

                            return (
                              <div
                                key={subj.subjectId}
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: '90px 1fr 60px 100px 160px',
                                  gap: 'var(--space-3)',
                                  alignItems: 'center',
                                  padding: 'var(--space-3)',
                                  borderRadius: 'var(--radius-md)',
                                  background: isDone
                                    ? 'var(--success-bg, rgba(16,185,129,0.06))'
                                    : isCurrently
                                    ? 'var(--info-bg, rgba(59,130,246,0.06))'
                                    : 'var(--bg-card)',
                                  border: '1px solid var(--border-subtle)',
                                }}
                              >
                                <span style={{ fontWeight: 700, color: 'var(--brand-primary)', fontSize: '0.88rem' }}>
                                  {subj.code}
                                </span>
                                <span style={{ fontSize: '0.88rem' }}>{subj.title}</span>
                                <span style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                  {subj.units} u
                                </span>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                  {subj.prerequisiteCodes.length > 0 ? `Req: ${subj.prerequisiteCodes.join(', ')}` : ''}
                                </span>
                                <Badge colorScheme={statusColor}>{statusLabel}</Badge>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </>
          )}
        </>
      )}
    </div>
  );
};
