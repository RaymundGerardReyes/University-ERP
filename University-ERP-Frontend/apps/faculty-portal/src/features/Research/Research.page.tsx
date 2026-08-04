import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useResearchPortfolio } from './Research.hooks';

export const ResearchPage: React.FC = () => {
    const { data: portfolio, isLoading } = useResearchPortfolio();

    if (isLoading) return <div className="skeleton fade-in" style={{ height: '500px' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="Research & Publications"
                subtitle="Track your active grants, publications, and academic portfolio."
                action={<Button variant="primary">Log New Publication</Button>}
            />

            <div className="grid-2 fade-in-delay-1">
                {/* Active Grants */}
                <Card style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Funding & Grants</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {portfolio?.grants.map((grant: any) => (
                            <div key={grant.id} style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                    <Badge colorScheme={grant.status === 'Active' ? 'success' : 'warning'}>{grant.status}</Badge>
                                    <span style={{ fontWeight: 700, color: 'var(--success-text)' }}>${grant.amount.toLocaleString()}</span>
                                </div>
                                <h4 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{grant.title}</h4>
                                <p style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Agency: {grant.fundingAgency}</p>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ends: {new Date(grant.endDate).toLocaleDateString()}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Publications */}
                <Card style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Recent Publications</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {portfolio?.publications.map((pub: any) => (
                            <div key={pub.id} style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                    <Badge colorScheme={pub.status === 'Published' ? 'success' : 'info'}>{pub.status}</Badge>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pub.id}</span>
                                </div>
                                <h4 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{pub.title}</h4>
                                <p style={{ margin: '0 0 var(--space-2) 0', color: 'var(--brand-primary)', fontWeight: 500, fontSize: '0.85rem' }}>{pub.journal}</p>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date: {new Date(pub.publishDate).toLocaleDateString()}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};