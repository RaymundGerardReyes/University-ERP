import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@university-erp/api-clients';
import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const AdmissionsReportsPage: React.FC = () => {
    const { data: report, isLoading } = useQuery({
        queryKey: ['admissionsReport'],
        queryFn: () => analyticsApi.getAdmissionsReport()
    });

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
                <PageHeader
                    title="Admissions Analytics & Reports"
                    subtitle="Track application velocity, demographic distribution, and yield rates."
                />
                <Button>Export PDF Report</Button>
            </div>

            <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
                <Card style={{ flex: 1, padding: '1.5rem', borderLeft: '4px solid var(--info-text)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>TOTAL APPLICATIONS YTD</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{isLoading ? '...' : report?.totalApplications || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--success-text)', marginTop: '0.5rem' }}>↑ 12% vs last year</div>
                </Card>
                <Card style={{ flex: 1, padding: '1.5rem', borderLeft: '4px solid var(--brand-primary)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>CONVERSION RATE</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{isLoading ? '...' : report?.conversionRate || '0%'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--success-text)', marginTop: '0.5rem' }}>↑ 2.4% vs last year</div>
                </Card>
                <Card style={{ flex: 1, padding: '1.5rem', borderLeft: '4px solid var(--warning-text)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>AVG PROCESSING TIME</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{isLoading ? '...' : report?.avgProcessingDays || 0} Days</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--danger-text)', marginTop: '0.5rem' }}>↓ 1.2 days slower</div>
                </Card>
            </div>

            <div className="grid-2">
                <Card>
                    <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-6)' }}>Application Volume by College</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '60%' }}>
                        {isLoading ? <div>Loading funnel...</div> : 
                         !report?.funnel ? <div style={{ color: 'var(--text-muted)' }}>No data available.</div> :
                         report.funnel.map((step: any, idx: number) => {
                             // Dynamic max count for width percentage calculation
                             const maxCount = Math.max(...report.funnel.map((s: any) => s.count));
                             return (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '150px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{step.stage}</div>
                                    <div style={{ flex: 1, background: 'var(--bg-base)', height: '1.5rem', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                        <div style={{ width: `${(step.count / maxCount) * 100}%`, height: '100%', background: step.color || 'var(--brand-primary)', transition: 'width 1s ease-in-out' }} />
                                    </div>
                                    <div style={{ width: '50px', textAlign: 'right', fontWeight: 600 }}>{step.count}</div>
                                </div>
                             );
                        })}
                    </div>
                </Card>

                <Card>
                    <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-6)' }}>Pipeline Funnel</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        {isLoading ? (
                            <div style={{ color: 'var(--text-muted)', padding: '1rem' }}>Loading pipeline...</div>
                        ) : !report?.pipeline ? (
                            <div style={{ color: 'var(--text-muted)', padding: '1rem' }}>No pipeline data available.</div>
                        ) : (
                            report.pipeline.map((stage: any, idx: number) => (
                                <div key={idx} style={{ width: `${stage.percentage || 100}%`, background: stage.color || 'var(--brand-primary)', color: 'white', padding: '0.75rem', textAlign: 'center', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
                                    {stage.name} ({stage.count})
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};
