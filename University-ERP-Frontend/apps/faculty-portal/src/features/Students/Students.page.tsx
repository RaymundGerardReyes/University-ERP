import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useFacultyStudents } from './Students.hooks';

export const StudentsPage: React.FC = () => {
    const { data: students, isLoading, isError } = useFacultyStudents();

    if (isLoading) return <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--radius-lg)' }} />;
    if (isError || !students) return (
        <div className="stub-page fade-in">
            <div className="stub-icon">👥</div>
            <div className="stub-title">Failed to load student roster.</div>
            <div className="stub-subtitle">Unable to fetch assigned students from the Academic module.</div>
        </div>
    );

    return (
        <div className="fade-in">
            <PageHeader
                title="Student Roster"
                subtitle="Monitor academic performance, attendance, and risk indicators across your sections."
            />

            <div className="grid-auto fade-in-delay-1">
                {students.map((student, idx) => {
                    let riskColor: 'success' | 'warning' | 'danger' | 'default' = 'default';
                    if (student.riskIndicator === 'Low') riskColor = 'success';
                    if (student.riskIndicator === 'Medium') riskColor = 'warning';
                    if (student.riskIndicator === 'High') riskColor = 'danger';

                    return (
                        <Card key={student.studentId} className={`fade-in-delay-${(idx % 3) + 1}`} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="card-accent-top" style={{ background: riskColor === 'danger' ? 'var(--danger-text)' : 'var(--brand-gradient)' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {student.studentId}
                                </span>
                                <Badge colorScheme={riskColor}>{student.riskIndicator} Risk</Badge>
                            </div>

                            <h3 style={{ color: 'var(--text-bright)', margin: '0 0 var(--space-1) 0', fontSize: '1.25rem' }}>
                                {student.name}
                            </h3>
                            <p style={{ color: 'var(--brand-primary)', margin: '0 0 var(--space-4) 0', fontSize: '0.9rem', fontWeight: 600 }}>
                                {student.program}
                            </p>

                            <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-4)', flex: 1 }}>
                                <div className="data-row">
                                    <span className="data-label">Attendance Rate</span>
                                    <span className="data-value" style={{ color: student.attendanceRate < 80 ? 'var(--danger-text)' : 'var(--success-text)' }}>
                                        {student.attendanceRate}%
                                    </span>
                                </div>
                                {student.lastBehaviorNote && (
                                    <div className="data-row" style={{ borderBottom: 'none', paddingBottom: 0, flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-1)' }}>
                                        <span className="data-label">Latest Note</span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                                            "{student.lastBehaviorNote}"
                                        </span>
                                    </div>
                                )}
                            </div>

                            <Button variant="outline" style={{ width: '100%' }}>View Full Profile</Button>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};