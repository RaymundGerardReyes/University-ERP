import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import { useQuery } from '@tanstack/react-query';
import { assessmentApi } from '@university-erp/api-clients/academic/assessmentApi';
import React from 'react';

export const EntranceExaminationPage: React.FC = () => {
    const { data: sessions, isLoading } = useQuery({
        queryKey: ['examSessions'],
        queryFn: () => assessmentApi.getExamSessions()
    });
    return (
        <div className="fade-in">
            <PageHeader
                title="Entrance Examination Scheduling"
                subtitle="Manage exam batches, venue capacities, and applicant assignments."
            />

            <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <span className="stat-label">Upcoming Exams</span>
                    <span className="stat-value">{isLoading ? '...' : sessions?.length || 0}</span>
                    <span className="stat-trend">Next 30 days</span>
                </Card>
                <Card className="stat-card">
                    <span className="stat-label">Applicants Scheduled</span>
                    <span className="stat-value">{isLoading ? '...' : sessions?.reduce((acc: number, s: any) => acc + (s.enrolledCount || 0), 0) || 0}</span>
                    <span className="stat-trend" style={{ color: 'var(--warning-text)' }}>45 pending assignment</span>
                </Card>
                <Card className="stat-card">
                    <span className="stat-label">Average Score</span>
                    <span className="stat-value">76.4%</span>
                    <span className="stat-trend">Current Term</span>
                </Card>
            </div>

            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>Upcoming Batches</h2>
                    <Button onClick={() => alert('New batch creation modal will open here.')}>+ Create New Batch</Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {isLoading && <div style={{ color: 'var(--text-muted)' }}>Loading exam sessions...</div>}
                    {sessions?.map((session: any, idx: number) => {
                        const date = new Date(session.startTimeUtc || Date.now());
                        const capacity = session.capacity || 200;
                        const enrolled = session.enrolledCount || 0;
                        const percentFull = Math.min(100, Math.round((enrolled / capacity) * 100));
                        
                        return (
                        <div key={idx} style={{ display: 'flex', gap: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                            <div style={{ width: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                                    {date.toLocaleString('default', { month: 'short' })}
                                </span>
                                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-primary)', lineHeight: 1 }}>
                                    {date.getDate()}
                                </span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{session.name || 'General Admissions Exam'}</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {session.roomNumber || 'Main Hall'}
                                        </p>
                                    </div>
                                    <Badge colorScheme={percentFull >= 95 ? 'warning' : 'info'}>
                                        {percentFull >= 95 ? 'Almost Full' : 'Registration Open'}
                                    </Badge>
                                </div>
                                
                                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                    <div style={{ flex: 1, height: '8px', background: 'var(--bg-base)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${percentFull}%`, height: '100%', background: percentFull >= 95 ? 'var(--warning-text)' : 'var(--brand-primary)' }}></div>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{enrolled} / {capacity} Seats</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', justifyContent: 'center' }}>
                                <Button variant="secondary" size="sm" onClick={() => alert(`Managing roster for session ID: ${session.id}`)}>Manage Roster</Button>
                            </div>
                        </div>
                    )})}
                </div>
            </Card>
        </div>
    );
};
