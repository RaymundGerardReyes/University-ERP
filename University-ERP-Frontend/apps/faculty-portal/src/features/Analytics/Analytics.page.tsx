import { Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useClassPerformance } from './Analytics.hooks';

export const AnalyticsPage: React.FC = () => {
    const { data: performance, isLoading } = useClassPerformance();

    if (isLoading) return <div className="skeleton fade-in" style={{ height: '500px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="Analytics & Insights" subtitle="Data-driven insights into class performance and student success." />
            <div className="grid-2 fade-in-delay-1">
                {performance?.map(metrics => (
                    <Card key={metrics.courseCode} style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: '0 0 var(--space-6) 0', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
                            {metrics.courseCode} Performance
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                            <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>Average Grade</div>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{metrics.averageGrade}%</div>
                            </div>
                            <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>Pass Rate</div>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success-text)' }}>{metrics.passRate}%</div>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, color: 'var(--danger-text)' }}>Students At Risk</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--danger-text)' }}>{metrics.atRiskCount}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};