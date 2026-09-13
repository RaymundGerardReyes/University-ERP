import React, { useState } from 'react';
import { Badge, Button, Card, EmptyState, PageHeader, Table } from '@university-erp/ui-kit';
import { useAllPrograms, useProgramCurriculum, useSubjectCatalog } from './Curriculum.hooks';
import type { AcademicProgramDto } from '@university-erp/api-clients';

const SEMESTER_LABEL: Record<string, string> = {
  First: '1st Semester',
  Second: '2nd Semester',
  Summer: 'Summer Term',
};

type ActiveTab = 'programs' | 'catalog';

export const CurriculumDivisionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('programs');
  const [selectedProgram, setSelectedProgram] = useState<AcademicProgramDto | null>(null);
  const [expandedYear, setExpandedYear] = useState<number>(1);

  const { data: programs, isLoading: programsLoading } = useAllPrograms();
  const { data: curriculum, isLoading: curriculumLoading } = useProgramCurriculum(
    selectedProgram?.code ?? null
  );
  const { data: catalog, isLoading: catalogLoading } = useSubjectCatalog();

  return (
    <div className="fade-in">
      <PageHeader
        title="Curriculum Management"
        subtitle="Manage academic programs, versioned curricula, subject placement, and prerequisite rules."
      />

      {/* ─── Tab Navigation ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', borderBottom: '2px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
        <Button
          variant={activeTab === 'programs' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('programs')}
        >
          📚 Academic Programs
        </Button>
        <Button
          variant={activeTab === 'catalog' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('catalog')}
        >
          📋 Subject Catalog
        </Button>
      </div>

      {/* ─── Programs Panel ────────────────────────────────────────────────── */}
      {activeTab === 'programs' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedProgram ? '280px 1fr' : '1fr', gap: 'var(--space-6)' }}>
          {/* Program list */}
          <div>
            <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '1rem', fontWeight: 600 }}>Programs</h3>
            {programsLoading ? (
              <div className="skeleton" style={{ height: '200px' }} />
            ) : !programs?.length ? (
              <EmptyState title="No Programs Found" description="No academic programs have been configured yet." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {programs.map((p) => (
                  <Card
                    key={p.programId}
                    style={{
                      cursor: 'pointer',
                      border: selectedProgram?.code === p.code
                        ? '2px solid var(--brand-primary)'
                        : '1px solid var(--border-subtle)',
                    }}
                    onClick={() => {
                      setSelectedProgram(p);
                      setExpandedYear(1);
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.code}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{p.name}</div>
                      </div>
                      <Badge colorScheme={p.isActive ? 'success' : 'default'}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div style={{ marginTop: 'var(--space-2)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {p.college} &bull; {p.totalUnits} units &bull; {p.yearsToComplete} years
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Curriculum detail panel */}
          {selectedProgram && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedProgram.name}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {curriculum ? `AY ${curriculum.academicYear} — v${curriculum.version} — ${curriculum.totalUnits} total units` : selectedProgram.college}
                  </span>
                </div>
                <Button variant="outline" onClick={() => setSelectedProgram(null)}>
                  ✕ Close
                </Button>
              </div>

              {curriculumLoading ? (
                <div className="skeleton" style={{ height: '400px' }} />
              ) : !curriculum ? (
                <EmptyState
                  title="Curriculum Not Yet Configured"
                  description="No active curriculum plan exists for this program. Create one via the Curriculum Planning module."
                />
              ) : (
                <>
                  {/* Year tabs */}
                  <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
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
                    .filter((y) => y.yearLevel === expandedYear)
                    .map((year) => (
                      <div key={year.yearLevel}>
                        {year.semesters.map((sem) => {
                          const semesterUnits = sem.totalUnits;
                          return (
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
                                <Badge colorScheme="info">{semesterUnits} units</Badge>
                              </div>

                              <Table>
                                <thead>
                                  <tr>
                                    <th style={{ padding: '8px 6px' }}>Code</th>
                                    <th style={{ padding: '8px 6px' }}>Subject Title</th>
                                    <th style={{ padding: '8px 6px', textAlign: 'center' }}>Units</th>
                                    <th style={{ padding: '8px 6px' }}>Type</th>
                                    <th style={{ padding: '8px 6px' }}>Prerequisites</th>
                                    <th style={{ padding: '8px 6px' }}>Elective</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sem.subjects.map((subj) => (
                                    <tr key={subj.subjectId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                      <td style={{ padding: '8px 6px', fontWeight: 700, color: 'var(--brand-primary)' }}>
                                        {subj.code}
                                      </td>
                                      <td style={{ padding: '8px 6px' }}>{subj.title}</td>
                                      <td style={{ padding: '8px 6px', textAlign: 'center' }}>{subj.units}</td>
                                      <td style={{ padding: '8px 6px' }}>
                                        <Badge colorScheme="default">{subj.subjectType}</Badge>
                                      </td>
                                      <td style={{ padding: '8px 6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {subj.prerequisiteCodes.length > 0
                                          ? subj.prerequisiteCodes.join(', ')
                                          : '—'}
                                      </td>
                                      <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                                        {subj.isElective ? (
                                          <Badge colorScheme="warning">Yes</Badge>
                                        ) : (
                                          <span style={{ color: 'var(--text-secondary)' }}>—</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── Subject Catalog Panel ─────────────────────────────────────────── */}
      {activeTab === 'catalog' && (
        <div>
          <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '1rem', fontWeight: 600 }}>
            Subject Catalog ({catalog?.length ?? 0} subjects)
          </h3>
          {catalogLoading ? (
            <div className="skeleton" style={{ height: '400px' }} />
          ) : !catalog?.length ? (
            <EmptyState title="No Subjects Found" description="The subject catalog is empty." />
          ) : (
            <Table>
              <thead>
                <tr>
                  <th style={{ padding: '10px 8px' }}>Code</th>
                  <th style={{ padding: '10px 8px' }}>Subject Title</th>
                  <th style={{ padding: '10px 8px' }}>Department</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center' }}>Units</th>
                  <th style={{ padding: '10px 8px' }}>Status / Type</th>
                  <th style={{ padding: '10px 8px' }}>Prerequisites</th>
                </tr>
              </thead>
              <tbody>
                {catalog.map((course) => (
                  <tr key={course.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px', fontWeight: 700, color: 'var(--brand-primary)' }}>{course.code}</td>
                    <td style={{ padding: '8px' }}>{course.title}</td>
                    <td style={{ padding: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{course.department}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{course.units}</td>
                    <td style={{ padding: '8px' }}>
                      <Badge colorScheme={course.status === 'Active' || course.status === 'Core' ? 'success' : 'default'}>
                        {course.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {course.prerequisites?.length
                        ? course.prerequisites.map((p) => p.requiredCourseCode).join(', ')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
};

