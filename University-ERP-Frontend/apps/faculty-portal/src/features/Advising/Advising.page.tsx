import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useAdvisees } from './Advising.hooks';

export const AdvisingPage: React.FC = () => {
    const { data: advisees, isLoading } = useAdvisees();

    if (isLoading) return <div className="skeleton fade-in" style={{ height: '500px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="Academic Advising" subtitle="Track degree progress and graduation readiness for your assigned advisees." />
            <div className="grid-auto fade-in-delay-1">
                {advisees?.map(student => (
                    <Card key={student.studentId} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="card-accent-top" style={{ background: student.status === 'At Risk' ? 'var(--danger-text)' : 'var(--brand-primary)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                            <Badge colorScheme={student.status === 'On Track' ? 'success' : student.status === 'At Risk' ? 'danger' : 'warning'}>{student.status}</Badge>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{student.studentId}</span>
                        </div>
                        <h3 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--text-primary)' }}>{student.name}</h3>
                        <p style={{ margin: '0 0 var(--space-4) 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Program: {student.program}</p>

                        <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Degree Progress</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{student.degreeProgress}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'var(--bg-base)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${student.degreeProgress}%`, background: 'var(--brand-gradient)', transition: 'width 1s ease' }} />
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--space-3)' }}>
                            <Button variant="outline" style={{ flex: 1 }}>Degree Audit</Button>
                            <Button variant="primary" style={{ flex: 1 }}>Schedule Sync</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};