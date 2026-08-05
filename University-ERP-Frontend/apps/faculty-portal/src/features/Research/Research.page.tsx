import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useResearchPortfolio } from './Research.hooks';

export const ResearchPage: React.FC = () => {
    const { data, isLoading, isError } = useResearchPortfolio();

    if (isLoading) return <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--radius-lg)' }} />;
    if (isError || !data) return <div className="stub-page fade-in"><div className="stub-title">Portfolio Unavailable</div></div>;

    const activeGrantsTotal = data.grants.filter(g => g.status === 'Active').reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="fade-in">
            <PageHeader
                title="Research & Publications"
                subtitle="Manage active grants, funding proposals, and peer-reviewed publications."
                action={<Button variant="primary">Submit Proposal</Button>}
            />

            <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--success-text)' }} />
                    <span className="stat-label">Active Funding</span>
                    <span className="stat-value" style={{ color: 'var(--success-text)' }}>${activeGrantsTotal.toLocaleString()}</span>
                    <span className="stat-trend">Current fiscal year</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
                    <span className="stat-label">Publications</span>
                    <span className="stat-value">{data.publications.length}</span>
                    <span className="stat-trend" style={{ color: 'var(--text-muted)' }}>Career total</span>
                </Card>
            </div>

            <div className="grid-2 fade-in-delay-2">
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="card-accent-top" style={{ background: 'var(--brand-gradient)' }} />
                    <div style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <h2 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Grant Portfolio</h2>
                    </div>
                    <div style={{ padding: '0 var(--space-6)' }}>
                        {data.grants.map((grant, idx) => (
                            <div key={grant.id} className="data-row" style={{ borderBottom: idx === data.grants.length - 1 ? 'none' : undefined }}>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingRight: 'var(--space-4)' }}>
                                    <span className="data-value" style={{ textAlign: 'left', color: 'var(--text-bright)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{grant.title}</span>
                                    <span className="data-label">{grant.fundingAgency}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                    <Badge colorScheme={grant.status === 'Active' ? 'success' : 'warning'}>{grant.status}</Badge>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>${grant.amount.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="card-accent-top" style={{ background: 'var(--text-secondary)' }} />
                    <div style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <h2 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Publications</h2>
                    </div>
                    <div style={{ padding: '0 var(--space-6)' }}>
                        {data.publications.map((pub, idx) => (
                            <div key={pub.id} className="data-row" style={{ borderBottom: idx === data.publications.length - 1 ? 'none' : undefined }}>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingRight: 'var(--space-4)' }}>
                                    <span className="data-value" style={{ textAlign: 'left', color: 'var(--text-bright)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pub.title}</span>
                                    <span className="data-label" style={{ color: 'var(--brand-primary)' }}>{pub.journal}</span>
                                </div>
                                <Badge colorScheme={pub.status === 'Published' ? 'info' : 'default'}>{pub.status}</Badge>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};