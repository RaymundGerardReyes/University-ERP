import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useFacultyStudents } from './Students.hooks';

export const StudentsDashboardPage: React.FC = () => {
    const { data: students, isLoading } = useFacultyStudents();

    if (isLoading) return <div className="skeleton fade-in" style={{ height: '500px' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="My Students & Advising"
                subtitle="Monitor academic performance, attendance, and risk indicators."
            />

            <div className="grid-auto fade-in-delay-1">
                {students?.map(student => (
                    <Card key={student.studentId} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="card-accent-top" style={{ background: student.riskIndicator === 'High' ? 'var(--danger-text)' : 'var(--brand-gradient)' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                            <Badge colorScheme="info">{student.program}</Badge>
                            <Badge colorScheme={student.riskIndicator === 'High' ? 'danger' : student.riskIndicator === 'Medium' ? 'warning' : 'success'}>
                                {student.riskIndicator} Risk
                            </Badge>
                        </div>

                        <h3 style={{ margin: '0 0 var(--space-1) 0', fontSize: '1.25rem', color: 'var(--text-primary)' }}>{student.name}</h3>
                        <p style={{ margin: '0 0 var(--space-4) 0', color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'monospace' }}>{student.studentId}</p>

                        <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
                            <div className="data-row">
                                <span className="data-label">Attendance Rate</span>
                                <span className="data-value" style={{ color: student.attendanceRate < 80 ? 'var(--danger-text)' : 'var(--success-text)' }}>
                                    {student.attendanceRate}%
                                </span>
                            </div>
                            {student.lastBehaviorNote && (
                                <div className="data-row" style={{ borderBottom: 'none', paddingBottom: 0, flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                                    <span className="data-label">Last Advising Note</span>
                                    <span className="data-value" style={{ textAlign: 'left', fontWeight: 400, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                        "{student.lastBehaviorNote}"
                                    </span>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--space-3)' }}>
                            <Button variant="outline" style={{ flex: 1 }}>Full Profile</Button>
                            <Button variant="primary" style={{ flex: 1 }}>Log Note</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};