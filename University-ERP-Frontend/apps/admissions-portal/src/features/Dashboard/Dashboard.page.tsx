import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const DashboardPage: React.FC = () => {
    const { identity } = useAuth();

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
                    <span className="stat-label">Total Applications</span>
                    <span className="stat-value">12,450</span>
                    <span className="stat-trend">↑ 14% vs last year</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--warning-text)' }} />
                    <span className="stat-label">Under Review</span>
                    <span className="stat-value" style={{ color: 'var(--warning-text)' }}>3,124</span>
                    <span className="stat-trend">Avg. wait: 4 days</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--info-text)' }} />
                    <span className="stat-label">Acceptance Rate</span>
                    <span className="stat-value">28.4%</span>
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
                    
                    <div className="data-row">
                        <div>
                            <div className="data-value" style={{ textAlign: 'left' }}>Sarah Jenkins</div>
                            <div className="data-label">B.S. Computer Science</div>
                        </div>
                        <Badge colorScheme="warning">Pending Review</Badge>
                    </div>
                    
                    <div className="data-row">
                        <div>
                            <div className="data-value" style={{ textAlign: 'left' }}>Michael Chang</div>
                            <div className="data-label">B.A. Business Administration</div>
                        </div>
                        <Badge colorScheme="success">Verified</Badge>
                    </div>

                    <div className="data-row">
                        <div>
                            <div className="data-value" style={{ textAlign: 'left' }}>Emily Robertson</div>
                            <div className="data-label">B.S. Nursing</div>
                        </div>
                        <Badge colorScheme="warning">Pending Review</Badge>
                    </div>

                    <div className="data-row">
                        <div>
                            <div className="data-value" style={{ textAlign: 'left' }}>David Kim</div>
                            <div className="data-label">B.S. Mechanical Engineering</div>
                        </div>
                        <Badge colorScheme="info">Exam Scheduled</Badge>
                    </div>
                </Card>

                {/* Admission Funnel or Quick Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    
                    <Card style={{ background: 'var(--brand-gradient-soft)' }}>
                        <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-bright)' }}>Action Required</h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                            There are 42 applications missing required prerequisite documents.
                        </p>
                        <Button style={{ width: '100%', justifyContent: 'center' }} onClick={() => alert('Routing to incomplete applications filter...')}>
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
