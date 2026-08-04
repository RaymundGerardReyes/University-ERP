import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
    // In a real implementation, these would be fetched via React Query hooks
    // calling various backend endpoints (e.g., admissionsApi, teachingApi, communicationApi)
    const taskSummary = {
        pendingAdmissions: 4,
        pendingGrades: 2,
        unreadMessages: 12,
        classesToday: 3,
    };

    return (
        <div className="fade-in">
            <PageHeader
                title="Faculty Workspace"
                subtitle="Your daily operational overview and pending tasks."
            />

            {/* Actionable Task Widgets */}
            <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-8)' }}>
                <Card className="stat-card" style={{ borderTop: '3px solid var(--warning-text)' }}>
                    <span className="stat-label">Pending Admissions</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <span className="stat-value">{taskSummary.pendingAdmissions}</span>
                        <Link to="/admissions"><Button variant="outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>Review</Button></Link>
                    </div>
                </Card>

                <Card className="stat-card" style={{ borderTop: '3px solid var(--danger-text)' }}>
                    <span className="stat-label">Grades Due</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <span className="stat-value">{taskSummary.pendingGrades}</span>
                        <Link to="/assessments/gradebook"><Button variant="outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>Submit</Button></Link>
                    </div>
                </Card>

                <Card className="stat-card" style={{ borderTop: '3px solid var(--info-text)' }}>
                    <span className="stat-label">Today's Classes</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <span className="stat-value">{taskSummary.classesToday}</span>
                        <Link to="/teaching"><Button variant="outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>View Schedule</Button></Link>
                    </div>
                </Card>

                <Card className="stat-card" style={{ borderTop: '3px solid var(--brand-secondary)' }}>
                    <span className="stat-label">Unread Messages</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <span className="stat-value">{taskSummary.unreadMessages}</span>
                        <Link to="/communication"><Button variant="outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>Open Inbox</Button></Link>
                    </div>
                </Card>
            </div>

            <div className="grid-2 fade-in-delay-2">
                {/* Today's Schedule Preview */}
                <Card style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Today's Schedule</h3>
                        <Badge colorScheme="info">Oct 14</Badge>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--brand-primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>CS-101: Intro to Computing</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>09:00 AM</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Section: BSCS-1A • Room: Lab 402</div>
                        </div>

                        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--brand-primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>CS-305: Database Management</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>01:00 PM</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Section: BSCS-3C • Room: Hall B</div>
                        </div>
                    </div>
                </Card>

                {/* Quick Actions / Announcements */}
                <Card>
                    <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Recent Announcements</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-3)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Midterm Grade Encoding</span>
                                <Badge colorScheme="warning">Important</Badge>
                            </div>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>The portal for midterm grade encoding will close on Friday at 5:00 PM.</p>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Faculty Senate Meeting</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 days ago</span>
                            </div>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Monthly meeting will be held virtually via MS Teams.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};