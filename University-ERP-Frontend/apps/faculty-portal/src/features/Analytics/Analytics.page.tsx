import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const AnalyticsPage: React.FC = () => {
    const { user } = useAuth();
    const { data: analytics, isLoading } = useQuery({
        queryKey: ['classPerformance', user?.id],
        queryFn: () => analyticsApi.getClassPerformance(user!.id),
        enabled: !!user?.id
    });

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="Academic Analytics" subtitle="Identify at-risk students and class trends." />
            <div className="grid-2 fade-in-delay-1">
                {analytics?.map((metric) => (
                    <Card key={metric.courseCode}>
                        <div className="card-accent-top" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{metric.courseCode} Overview</h3>
                            <Badge colorScheme={metric.passRate > 80 ? 'success' : 'warning'}>
                                {metric.passRate}% Pass
                            </Badge>
                        </div>

                        <div className="grid-stats">
                            <div className="stat-card" style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                                <span className="stat-label">Average Grade</span>
                                <span className="stat-value">{metric.averageGrade.toFixed(1)}</span>
                            </div>

                            <div className="stat-card" style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                                <span className="stat-label">At-Risk Students</span>
                                <span className="stat-value" style={{ color: metric.atRiskCount > 0 ? 'var(--danger-text)' : 'var(--success-text)' }}>
                                    {metric.atRiskCount}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};