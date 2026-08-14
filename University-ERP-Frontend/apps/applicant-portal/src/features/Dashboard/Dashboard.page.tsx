import React from 'react';
import { Badge, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { useApplicantDashboard } from './Dashboard.hooks';

export const DashboardPage: React.FC = () => {
    // 1. Fetch dynamic data from the backend
    const { data: journey, isLoading, isError } = useApplicantDashboard();

    if (isLoading) return <div className="skeleton" style={{ height: '600px' }} />;
    if (isError || !journey) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Dashboard Unavailable</div>
                <div className="stub-subtitle">Failed to load your live application journey.</div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <PageHeader 
                title={`Welcome, ${journey.applicantName}`} 
                subtitle="Track your university admission journey in real-time." 
            />

            <div className="grid-2 fade-in-delay-1">
                {/* Dynamic Application Status */}
                <Card>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Application Status</h3>
                    <div className="data-row">
                        <span className="data-label">Current Stage</span>
                        <span className="data-value" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--brand-primary)' }}>
                            Stage {journey.currentStage} of 4
                        </span>
                    </div>
                    <div className="data-row">
                        <span className="data-label">Fee Status</span>
                        <span className="data-value">
                            <Badge colorScheme={journey.applicationFeeStatus === 'Paid' ? 'success' : 'warning'}>
                                {journey.applicationFeeStatus}
                            </Badge>
                        </span>
                    </div>
                </Card>

                {/* Dynamic Document Requirements */}
                <Card>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Required Documents</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {journey.documents.map((doc: any) => (
                            <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{doc.name}</span>
                                <Badge colorScheme={
                                    doc.status === 'Verified' ? 'success' : 
                                    doc.status === 'Uploaded' ? 'info' : 'danger'
                                }>
                                    {doc.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Dynamic Timeline Events */}
            <h3 style={{ marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)' }}>Journey Timeline</h3>
            <Card className="fade-in-delay-2">
                <Table>
                    <thead>
                        <tr>
                            <th>Date / Time</th>
                            <th>Milestone</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {journey.timeline.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No activity recorded yet.
                                </td>
                            </tr>
                        ) : (
                            journey.timeline.map((event: any, idx: number) => (
                                <tr key={idx}>
                                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{event.date}</td>
                                    <td style={{ fontWeight: 'bold' }}>{event.event}</td>
                                    <td>{event.detail}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};