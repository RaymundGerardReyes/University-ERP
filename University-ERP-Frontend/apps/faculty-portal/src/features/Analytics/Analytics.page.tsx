import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useClassAnalytics } from './Analytics.hooks';

export const AnalyticsPage: React.FC = () => {
    const { data: analytics, isLoading, isError } = useClassAnalytics();

    if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;
    if (isError || !analytics) return <div className="stub-page fade-in"><div className="stub-title">Analytics Unavailable</div></div>;

    const totalAtRisk = analytics.reduce((acc, curr) => acc + curr.atRiskCount, 0);
    const avgPassRate = analytics.reduce((acc, curr) => acc + curr.passRate, 0) / (analytics.length || 1);

    return (
        <div className="fade-in">
            <PageHeader
                title="Performance Analytics"
                subtitle="Review aggregate grade metrics, pass rates, and at-risk student data."
                action={<Button variant="outline">Export Report</Button>}
            />

            <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--info-text)' }} />
                    <span className="stat-label">Avg Pass Rate</span>
                    <span className="stat-value" style={{ color: 'var(--info-text)' }}>{avgPassRate.toFixed(1)}%</span>
                    <span className="stat-trend">Across all sections</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: totalAtRisk > 0 ? 'var(--warning-text)' : 'var(--success-text)' }} />
                    <span className="stat-label">Total At Risk</span>
                    <span className="stat-value" style={{ color: totalAtRisk > 0 ? 'var(--warning-text)' : 'var(--success-text)' }}>
                        {totalAtRisk}
                    </span>
                    <span className="stat-trend">Requires Intervention</span>
                </Card>
            </div>

            <div className="grid-2 fade-in-delay-2">
                {analytics.map((course) => (
                    <Card key={course.courseCode}>
                        <div className="card-accent-top" style={{ background: 'var(--brand-secondary)' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-bright)', margin: 0 }}>{course.courseCode}</h2>
                            <Badge colorScheme={course.passRate >= 80 ? 'success' : 'warning'}>
                                {course.passRate}% Pass Rate
                            </Badge>
                        </div>

                        <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '0 var(--space-4)', border: '1px solid var(--border-subtle)' }}>
                            <div className="data-row">
                                <span className="data-label">Average Grade</span>
                                <span className="data-value" style={{ color: 'var(--brand-primary)', fontSize: '1.1rem' }}>{course.averageGrade.toFixed(1)}</span>
                            </div>
                            <div className="data-row" style={{ borderBottom: 'none' }}>
                                <span className="data-label">At-Risk Students</span>
                                <span className="data-value" style={{ color: course.atRiskCount > 0 ? 'var(--danger-text)' : 'var(--success-text)' }}>
                                    {course.atRiskCount} Students
                                </span>
                            </div>
                        </div>

                        <Button variant="secondary" style={{ width: '100%', marginTop: 'var(--space-4)' }}>
                            View Deep Dive
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};