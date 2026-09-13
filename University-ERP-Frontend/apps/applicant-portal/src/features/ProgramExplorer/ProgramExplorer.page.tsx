import { Badge, Button, Card, EmptyState, Modal, PageHeader, Table } from '@university-erp/ui-kit';
import { ProgramOfferingDto } from '@university-erp/api-clients';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgramCatalog, useProgramCurriculum } from './ProgramExplorer.hooks';

const SEMESTER_LABEL: Record<string, string> = {
  First: '1st Semester',
  Second: '2nd Semester',
  Summer: 'Summer Term',
};

const TYPE_COLOR: Record<string, 'info' | 'success' | 'warning' | 'default'> = {
  Core: 'info',
  GE: 'success',
  PE: 'default',
  NSTP: 'default',
  Professional: 'warning',
  Elective: 'default',
};

export const ProgramExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: programs, isLoading } = useProgramCatalog();

  // The program whose modal is open — identified by its code (e.g., "BSCS")
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<ProgramOfferingDto | null>(null);
  const [expandedYear, setExpandedYear] = useState<number | null>(1);

  // Lazy-load curriculum only when modal is open
  const { data: curriculum, isLoading: isCurriculumLoading } = useProgramCurriculum(selectedProgramId);

  const openCurriculumModal = (program: ProgramOfferingDto) => {
    setSelectedProgram(program);
    // The program.id in admissions is the program code ("BSCS", "BSA", "BSIT")
    setSelectedProgramId(program.id);
    setExpandedYear(1);
  };

  const closeModal = () => {
    setSelectedProgram(null);
    setSelectedProgramId(null);
  };

  if (isLoading) return <div className="skeleton" data-testid="loading-skeleton" />;

  return (
    <div className="fade-in">
      <PageHeader
        title="Academic Programs"
        subtitle="Explore our degree offerings and prepare your application for the upcoming term."
      />

      <div className="grid-auto fade-in-delay-1">
        {programs?.map((program: ProgramOfferingDto) => {
          const displayName = `${program.degree} in ${program.major}`;
          const status = program.intake ? 'Open' : 'Closed';

          return (
            <Card key={program.id} className="card">
              <div className="card-accent-top" />

              <div className="data-row">
                <span className="data-value">{displayName}</span>
                <Badge colorScheme={status === 'Open' ? 'success' : 'warning'}>
                  {status}
                </Badge>
              </div>

              <div className="data-row">
                <span className="data-label">Program Code</span>
                <span className="data-value">{program.id}</span>
              </div>

              <div className="data-row">
                <span className="data-label">College</span>
                <span className="data-value">{program.college}</span>
              </div>

              <div className="data-row">
                <span className="data-label">Duration</span>
                <span className="data-value">{program.duration}</span>
              </div>

              <div className="data-row" style={{ marginTop: 'var(--space-4)', gap: 'var(--space-2)' }}>
                <Button variant="outline" onClick={() => openCurriculumModal(program)}>
                  View Curriculum
                </Button>
                <Button
                  variant="primary"
                  disabled={status === 'Closed'}
                  onClick={() => navigate(`/wizard?programId=${encodeURIComponent(program.id)}`)}
                >
                  Start Application
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ─── Curriculum Details Modal ─────────────────────────────────────── */}
      {selectedProgram && (
        <Modal isOpen={!!selectedProgram} onClose={closeModal}>
          <div style={{ maxWidth: '720px', width: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                  {curriculum?.programName ?? `${selectedProgram.degree} in ${selectedProgram.major}`}
                </h3>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {selectedProgram.college} &bull; {curriculum?.academicYear ?? 'AY 2024-2025'} &bull;{' '}
                  {curriculum?.totalUnits ?? '—'} units total
                </span>
              </div>
              <Badge colorScheme="info">{curriculum?.status ?? 'Active'}</Badge>
            </div>

            {isCurriculumLoading ? (
              <div className="skeleton" style={{ height: '300px' }} />
            ) : !curriculum ? (
              <EmptyState
                title="Curriculum Not Yet Available"
                description="The curriculum roadmap for this program is being finalized by the Registrar. Please check back later."
              />
            ) : (
              <>
                {/* Year accordion tabs */}
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
                  {curriculum.years.map((y) => (
                    <Button
                      key={y.yearLevel}
                      variant={expandedYear === y.yearLevel ? 'primary' : 'outline'}
                      onClick={() => setExpandedYear(y.yearLevel === expandedYear ? null : y.yearLevel)}
                    >
                      Year {y.yearLevel}
                    </Button>
                  ))}
                </div>

                {/* Active year content */}
                {curriculum.years
                  .filter((y) => expandedYear === null || y.yearLevel === expandedYear)
                  .map((year) => (
                    <div key={year.yearLevel} style={{ marginBottom: 'var(--space-6)' }}>
                      {year.semesters.map((sem) => (
                        <div key={sem.semester} style={{ marginBottom: 'var(--space-4)' }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 'var(--space-2) 0',
                            borderBottom: '2px solid var(--border-subtle)',
                            marginBottom: 'var(--space-3)'
                          }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {SEMESTER_LABEL[sem.semester] ?? sem.semester}
                            </h4>
                            <Badge colorScheme="default">{sem.totalUnits} units</Badge>
                          </div>

                          <Table>
                            <thead>
                              <tr>
                                <th style={{ padding: '8px 6px' }}>Code</th>
                                <th style={{ padding: '8px 6px' }}>Subject Title</th>
                                <th style={{ padding: '8px 6px', textAlign: 'center' }}>Units</th>
                                <th style={{ padding: '8px 6px' }}>Type</th>
                                <th style={{ padding: '8px 6px' }}>Prerequisites</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sem.subjects.map((subj) => (
                                <tr key={subj.subjectId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                  <td style={{ padding: '8px 6px', fontWeight: 600 }}>{subj.code}</td>
                                  <td style={{ padding: '8px 6px' }}>
                                    {subj.title}
                                    {subj.isElective && (
                                      <Badge colorScheme="default" style={{ marginLeft: '6px', fontSize: '0.7rem' }}>
                                        Elective
                                      </Badge>
                                    )}
                                  </td>
                                  <td style={{ padding: '8px 6px', textAlign: 'center' }}>{subj.units}</td>
                                  <td style={{ padding: '8px 6px' }}>
                                    <Badge colorScheme={TYPE_COLOR[subj.subjectType] ?? 'default'}>
                                      {subj.subjectType}
                                    </Badge>
                                  </td>
                                  <td style={{ padding: '8px 6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {subj.prerequisiteCodes.length > 0
                                      ? subj.prerequisiteCodes.join(', ')
                                      : '—'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      ))}
                    </div>
                  ))}
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const progId = selectedProgram.id;
                  closeModal();
                  navigate(`/wizard?programId=${encodeURIComponent(progId)}`);
                }}
              >
                Apply for this Program
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};