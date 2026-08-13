import { useQuery } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
    const { identity } = useAuth();
    const navigate = useNavigate();

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['pendingApplications'],
        queryFn: () => admissionsApi.getPendingApplications()
    });

    const metrics = useMemo(() => {
        const total = applications.length;
        const underReview = applications.filter((a: any) => ['UnderReview', 'UnderAcademicEvaluation', 'ChairpersonQueue', 'DocumentVerification'].includes(a.status)).length;
        const missingDocs = applications.filter((a: any) => a.documents?.some((d: any) => d.status !== 'Verified' && d.status !== 'Uploaded')).length;
        const accepted = applications.filter((a: any) => a.status === 'Accepted' || a.status === 'Enrolled').length;
        const acceptanceRate = total > 0 ? (accepted / total * 100).toFixed(1) : '0.0';
        return { total, underReview, missingDocs, acceptanceRate };
    }, [applications]);

    const recentSubmissions = applications.slice(0, 5);

    return (
        <div className="fade-in">
            <PageHeader
                title={`Welcome, ${identity?.name?.split(' ')[0] || 'Admissions Officer'}`}
                subtitle="Track admissions metrics and pending application tasks for the upcoming semester."
            />

            {/* Premium Stats Grid */}
            <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
                    <span className="stat-label">Pending Queue</span>
                    <span className="stat-value">{isLoading ? '...' : metrics.total}</span>
                    <span className="stat-trend">Applications to process</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--warning-text)' }} />
                    <span className="stat-label">Under Review</span>
                    <span className="stat-value" style={{ color: 'var(--warning-text)' }}>{isLoading ? '...' : metrics.underReview}</span>
                    <span className="stat-trend">Awaiting decisions</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--info-text)' }} />
                    <span className="stat-label">Acceptance Rate</span>
                    <span className="stat-value">{isLoading ? '...' : `${metrics.acceptanceRate}%`}</span>
                    <span className="stat-trend" style={{ color: 'var(--info-text)' }}>Highly competitive</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--success-text)' }} />
                    <span className="stat-label">Enrollment Yield</span>
                    <span className="stat-value">64.2%</span>
                    <span className="stat-trend">↑ 2.1% from target</span>
                </Card>
            </div>

            <div className="grid-2 fade-in-delay-2">
                {/* Recent Applications List */}
                <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
                    <h2 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>Recent Submissions</h2>
                    
                    {isLoading ? (
                        <div style={{ color: 'var(--text-muted)' }}>Loading submissions...</div>
                    ) : recentSubmissions.length === 0 ? (
                        <div style={{ color: 'var(--text-muted)' }}>No recent submissions found.</div>
                    ) : (
                        recentSubmissions.map((app: any) => (
                            <div key={app.id} className="data-row" style={{ cursor: 'pointer' }} onClick={() => navigate(`/applications/${app.id}`)}>
                                <div>
                                    <div className="data-value" style={{ textAlign: 'left' }}>{app.applicantName}</div>
                                    <div className="data-label">{app.program}</div>
                                </div>
                                <Badge colorScheme={app.status === 'Accepted' || app.status === 'Enrolled' ? 'success' : app.status === 'Rejected' ? 'danger' : 'warning'}>
                                    {app.status}
                                </Badge>
                            </div>
                        ))
                    )}
                </Card>

                {/* Admission Funnel or Quick Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    
                    <Card style={{ background: 'var(--brand-gradient-soft)' }}>
                        <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-bright)' }}>Action Required</h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            There are {isLoading ? '...' : metrics.missingDocs} applications missing required prerequisite documents.
                        </p>
                        <Button style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/applications?tab=attention')}>
                            Review Missing Documents
                        </Button>
                    </Card>

                    <Card>
                        <div className="card-accent-top" style={{ background: 'var(--brand-secondary)' }} />
                        <h2 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Regional Distribution</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                    <span>North America</span>
                                    <span style={{ fontWeight: 600 }}>65%</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'var(--bg-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: '65%', height: '100%', background: 'var(--brand-primary)' }}></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                    <span>Asia Pacific</span>
                                    <span style={{ fontWeight: 600 }}>20%</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'var(--bg-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: '20%', height: '100%', background: 'var(--brand-secondary)' }}></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                    <span>Europe</span>
                                    <span style={{ fontWeight: 600 }}>10%</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'var(--bg-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: '10%', height: '100%', background: 'var(--brand-tertiary)' }}></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
