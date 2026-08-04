import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useApproveApplication, usePendingApplications } from './EnrollmentApprovals.hooks';

const DEPARTMENTS = ['All', 'Engineering', 'Education', 'Business'];

export const EnrollmentApprovalsPage: React.FC = () => {
    const [selectedDept, setSelectedDept] = useState('All');

    // For demo purposes, toggle between Secretary and Professor roles
    const [activeRole, setActiveRole] = useState<'Secretary' | 'Professor'>('Secretary');

    const { data: applications, isLoading } = usePendingApplications(selectedDept);
    const { mutateAsync: approveApp, isPending: isApproving } = useApproveApplication();

    const handleAction = async (id: string, action: 'Verify' | 'Approve') => {
        await approveApp({ id, action });
        alert(`Application ${id} successfully ${action === 'Verify' ? 'verified by Secretary' : 'approved by Faculty'}.`);
    };

    if (isLoading) return <div className="skeleton fade-in" style={{ height: '600px' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="Enrollment Approvals"
                subtitle="Review and process incoming student applications."
            />

            {/* Control Panel: Role Toggle & Department Filter */}
            <Card style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }} className="fade-in-delay-1">
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {DEPARTMENTS.map(dept => (
                        <button
                            key={dept}
                            onClick={() => setSelectedDept(dept)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                border: dept === selectedDept ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                                background: dept === selectedDept ? 'var(--info-bg)' : 'transparent',
                                color: dept === selectedDept ? 'var(--text-accent)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {dept}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', background: 'var(--bg-elevated)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>View As:</span>
                    <Button variant={activeRole === 'Secretary' ? 'primary' : 'outline'} onClick={() => setActiveRole('Secretary')} style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Secretary</Button>
                    <Button variant={activeRole === 'Professor' ? 'primary' : 'outline'} onClick={() => setActiveRole('Professor')} style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Professor</Button>
                </div>
            </Card>

            {/* Applications Grid */}
            <div className="grid-auto fade-in-delay-2">
                {applications?.length ? applications.map((app) => {
                    const isPendingSecretary = app.status === 'Pending Secretary Review';
                    const isPendingFaculty = app.status === 'Pending Faculty Approval';

                    return (
                        <Card key={app.id} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="card-accent-top" style={{ background: isPendingSecretary ? 'var(--warning-text)' : 'var(--info-text)' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                                <Badge colorScheme={isPendingSecretary ? 'warning' : 'info'}>{app.status}</Badge>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.id}</span>
                            </div>

                            <h3 style={{ margin: '0 0 var(--space-1) 0', fontSize: '1.25rem', color: 'var(--text-primary)' }}>{app.applicantName}</h3>
                            <p style={{ margin: '0 0 var(--space-4) 0', color: 'var(--brand-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{app.program}</p>

                            <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
                                <div className="data-row">
                                    <span className="data-label">Department</span>
                                    <span className="data-value">{app.department}</span>
                                </div>
                                <div className="data-row">
                                    <span className="data-label">Cumulative GPA</span>
                                    <span className="data-value" style={{ color: app.gpa >= 3.5 ? 'var(--success-text)' : 'var(--text-primary)' }}>{app.gpa.toFixed(2)}</span>
                                </div>
                                <div className="data-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                                    <span className="data-label">Submitted On</span>
                                    <span className="data-value">{new Date(app.submittedDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--space-3)' }}>
                                <Button variant="outline" style={{ flex: 1 }}>View Docs</Button>

                                {/* Role-Based Action Buttons */}
                                {activeRole === 'Secretary' && isPendingSecretary && (
                                    <Button variant="primary" style={{ flex: 1 }} disabled={isApproving} onClick={() => handleAction(app.id, 'Verify')}>
                                        Verify Docs
                                    </Button>
                                )}
                                {activeRole === 'Professor' && isPendingFaculty && (
                                    <Button variant="primary" style={{ flex: 1, background: 'var(--success-text)', color: '#000' }} disabled={isApproving} onClick={() => handleAction(app.id, 'Approve')}>
                                        Approve Academic
                                    </Button>
                                )}
                            </div>
                        </Card>
                    );
                }) : (
                    <div className="stub-page" style={{ gridColumn: '1 / -1' }}>
                        <div className="stub-title">No Pending Applications</div>
                        <div className="stub-subtitle">The queue is currently empty for this department.</div>
                    </div>
                )}
            </div>
        </div>
    );
};