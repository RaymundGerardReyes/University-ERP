import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useFacultyDashboard } from './Dashboard.hooks';

export const DashboardPage: React.FC = () => {
    const { identity } = useAuth();
    const { data, isLoading, isError } = useFacultyDashboard();

    if (isLoading) return <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--radius-lg)' }} />;
    if (isError || !data) return <div className="stub-page fade-in"><div className="stub-title">Dashboard Unavailable</div></div>;

    const totalStudents = data.courses.reduce((acc, c) => acc + c.enrolledCount, 0);
    const unreadMessages = data.inbox.filter(m => !m.isRead).length;

    return (
        <div className="fade-in">
            <PageHeader
                title={`Welcome, Professor ${identity?.name.split(' ')[1] || 'Faculty'}`}
                subtitle="Here is your academic overview for the current semester."
            />

            {/* Premium Stats Grid from theme.css */}
            <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
                    <span className="stat-label">Active Courses</span>
                    <span className="stat-value">{data.courses.length}</span>
                    <span className="stat-trend" style={{ color: 'var(--text-muted)' }}>Fall 2026</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--brand-secondary)' }} />
                    <span className="stat-label">Total Students</span>
                    <span className="stat-value">{totalStudents}</span>
                    <span className="stat-trend">Across all sections</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: unreadMessages > 0 ? 'var(--warning-text)' : 'var(--text-muted)' }} />
                    <span className="stat-label">Unread Messages</span>
                    <span className="stat-value" style={{ color: unreadMessages > 0 ? 'var(--warning-text)' : 'var(--text-bright)' }}>
                        {unreadMessages}
                    </span>
                    <span className="stat-trend" style={{ color: 'var(--text-muted)' }}>Requires attention</span>
                </Card>
            </div>

            <div className="grid-2 fade-in-delay-2">
                <Card>
                    <h2 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Today's Classes</h2>
                    {data.courses.slice(0, 2).map(course => (
                        <div key={course.id} className="data-row" style={{ alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="data-value" style={{ textAlign: 'left', color: 'var(--text-bright)' }}>{course.courseCode}</span>
                                <span className="data-label">{course.courseName}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', marginTop: 'var(--space-1)' }}>{course.schedule}</span>
                            </div>
                            <Badge colorScheme="info">{course.room}</Badge>
                        </div>
                    ))}
                    <Button variant="outline" style={{ width: '100%', marginTop: 'var(--space-4)' }}>View Full Schedule</Button>
                </Card>

                <Card>
                    <h2 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Recent Communications</h2>
                    {data.inbox.slice(0, 3).map(msg => (
                        <div key={msg.id} className="data-row" style={{ alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    {!msg.isRead && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-primary)' }} />}
                                    <span className="data-value" style={{ textAlign: 'left', fontWeight: msg.isRead ? 500 : 700 }}>{msg.sender}</span>
                                </div>
                                <span className="data-label">{msg.subject}</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {new Date(msg.date).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                    <Button variant="outline" style={{ width: '100%', marginTop: 'var(--space-4)' }}>Open Inbox</Button>
                </Card>
            </div>
        </div>
    );
};