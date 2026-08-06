import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import { useQuery } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients/student-lifecycle/admissionsApi';
import React, { useMemo } from 'react';

export const AdmissionQueuePage: React.FC = () => {
    const { data: applications = [], isLoading, error } = useQuery({
        queryKey: ['pendingApplications'],
        queryFn: () => admissionsApi.getPendingApplications()
    });

    const groupedApps = useMemo(() => {
        const groups: Record<string, any[]> = {
            Inbox: [],
            Review: [],
            Exam: [],
            Decision: []
        };
        
        applications.forEach((app: any) => {
            if (app.stage === 'Pending Intake' || app.stage === 'SecretaryQueue') {
                groups.Inbox.push(app);
            } else if (app.stage === 'DeanEndorsement' || app.stage === 'ChairpersonQueue') {
                groups.Review.push(app);
            } else if (app.stage === 'ExamScheduled') {
                groups.Exam.push(app);
            } else {
                groups.Decision.push(app);
            }
        });
        return groups;
    }, [applications]);
    return (
        <div className="fade-in">
            <PageHeader
                title="Application Queue"
                subtitle="Real-time pipeline of admissions processing."
            />

            <div style={{ display: 'flex', gap: 'var(--space-6)', overflowX: 'auto', paddingBottom: 'var(--space-4)' }}>
                {/* Column 1: Intake */}
                <div style={{ minWidth: '320px', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>INBOX</h3>
                        <Badge colorScheme="info">{groupedApps.Inbox.length}</Badge>
                    </div>
                    {isLoading && <div style={{ color: 'var(--text-muted)' }}>Loading...</div>}
                    {groupedApps.Inbox.map((app, idx) => (
                        <Card key={idx} style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => alert(`Opening details for ${app.name}`)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 600 }}>{app.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(app.submittedAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{app.program || app.department || 'N/A'}</div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Badge colorScheme="warning">{app.stage || 'Pending'}</Badge>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Column 2: In Review */}
                <div style={{ minWidth: '320px', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>IN REVIEW</h3>
                        <Badge colorScheme="warning">{groupedApps.Review.length}</Badge>
                    </div>
                    {isLoading && <div style={{ color: 'var(--text-muted)' }}>Loading...</div>}
                    {groupedApps.Review.map((app, idx) => (
                        <Card key={idx} style={{ padding: '1rem', borderLeft: '4px solid var(--warning-text)', cursor: 'pointer' }} onClick={() => alert(`Opening details for ${app.name}`)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 600 }}>{app.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(app.submittedAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{app.program || app.department || 'N/A'}</div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Badge colorScheme="info">{app.stage}</Badge>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Column 3: Exam Scheduled */}
                <div style={{ minWidth: '320px', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>PENDING EXAM</h3>
                        <Badge colorScheme="info">{groupedApps.Exam.length}</Badge>
                    </div>
                    {isLoading && <div style={{ color: 'var(--text-muted)' }}>Loading...</div>}
                    {groupedApps.Exam.map((app, idx) => (
                        <Card key={idx} style={{ padding: '1rem', borderLeft: '4px solid var(--info-text)', cursor: 'pointer' }} onClick={() => alert(`Opening details for ${app.name}`)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 600 }}>{app.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(app.submittedAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{app.program || app.department || 'N/A'}</div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Badge colorScheme="warning">{app.stage}</Badge>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Column 4: Final Decision */}
                <div style={{ minWidth: '320px', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>COMMITTEE DECISION</h3>
                        <Badge colorScheme="success">{groupedApps.Decision.length}</Badge>
                    </div>
                    {isLoading && <div style={{ color: 'var(--text-muted)' }}>Loading...</div>}
                    {groupedApps.Decision.map((app, idx) => (
                        <Card key={idx} style={{ padding: '1rem', borderLeft: '4px solid var(--success-text)', cursor: 'pointer' }} onClick={() => alert(`Opening details for ${app.name}`)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 600 }}>{app.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(app.submittedAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{app.program || app.department || 'N/A'}</div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Badge colorScheme="success">{app.stage}</Badge>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
