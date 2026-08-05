import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useAdvisees } from './Advising.hooks';

export const AdvisingPage: React.FC = () => {
    const { data: advisees, isLoading, isError } = useAdvisees();

    if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;
    if (isError || !advisees) return <div className="stub-page fade-in"><div className="stub-title">Advising Data Unavailable</div></div>;

    const atRiskCount = advisees.filter(a => a.status === 'At Risk' || a.status === 'Action Required').length;

    return (
        <div className="fade-in">
            <PageHeader
                title="Academic Advising"
                subtitle="Monitor student progression, degree paths, and risk indicators."
            />

            <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
                    <span className="stat-label">Total Advisees</span>
                    <span className="stat-value">{advisees.length}</span>
                    <span className="stat-trend">Currently Enrolled</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: atRiskCount > 0 ? 'var(--danger-text)' : 'var(--success-text)' }} />
                    <span className="stat-label">Students at Risk</span>
                    <span className="stat-value" style={{ color: atRiskCount > 0 ? 'var(--danger-text)' : 'var(--success-text)' }}>
                        {atRiskCount}
                    </span>
                    <span className="stat-trend">Require Consultation</span>
                </Card>
            </div>

            <div className="grid-auto fade-in-delay-2">
                {advisees.map((advisee) => {
                    let badgeColor: 'success' | 'warning' | 'danger' = 'success';
                    if (advisee.status === 'At Risk') badgeColor = 'warning';
                    if (advisee.status === 'Action Required') badgeColor = 'danger';

                    return (
                        <Card key={advisee.studentId} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="card-accent-top" style={{ background: `var(--${badgeColor}-text)` }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                                <span className="data-label" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{advisee.studentId}</span>
                                <Badge colorScheme={badgeColor}>{advisee.status}</Badge>
                            </div>

                            <h3 className="data-value" style={{ textAlign: 'left', fontSize: '1.15rem', marginBottom: 'var(--space-1)' }}>{advisee.name}</h3>
                            <p className="data-label" style={{ color: 'var(--brand-primary)', marginBottom: 'var(--space-4)' }}>{advisee.program}</p>

                            <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-6)' }}>
                                <div className="data-row" style={{ padding: 0, borderBottom: 'none' }}>
                                    <span className="data-label">Degree Progress</span>
                                    <span className="data-value" style={{ color: 'var(--text-bright)' }}>{advisee.degreeProgress}%</span>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--space-3)' }}>
                                <Button variant="primary" style={{ flex: 1 }}>Message</Button>
                                <Button variant="outline" style={{ flex: 1 }}>View Transcript</Button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};