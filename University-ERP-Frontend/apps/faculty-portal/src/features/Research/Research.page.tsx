import { useQuery } from '@tanstack/react-query';
import { researchApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const ResearchPage: React.FC = () => {
    const { user } = useAuth();
    const { data: portfolio, isLoading } = useQuery({
        queryKey: ['researchPortfolio', user?.id],
        queryFn: () => researchApi.getPortfolio(user!.id),
        enabled: !!user?.id
    });

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="Research & Grants" subtitle="Track your active publications and funding." />
            <div className="grid-2 fade-in-delay-1">
                <Card>
                    <div className="card-accent-top" />
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Active Grants</h3>
                    {/* Map through portfolio.grants... */}
                    <div className="data-row">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="data-value">NSF AI Research Grant</span>
                            <span className="data-label">$150,000 • Ends Dec 2026</span>
                        </div>
                        <Badge colorScheme="success">Active</Badge>
                    </div>
                </Card>
            </div>
        </div>
    );
};